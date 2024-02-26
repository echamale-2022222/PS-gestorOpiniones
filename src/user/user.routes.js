import { Router } from "express";
import { check } from "express-validator";
import { userPost } from "./user.controller.js";
import { existingEmail, existingUsername } from "../helpers/db-validators.js";
import { validateFields } from "../middlewares/validate-fields.js";

const router = Router();

router.post(
    "/",
    [
        check("username", "Username cannot be empty").not().isEmpty(),
        check("username").custom(existingUsername),
        check("mail", "This is not a valid email").isEmail(),
        check("mail").custom(existingEmail),
        check("password", "Password must be greater than 6 characters").isLength({min:6}),
        validateFields,
    ], userPost);

export default router;