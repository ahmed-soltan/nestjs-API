import { JwtService } from '@nestjs/jwt';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskDto } from 'src/users/dto/Tasks.dto';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
@Controller('api')
export class TasksController {
  constructor(
    private TasksService: TasksService,
    private usersService: UsersService,
  ) {}

  @Post('task')
  @UsePipes(new ValidationPipe())
  async createTask(@Body() task: TaskDto & {userId:string}, @Req() request: Request) {
    const user = await this.usersService.findOne({_id:task.userId})
    console.log(user)
    if(!user){
      throw new UnauthorizedException()
    }
    return this.TasksService.createTask(task.userId, task);
  }
  @Get('task/:id')
  async get(@Param('id') id: string) {
    console.log(id)
    return this.TasksService.getTaskById(id);
  }

  @Delete('task/:id')
  async delete(@Param('id') id: string) {
    console.log(id)
    return this.TasksService.deleteTask(id);
  }

  @Patch('task/:id')
  async updateTask(@Body() task: TaskDto, @Param('id') id: string) {
    return this.TasksService.updateTask(id, task);
  }
}
