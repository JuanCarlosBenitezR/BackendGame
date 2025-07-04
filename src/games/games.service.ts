import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateGameDto, GameState } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Game } from './entities/game.entity';
@Injectable()
export class GamesService {
  private readonly logger = new Logger('GamesService');

  constructor(
    @InjectModel(Game)
    private gameModel: typeof Game,
  ) {}

  async create(createGameDto: CreateGameDto) {
    try {
      const { name, maxPlayers, playerName, state } = createGameDto;
      const newGame = await this.gameModel.create({
        name: name,
        maxPlayers: maxPlayers,
        players: [playerName!],
        state: state || 'waiting',
        score: null,
      });

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
    });
    if (!game) {
      throw new BadRequestException(`Game with id ${id} not found`);
    }
    return game;
  }

  async joinGame(id: number, updateGameDto: UpdateGameDto) {
    const { playerName } = updateGameDto;
    const game = await this.findOne(id);
    if (game.dataValues.players.includes(playerName!)) {
      throw new BadRequestException(
        `Player ${playerName} is already in the game`,
      );
    }
    const newPlayers = [...game.dataValues.players, playerName];
    if (newPlayers.length > game.dataValues.maxPlayers) {
      throw new BadRequestException('Game is full');
    }
    try {
      await game.update({
        players: newPlayers,
      });
      return {
        message: 'Joined succesfully',
      };
    } catch (error) {
      this.handleDBException(error);
    }
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
