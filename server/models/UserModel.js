import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
   email: {
       type: String,
       required: [true, "Email is required"],
       unique: true,
   },
    password: {
         type: String,
         required: [true, "Password is required"],
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    image: {
       type: String,
        required: false,
    },
    color: {
       type: Number,
        default: 0,
        required: false,
    },
    profileSetup: {
       type: Boolean,
        required: false,
    },
});

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with stored hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;