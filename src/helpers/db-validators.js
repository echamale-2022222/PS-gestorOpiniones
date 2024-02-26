import User from "../user/user.model.js";

export const existingEmail = async (mail = '') => {
    const emailExists = await User.findOne({mail});
    if (emailExists) {
        throw new Error(`The mail ${mail} are you already registered`);
    }
}

export const existingUsername = async (username = '') => {
    const usernameExists = await User.findOne({username});
    if (usernameExists) {
        throw new Error(`The username ${username} are you already registered`);
    }
}