import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateGameDto, GameState } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from './entities/game.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class GamesService {
  private readonly logger = new Logger('GamesService');

  constructor(
    @InjectModel(Game)
    private gameModel: typeof Game,
    private readonly userService: UsersService,
  ) {}

  async create(createGameDto: CreateGameDto) {
    const { name, maxPlayers, userId, state } = createGameDto;
    try {
      const newGame = await this.gameModel.create({
        name: name,
        maxPlayers: maxPlayers,
        state: state || 'waiting',
        score: null,
      });
      if (userId) {
        const user = await this.userService.findOne(userId);
        await newGame.$add('players', user);
      }
      return newGame;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findOne(id: number) {
    const game = await this.gameModel.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: User,
          as: 'players',
          attributes: ['id', 'fullname', 'email'],
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (!game) {
      throw new NotFoundException(`Game with id ${id} not found`);
      // throw new BadRequestException(`Game with id ${id} not found`);
    }
    return game;
  }

  async joinGame(id: number, updateGameDto: UpdateGameDto) {
    const { userId } = updateGameDto;
    if (!userId) {
      throw new BadRequestException('User ID is required to join the game');
    }
    const game = await this.findOne(id);
    if (game.dataValues.state !== GameState.WAITING) {
      throw new BadRequestException('Game is not joinable');
    }
    const user = await this.userService.findOne(userId);

    const alreadyJoined = game.dataValues.players.find(
      (player) => player.id === userId,
    );
    if (alreadyJoined) {
      throw new BadRequestException('User is already in the game');
    }
    if (game.dataValues.players.length >= game.dataValues.maxPlayers) {
      throw new BadRequestException('Game is full');
    }
    await game.$add('players', user);
    return {
      message: 'User joined the game successfully',
    };
  }

  async startGame(id: number, updateGameDto: UpdateGameDto) {
    const game = await this.findOne(id);
    // if (game.dataValues.state !== 'waiting') {
    //   throw new BadRequestException('Game is already in progress or finished');
    // }
    try {
      await game.update({
        state: GameState.IN_PROGRESS,
      });
      return {
        message: 'Game started successfully',
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async endGame(id: number, updateGameDto: UpdateGameDto) {
    const game = await this.findOne(id);
    // if (game.dataValues.state !== 'waiting') {
    //   throw new BadRequestException('Game is already in progress or finished');
    // }
    try {
      await game.update({
        score: updateGameDto.score,
        state: GameState.FINISHED,
      });
      return {
        message: 'Game ended successfully',
      };
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(status: string = 'waiting') {
    if (
      status !== 'waiting' &&
      status !== 'in_progress' &&
      status !== 'finished'
    ) {
      throw new BadRequestException('Invalid game status');
    }
    const games = await this.gameModel.findAll({
      where: {
        state: status,
      },
      include: [
        {
          model: User,
          as: 'players',
          attributes: ['id', 'fullname', 'email'],
          through: {
            attributes: [],
          },
        },
      ],
    });
    return games;
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
