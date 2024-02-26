import bcryptjs from 'bcryptjs';
import User from '../user/user.model.js'
import { generateJWT } from '../helpers/generate.jwt.js';

export const login = async (req, res) => {
    const { username, mail, password } = req.body;

    try {
        let user = await User.findOne({ mail });

        if (!user) {
            user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({
                    msg: "Incorrect credentials"
                })
            }
        }

        if (!user.userStatus) {
            return res.status(400).json({
                msg: "The user does not exist in the database"
            });
        }

        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Password is incorrect"
            });
        }

        const token = await generateJWT( user.id );

        return res.status(200).json({
            msg: "Welcome!!!",
            user,
            token
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            msg: "Contact the owner"
        })
    }
}