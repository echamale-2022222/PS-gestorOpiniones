import { Router } from "express";
import { check } from "express-validator";
import { publicationCommentsPut, publicationPost } from "./publication.controller.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

router.post(
    "/",
    [
        validateJWT,
        check("title", "The title of the post cannot be empty.").not().isEmpty(),
        check("category", "The post category cannot be empty.").not().isEmpty(),
        check("maintext", "The main text of the publication cannot be empty").not().isEmpty(),
        validateFields
    ], publicationPost);

router.put(
    "/:id",
    [
        validateJWT,
        check("id", "It is not a valid id").isMongoId(),
        validateFields,
    ], publicationCommentsPut);

export default router;