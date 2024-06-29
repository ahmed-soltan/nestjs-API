import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema, Tasks } from 'src/Schemas/Tasks.schema';
import { User, UserSchema } from 'src/Schemas/User.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: Tasks.name,
        schema: TaskSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    UsersModule
  ],
  providers: [TasksService],
  controllers: [TasksController]
})

export class TasksModule {}
