import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Game } from 'src/games/entities/game.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from './interfaces/user-role.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');
  constructor(
    @InjectModel(User)
    private userModel: typeof User,

    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { fullname, email, password } = createUserDto;
    try {
      const newUser = await this.userModel.create({
        fullname: fullname,
        email: email,
        password: bcrypt.hashSync(password, 12),
        rol: [UserRole.PLAYER], // Default role for new users
        isActive: true,
      });
      return {
        message: 'User created successfully',
        user: {
          id: newUser.id,
          fullname: newUser.dataValues.fullname,
          email: newUser.dataValues.email,
        },
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({
      where: {
        email: email,
        isActive: true,
      },
    });

    if (!user || !bcrypt.compareSync(password, user.dataValues.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    return {
      token: this.getJwtToken({ id: user.dataValues.id }),
      user: {
        id: user.dataValues.id,
        fullname: user.dataValues.fullname,
        email: user.dataValues.email,
      },
    };
  }

  findAll() {
    const users = this.userModel.findAll({
      where: {
        isActive: true,
      },
      include: [
        {
          model: Game,
          through: {
            attributes: [],
          },
        },
      ],
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.userModel.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
      // throw new BadRequestException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    try {
      return user.update(updateUserDto);
    } catch (error) {
      this.handleDBException(error);
    }
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    try {
      await user.update({
        isActive: false,
      });
      return `The user #${id} has been desactivated`;
    } catch (error) {
      this.handleDBException(error);
    }
  }
  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleDBException(error: any) {
    if (error.parent.code === '23505') {
      throw new BadRequestException(error.parent.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Something went wrong, check server logs',
    );
  }
}
