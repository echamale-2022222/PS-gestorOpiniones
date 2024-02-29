import { Router } from "express";
import { check } from "express-validator";
import { updateUser, userPost } from "./user.controller.js";
import { existingEmail, existingUsername } from "../helpers/db-validators.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

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

router.put(
    "/:id",
    [
        validateJWT,
        check("id", "This is not a valid id").isMongoId(),
        validateFields,
    ], updateUser);
export default router;