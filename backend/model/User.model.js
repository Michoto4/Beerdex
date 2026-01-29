import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter a Username"],
        unique: [true, "Username Exists"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        unique: false
    },
    email: {
        type: String,
        required: [true, "Please enter a email"],
        unique: true
    },
    profile: {type: String}
});

export default mongoose.model.Users || mongoose.model('User', UserSchema);