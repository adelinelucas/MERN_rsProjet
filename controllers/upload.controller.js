import UserModel from "../models/user.model.js";
import fs from "fs";
import { promisify } from "util";
import { uploadError } from "../utils/errors.utils.js";
import stream from "stream"
const pipeline = promisify(stream.pipeline);

export const uploadProfil = async (req, res) => {
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

    const fileName = req.body.name + ".jpg";

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
          `${__dirname}/../client/public/uploads/profil/${fileName}`
        )
    );

    try{
        await UserModel.findByIdAndUpdate(
            req.body.userId,
            {$set: {picture: "./uploads/profil/" + fileName}},
            {new: true, upsert: true, setDefaultsOnInsert: true},
            // (err, docs) =>{
            //     if(!err) return res.send(docs);
            //     else return res.status(500).send({message: err})
            // }
        )
        .then((data) => res.send(data))
        .catch((err) => res.status(500).send({message: err}))
    }catch(err){
        return res.status(500).json({message: err});
    }
}