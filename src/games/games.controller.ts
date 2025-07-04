import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(+id);
  }

  @Patch(':id/join')
  joinGame(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.joinGame(+id, updateGameDto);
  }

  @Patch(':id/start')
  startGame(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.startGame(+id, updateGameDto);
  }

  @Patch(':id/end')
  endGame(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.endGame(+id, updateGameDto);
  }
}
