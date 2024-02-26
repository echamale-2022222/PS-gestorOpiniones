import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    username:{
        type: String,
        required: [true, "Username is required"],
        unique: true
    },
    mail:{
        type: String,
        required: [true, "Email is mandatory"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "Password is required"]
    },
    userStatus:{
        type: Boolean,
        default: true
    }
});

UserSchema.methods.toJSON = function(){
    const { __v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
}

export default mongoose.model('User', UserSchema);