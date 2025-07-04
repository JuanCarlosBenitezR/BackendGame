import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { Sequelize } from 'sequelize';
import { SequelizeModule } from '@nestjs/sequelize';
import { Game } from './entities/game.entity';

@Module({
  controllers: [GamesController],
  providers: [GamesService],
  imports: [SequelizeModule.forFeature([Game])],
})
export class GamesModule {}
