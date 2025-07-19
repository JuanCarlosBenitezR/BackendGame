import { InjectModel } from '@nestjs/sequelize';
import { User } from '../entities/user.entity';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envs } from 'src/config/envs';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../jwt-payload.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET') || envs.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayload) {
    const { id } = payload;
    const user = await this.userModel.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException(`Token not valid`);
    }
    if (!user.dataValues.isActive) {
      throw new BadRequestException('User is not active');
    }
    return user;
  }
}
