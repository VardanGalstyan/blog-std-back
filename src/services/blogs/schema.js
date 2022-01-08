import mongoose from "mongoose";

const { Schema, model } = mongoose


const ArticleSchema = new Schema(
    {
        title: { type: String, required: true },
        main_text: { type: String, required: false },
        author: { type: Schema.Types.ObjectId, ref: 'User' },
        main_text: { type: String, required: false },
        category: { type: String, required: false },
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    },
    { timestamps: true }
)


export default model("Blog", ArticleSchema)