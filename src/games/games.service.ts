import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
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
      const { name, maxPlayers, players, state } = createGameDto;
      const newGame = await this.gameModel.create({
        name: name,
        maxPlayers: maxPlayers,
        players: players || [],
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

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
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
