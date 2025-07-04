import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum GameState {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
}
export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(2)
  maxPlayers: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  players?: string[];

  @IsEnum(GameState)
  @IsOptional()
  state?: GameState;

  @IsObject()
  @IsOptional()
  score?: Record<string, number>;
}
