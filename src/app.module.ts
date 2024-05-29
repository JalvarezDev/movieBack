import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entities/user.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Lolero891',
      database: 'MovieRepo',
      entities: [User], // Aquí debes agregar las entidades de tu aplicación
      synchronize: true, // Solo para entornos de desarrollo
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
