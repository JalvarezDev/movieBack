import { Controller, Post, Body, HttpException, Get, Req, NotFoundException, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { MovieDto } from './Dto/movie.dto';

@Controller('auth') 
export class AuthController {

    constructor(
        private authService: AuthService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    @Post('login')
    login(@Body() u: User) {
        const user = this.authService.Login(u.name, u.password, u.email);
        return user;
    }

    @Post('createUser')
    async createUser(@Body() user: User) {
        const newUser = await this.authService.createUser(user.name, user.password, user.email, user.token, user.role);
        return newUser;
    }

    @Get('users')
    async getUsers() {
        const users = await this.userRepository.find();
        return users;
    }

    @Get('verify-token')
    async verifyToken(@Req() req) {
        const token = req.headers.authorization.split(' ')[1];
        const user = await this.authService.verifyToken(token);
        return user;
    }

    @Get('user')
    async getUser(@Req() req) {
        const token = req.headers.authorization.split(' ')[1];
        const user = await this.userRepository.findOne({where: {token}});
        return user;
    }

    @Post('add-movie')
async addMovie(@Req() req, @Body() movieDto: Object) {
  const token = req.headers.authorization.split(' ')[1];
  const user = await this.userRepository.findOne({where: {token}});

  if (!user) {
    throw new NotFoundException('User not found');
  }

  user.favMovies.push(movieDto);

  await this.userRepository.save(user);

  return {message: 'Movie added', user};
}

@Post('delete-movie')
async deleteMovie(@Req() req, @Body() movieDto: MovieDto) {
  const token = req.headers.authorization.split(' ')[1];
  const user = await this.userRepository.findOne({where: {token}});
  if (!user) {
    throw new NotFoundException('User not found');
  }
  
  user.favMovies = user.favMovies.filter((movie: MovieDto) => movie.Title !== movieDto.Title);

  await this.userRepository.save(user);

  return {message: 'Movie deleted', user};

}

@Get('favmovies')
async getFavs(@Req() req){
  const token = req.headers.authorization.split(' ')[1];
  const movies = await this.authService.getFavMovies(token)
  return movies
}

}
