import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table
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
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  players: string[];

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
}
