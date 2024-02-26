import jwt from "jsonwebtoken";
import User from '../user/user.model.js';
import { request, response } from 'express';

export const validateJWT = async(req = request, res = response, next)=> {
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'There is no token in the request',
        });
    }

    try{
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const user = await User.findById(uid);
        if(!user){
            return res.status(401).json({
                msg: "User does not exist in the database"
            });
        }

        if(!user.userStatus){
            return res.status(401).json({
                msg: "Invalid token, user with false status"
            });
        }

        req.user = user;
        next();
        
    }catch(e){
        console.log(e);
        res.status(401).json({
            msg: "Invalid token"
        })
    }
} 
