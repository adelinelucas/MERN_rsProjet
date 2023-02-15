import * as PostModel from '../models/post.model.js';
import * as UserModel from "../models/user.model.js";
import fs from "fs";
import { promisify } from "util";
import { uploadError } from "../utils/errors.utils.js";
import stream from "stream"
const pipeline = promisify(stream.pipeline);
import mongoose from 'mongoose';
const ObjectID = mongoose.Types.ObjectId;

export const readPost = (req, res) =>{
    PostModel.find((err, docs)=>{
        if(!err) res.send(docs);
        else console.log('Error to get data :' + err);
    }).sort({ createdAt: -1 });
}

export const createPost = async (req, res) =>{
    let fileName;

    if(req.file !== null){
        try {
            if (
                req.file.detectedMimeType  != "image/jpg" 
                && req.file.detectedMimeType  != "image/png" 
                && req.file.detectedMimeType  != "image/jpeg" 
                )
                throw Error('invalid file');
    
            if(req.file.size > 500000) throw Error('max size');
        } catch (err) {
            const errors = uploadError(err) ;
            return res.status(201).json({errors});
        }
    
        fileName = req.body.posterId + Date.now() + ".jpg";

        await pipeline(
            req.file.stream,
            fs.createWriteStream(
            `${__dirname}/../client/public/uploads/posts/${fileName}`
            )
        );
    }

    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
        picture: req.file != null ? "./uploads/posts/" + fileName : "", 
        video: req.body.video,
        likers: [],
        comments: []
    });

    try{
        const post = await newPost.save();
        return res.status(201).json(post);
    }catch(err) {
        return res.status(400).send(err)
    }
}

export const updatePost = (req, res) =>{
    if(!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown : ' + req.params.id);

    const updatedRecord = {
        message: req.body.message
    }

    PostModel.findByIdAndUpdate(
        req.params.id,
        {$set: updatedRecord},
        {new: true},
        (err, docs) =>{
            if(!err) res.send(docs);
            else console.log("Update Errror : " + err )
        }
    )
}

export const deletePost = (req, res) =>{
    if(!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown : ' + req.params.id);

    PostModel.findByIdAndRemove(
        req.params.id,
        (err, docs) =>{
            if(!err) res.send(docs);
            else console.log("Delete error : " + err)
        }
    )
}

export const likePost = async (req, res) => {
    if(!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id, 
            {$addToSet: { likers: req.body.id } },
            {new: true },
            // (err, docs) =>{
            //     if(err) return res.status(400).send(err);
            // }
        )
        .catch((err) => res.status(400).send({ message: err })),

        await UserModel.findByIdAndUpdate(
            req.body.id,
            {$addToSet: { likes: req.params.id } },
            { new: true, upsert: true },
            // (err, docs) => {
            //   if (!err) res.send(docs);
            //   else return res.status(400).send(err);
            // }
        )
        .then((data) => res.send(data))
        .catch((err) => res.status(400).send({ message: err }))
    } catch(error) {
        return res.status(400).send(error);
    }
}

export const unlikePost = async (req, res) => {
    if(!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id, 
            {$pull: { likers: req.body.id } },
            {new: true },
        )
        .catch((err) => res.status(400).send({ message: err })),

        await UserModel.findByIdAndUpdate(
            req.body.id,
            {$pull: { likes: req.params.id } },
            { new: true, upsert: true },
        )
        .then((data) => res.send(data))
        .catch((err) => res.status(400).send({ message: err }))
    } catch(error) {
        return res.status(400).send(error);
    }

}

export const commentPost = (req,res) =>{
    if(!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            { $push: {
                comments: {
                    commenterId: req.body.commenterId,
                    commenterPseudo: req.body.commenterPseudo,
                    text: req.body.text,
                    timestamp: new Date().getTime(),
                    }
                }
            },
            {new: true}
        )
        .then((data) => res.send(data))
        .catch((err) => res.status(400).send(err))

    }catch(err){
        return res.status(400).send(error);
    }
}

export const editCommentPost = (req,res ) =>{
    if(!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        return PostModel.findById(
            req.params.id, 
            (err, docs) => {
                const theComment = docs.comments.find((comment) =>
                    comment._id.equals(req.body.commentId)
                );
      
                if (!theComment) return res.status(404).send("Comment not found");
                    theComment.text = req.body.text;
      
                return docs.save((err) => {
                     if (!err) return res.status(200).send(docs);
                 return res.status(500).send(err);
                });
            }
        );
    } catch(err){
        return res.status(400).send(error);
    }
}

export const deleteCommentPost = (req,res ) =>{
    if(!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id, 
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId,
                    }
                }
            },
            {new: true},
            (err, docs) => {
                if (!err) return res.send(docs);
                else return res.status(400).send(err);
            }
        )
    }catch(err){
        return res.status(400).send(error);
    }
}