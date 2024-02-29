import { Router } from "express";
import { check } from "express-validator";
import { deleteMyPost, publicationCommentsPut, publicationPost, seePosts, updateMyComment, updateMyPost } from "./publication.controller.js";
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

router.get("/", seePosts);

router.put(
    "/:id",
    [
        validateJWT,
        check("id", "It is not a valid id").isMongoId(),
        validateFields,
    ], publicationCommentsPut);

router.put(
    "/updateMyPost/:id",
    [
        validateJWT,
        check("id", "It is not a valid id").isMongoId(),
        validateFields,
    ], updateMyPost);

router.delete(
    "/deleteMyPost/:id",
    [
        validateJWT,
        check("id", "It is not a valid id").isMongoId(),
        validateFields,
    ], deleteMyPost);

router.put(
    "/:idPublicacion/:idComentario",
    [
        validateJWT,
        check("idPublicacion", "It is not a valid id").isMongoId(),
        check("idComentario", "It is not a valid id").isMongoId(),
        validateFields,
    ], updateMyComment);

    //"/:idPublicacion/:idComentario",

export default router;