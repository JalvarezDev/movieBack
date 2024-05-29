// user.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'users'})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;


  @Column()
  email: string;

  
    @Column({nullable: true})
    role: string;

    @Column({nullable: true})
    token: string;

    @Column("json", { nullable: true, default: []})
    favMovies: object[];
}
