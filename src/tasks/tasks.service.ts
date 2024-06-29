import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tasks } from 'src/Schemas/Tasks.schema';
import { User } from 'src/Schemas/User.schema';
import { TaskDto } from 'src/users/dto/Tasks.dto';
import { LoginUserDto } from 'src/users/dto/User.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Tasks.name) private tasksModel: Model<TaskDto>,
    @InjectModel(User.name) private UsersModel: Model<LoginUserDto>,
  ) {}

  async createTask(id: string, task: TaskDto) {
    const user = await this.UsersModel.findById(id);
    if (!user) return null;
    const newTask = await this.tasksModel.create(task);
    const savedTask = await newTask.save();

    await user.updateOne({
      $push: {
        tasks: savedTask._id,
      },
    });

    return savedTask;
  }

  async getTaskById(id: string) {
    return this.tasksModel.findById(id);
  }

  async deleteTask(id: string) {
    const result = await this.tasksModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return result;
  }

  async updateTask(id: string, newTask: TaskDto) {
    const updatedTask = await this.tasksModel.findByIdAndUpdate(id, newTask, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return updatedTask;
  }
}
