import mongoose from "mongoose";

const { Schema, model } = mongoose


const CommentSchema = new Schema(
    {
        comment: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
)


export default model("Comment", CommentSchema)