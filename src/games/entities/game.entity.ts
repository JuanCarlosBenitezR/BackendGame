import {
  Table,
  Model,
  Column,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { GamePlayer } from './game-player.entity';
import { User } from 'src/users/entities/user.entity';

@Table({
  tableName: 'games',
  timestamps: true,
})
export class Game extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  maxPlayers: number;

  @Column({
    type: DataType.ENUM('waiting', 'in_progress', 'finished'),
    defaultValue: 'waiting',
  })
  state: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  score: Record<string, number>;

  @BelongsToMany(() => User, () => GamePlayer)
  players: User[];
}
