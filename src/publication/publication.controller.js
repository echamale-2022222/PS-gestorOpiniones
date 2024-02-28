import { request, response } from "express";
import Publication from "./publication.model.js";

export const publicationPost = async (req = request, res = response) => {
    const username = req.user.username;
    const { title, category, maintext } = req.body;

    console.log('user:', username )

    const publication = new Publication({username, title, category, maintext});

    await publication.save();

    res.status(200).json({
        msg: "Post created successfully",
        publication
    })
}

export const publicationCommentsPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, username, title, category, ...rest } = req.body;

    const usernameC = req.user.username;

    const newComment = {usernameC: usernameC, ...rest};

    await Publication.findByIdAndUpdate(id, {$push: {comments: newComment} });

    const publication = await Publication.findOne({_id: id});

    res.status(200).json({
        msg: "added comment",
        publication
    })

    
}