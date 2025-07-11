import {
  Column,
  DataType,
  Table,
  Model,
  BelongsToMany,
} from 'sequelize-typescript';
import { GamePlayer } from 'src/games/entities/game-player.entity';
import { Game } from 'src/games/entities/game.entity';

@Table
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullname: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @BelongsToMany(() => Game, () => GamePlayer)
  games: Game[];
}
