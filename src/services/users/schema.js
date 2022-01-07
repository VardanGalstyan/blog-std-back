import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const { Schema, model } = mongoose

const UserSchema = new Schema(
    {
        nickname: { type: String, required: true },
        email: {
            type: String,
            unique: true,
            sparse: true,
            required: [true, 'User email is required!'],
            dropDups: [true, 'A user with a similar email address already exists']
        },
        password: { type: String, required: false },
    },
    { timestamps: true }
)

UserSchema.pre("save", async function (next) {
    const newUser = this
    const plainPW = newUser.password

    if (newUser.isModified("password")) {
        newUser.password = await bcrypt.hash(plainPW, 10)
    }
    next()
})

UserSchema.methods.toJSON = function () {
    const userDocument = this
    const userObject = userDocument.toObject()
    delete userObject.password
    delete userObject.__v
    return userObject
}

UserSchema.statics.checkCredentials = async function (email, plainPW) {
    const user = await this.findOne({ email })
    if (user) {
        const isMatch = await bcrypt.compare(plainPW, user.password)
        if (isMatch) return user
        else return null
    } else {
        return null
    }
}

export default model("User", UserSchema)