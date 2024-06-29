import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Tasks{

    @Prop({required: true})
    title: string;

    @Prop({required: true})
    description: string;

    @Prop({required: false})
    date: Date;

    @Prop({required: false , default:"todo"})
    status: "todo" | "completed" | "in progress" | "canceled" ;

    @Prop({ required: false, default: Date.now })
    createdAt: Date;

    @Prop({ required: true })
    dueDate: Date;



}


export const TaskSchema = SchemaFactory.createForClass(Tasks)