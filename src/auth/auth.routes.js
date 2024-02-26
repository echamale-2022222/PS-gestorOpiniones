import { Router } from "express";
import { check } from "express-validator";
import { login } from "./auth.controller.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { existingEmail, existingUsername } from "../helpers/db-validators.js";

const router = Router();

router.post(
    "/login",
    [
        check('mail', 'This is not a valid email').isEmail(),
        check('password', 'The password is mandatory').not().isEmpty(),
        validateFields,
    ], login)

router.post(
    "/log",
    [
        check('username', 'Username cannot be empty').not().isEmpty(),
        check('password', 'The password is mandatory').not().isEmpty(),
        validateFields,
    ], login)

export default router;