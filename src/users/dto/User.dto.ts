import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { TaskDto } from './Tasks.dto';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  linkedinUrl: string;



}

export class LoginUserDto {

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

}


export class User{
  _id:string
  username: string;
  email: string;
  password: string;
  linkedinUrl: string;
  tasks: TaskDto[];

}