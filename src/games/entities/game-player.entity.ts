import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Game } from './game.entity';
import { User } from 'src/users/entities/user.entity';
@Table({
  tableName: 'game_players',
  timestamps: true,
})
export class GamePlayer extends Model {
  @ForeignKey(() => Game)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  gameId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;
}
