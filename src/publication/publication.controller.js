import { request, response } from "express";
import Publication from "./publication.model.js";

export const publicationPost = async (req = request, res = response) => {
    const username = req.user.username;
    const { title, category, maintext } = req.body;

    console.log('user:', username)

    const publication = new Publication({ username, title, category, maintext });

    await publication.save();

    res.status(200).json({
        msg: "Post created successfully",
        publication
    })
}

export const seePosts = async (req = request, res = response) => {
    const query = { publicationStatus: true };

    const [quantityPublication, publications] = await Promise.all([
        Publication.countDocuments(query),
        Publication.find(query)
    ]);

    res.status(200).json({
        msg: "Published publications",
        quantityPublication,
        publications
    });
}

export const publicationCommentsPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, username, title, category, publicationStatus, ...rest } = req.body;

    const usernameC = req.user.username;

    const newComment = { usernameC: usernameC, ...rest };

    await Publication.findByIdAndUpdate(id, { $push: { comments: newComment } });

    const publication = await Publication.findOne({ _id: id });

    res.status(200).json({
        msg: "added comment",
        publication
    });
}


export const updateMyPost = async (req = request, res = response) => {
    const { id } = req.params;
    const username = req.user.username

    try {
        const publication = await Publication.findById(id);

        if (publication.username === username) {
            const { _id, username, publicationStatus, ...rest } = req.body;
            await Publication.findByIdAndUpdate(id, rest);

            const publicationN = await Publication.findOne({ _id: id });

            res.status(200).json({
                msg: "Updated post",
                publicationN
            });
        } else {
            res.status(403).json({
                msg: "You are not the one who made this post"
            })
        }
    } catch (e) {
        return res.status(500).json({
            msg: "Internal Server Error"
        });
    }
}

export const deleteMyPost = async (req = request, res = response) => {
    const { id } = req.params;
    const username = req.user.username;

    try {
        const publication = await Publication.findById(id);

        if (publication.username === username) {

            const publication = await Publication.findByIdAndUpdate(id, { publicationStatus: false });
            const publicationDel = await Publication.findOne({ _id: id });

            res.status(200).json({
                msg: "Post successfully deleted",
                publicationDel
            })
        } else {
            res.status(403).json({
                msg: "You did not create this post, you do not have permission to delete it."
            })
        }
    } catch (e) {
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
}

export const updateMyComment = async (req = request, res = response) => {
    const { publicationID, commentID } = req.params;
    const usernamec = req.user.username;

    try {
        const publication = await Publication.findById(publicationID);

        if (!publication) {
            return res.status(404).json({ msg: "Post not found" });
        }

        if (!publication.publicationStatus) {
            return res.status(403).json({ msg: "You can't update comments on an inactive post" });
        }

        const comentario = publication.comments.find(comment => comment._id.toString() === commentID);

        if (!comentario) {
            return res.status(404).json({ msg: "Comment not found" });
        }

        if (comentario.usernameC === usernamec) {
            const { _id, ...rest } = req.body;

            await Publication.findOneAndUpdate(
                { _id: publicationID, "comments._id": commentID },
                { $set: { "comments.$.content": rest.content, "comments.$.otherField": rest.otherField, "comments.$.usernameC": usernamec } }
            );

            const publicationN = await Publication.findOne({ _id: publicationID });

            res.status(200).json({
                msg: "Comment updated successfully",
                publicationN
            });
        } else {
            res.status(403).json({
                msg: "You are not the author of this comment"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

export const deleteMyComment = async (req = request, res = response) => {
    const { publicationID, commentID } = req.params;
    const usernamec = req.user.username;

    try {
        const publication = await Publication.findById(publicationID);

        if (!publication) {
            return res.status(404).json({ msg: "Post not found" });
        }

        if (!publication.publicationStatus) {
            return res.status(403).json({ msg: "You can't delete comments from an inactive post" });
        }

        const comentario = publication.comments.find(comment => comment._id.toString() === commentID);

        if (!comentario) {
            return res.status(404).json({ msg: "Comment not found" });
        }

        if (comentario.usernameC === usernamec) {
            await Publication.findOneAndUpdate(
                { _id: publicationID },
                { $pull: { comments: { _id: commentID, usernameC: usernamec } } }
            );

            const publicationN = await Publication.findOne({ _id: publicationID });

            res.status(200).json({
                msg: "Comment successfully deleted",
                publicationN
            });
        } else {
            res.status(403).json({
                msg: "You are not the author of this comment"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};
