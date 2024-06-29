import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://ahmed:ahmed123@cluster0.wnzm6dg.mongodb.net/mongodb-nest',
    ),
    UsersModule,
    TasksModule,
    JwtModule.register({ global: true, secret: 'secret123' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
