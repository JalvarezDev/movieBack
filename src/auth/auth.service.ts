import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './Dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'; // Asegúrate de importar tu entidad User
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {
    
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}


    async createUser(name: string, password: string, email: string, token: string, role: string): Promise<User | { message?: string }> {
        const existingUser = await this.userRepository.findOne({ where: [{ name }, { email }] });

        if (existingUser) {
            return{ message : 'User already exists'};
        }
        password = await hashPassword(password);
        const newUser = this.userRepository.create({ name, password, email, token, role });
        return await this.userRepository.save(newUser);
    }


    async Login(name: string, password: string, email?: string): Promise<{ message: string, token?: string } > {
        const user = await this.userRepository.findOne({ where: [{name}, {password}] });

        if (user && await bcrypt.compare(password, user.password)) {
            const token = this.jwtService.sign({ name });
            user.token = token;
            await this.userRepository.save(user);
            return { message: 'User logged in', token};
        } else {
            return { message: 'User not found' };
        }
    }

    async getUsers() {
        return await this.userRepository.find();
    }

    //$2b$10$09wfAWvZXUiHxtOx4FA1F.FEAZ.aeIWdBWfw8qrD8kd.mpPEckzGK
    async verifyToken(token: string): Promise<String | User | Boolean> {
        try {
            const user = this.jwtService.verify(token);
            return true;
        } catch (error) {
            return false;
        }
        }

        async getFavMovies(token: string): Promise<any> 
        {
            const userdb = await this.userRepository.findOne({where: {token}});
            if (userdb && this.verifyToken(token)){
                console.log(this.verifyToken(token))
                return userdb.favMovies;
            } else {
               console.log("error")
            }
        }

        

    
}

async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}
