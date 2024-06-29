import { UsersService } from 'src/users/users.service';
import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  Get,
  UnauthorizedException,
  BadRequestException,
  Param,
  HttpException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { RegisterUserDto } from './dto/User.dto';

@Controller('api')
export class UsersController {
  constructor(
    private readonly UsersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterUserDto) {
    const { username, email, password, linkedinUrl } = registerDto;

    const existingUser = await this.UsersService.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await this.UsersService.create({
      username,
      email,
      password: hashedPassword,
      linkedinUrl,
    });

    delete user.password;

    return user;
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.UsersService.findOne({ email });

    if (!user) {
      throw new BadRequestException('invalid credentials');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('invalid credentials');
    }

    const jwt = await this.jwtService.signAsync({ id: user._id });

    response.cookie('jwt', jwt, { httpOnly: true });
    delete user.password;
    return user;
  }

  // @Get('user')
  // async user(@Req() request: Request) {
  //   try {
  //     const cookie = request.cookies['jwt'];
  //     const data = await this.jwtService.verifyAsync(cookie);

  //     if (!data) {
  //       throw new UnauthorizedException();
  //     }

  //     const user = await this.UsersService.findOne({ _id: data['id'] });
  //     const { password, ...result } = user;

  //     console.log(result);

  //     return result;
  //   } catch (e) {
  //     throw new UnauthorizedException();
  //   }
  // }
  @Get('user/:id')
  async getUserById(@Param('id') id: string) {
    const _id = id
    const user = await this.UsersService.findOne({ _id });
    console.log(user)
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'success',
    };
  }
}
