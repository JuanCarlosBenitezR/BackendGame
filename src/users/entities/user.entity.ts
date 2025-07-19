import {
  Column,
  DataType,
  Table,
  Model,
  BelongsToMany,
} from 'sequelize-typescript';
import { GamePlayer } from 'src/games/entities/game-player.entity';
import { Game } from 'src/games/entities/game.entity';
import { UserRole } from '../interfaces/user-role.interface';

@Table({
  tableName: 'users',
  timestamps: true,
})
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
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.ARRAY(DataType.ENUM(UserRole.ADMIN, UserRole.PLAYER)),
    allowNull: false,
  })
  rol: UserRole[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @BelongsToMany(() => Game, () => GamePlayer)
  games: Game[];
}
