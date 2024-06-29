import { Prop, Schema , SchemaFactory } from "@nestjs/mongoose";
import { Tasks } from "./Tasks.schema";
import mongoose from "mongoose";

@Schema()
export class User{
    @Prop({required: true, unique: true})
    username:string
    @Prop({required: true, unique: true})
    email:string
    @Prop({required: true})
    password:string
    @Prop({required: true})
    linkedinUrl:string

    @Prop({required: true})
    profilePhoto:string

    @Prop({type:[{type:mongoose.Schema.Types.ObjectId, ref:'Tasks'}]})
    tasks:Tasks[]
}

export const UserSchema = SchemaFactory.createForClass(User)