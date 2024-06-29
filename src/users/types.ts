import { TaskDto } from "./dto/Tasks.dto";

export type UserEntity = {
  _id: string;
  username: string;
  email: string;
  password: string;
  linkedinUrl: string;
  tasks: TaskDto[];
}
