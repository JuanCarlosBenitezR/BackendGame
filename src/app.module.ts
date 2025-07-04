import { Module } from '@nestjs/common';
import { GamesModule } from './games/games.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { envs } from './config/envs';

@Module({
  imports: [
    GamesModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: envs.DATABASE_HOST,
      port: envs.DATABASE_PORT,
      username: envs.DATABASE_USERNAME,
      password: envs.DATABASE_PASSWORD,
      database: envs.DATABASE_NAME,
      autoLoadModels: true,
      synchronize: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // This is important for self-signed certificates
        },
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
