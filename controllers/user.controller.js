import UserModel from '../models/user.model.js';
import mongoose from 'mongoose';
const ObjectID = mongoose.Types.ObjectId;

export const getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}
//select('-password') permet de sélectionner toutes les infos sauf celles que l'on ne veut pas 

export const userInfo = (req, res) => {
    console.log(req.params);
// on test si l'id passé en param est présent dans la bdd
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID inconnu : ' + req.params.id);

    UserModel.findById(req.params.id, (err, docs) => {
        if(!err) res.send(docs);
        else console.log('ID inconnu : ' + err);
    }).select('-password');
}

export const updateUser = async (req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID inconnu : ' + req.params.id);

    try{
        await UserModel.findOneAndUpdate(
            { _id: req.params.id}, 
            {
                $set: {
                    bio: req.body.bio
                }
            },
            {new: true, upsert: true, setDefaultsOnInsert: true})
        .then((data) => res.send(data))
        .catch((err) => res.status(500).send({ message: err }));          
    } catch (err) {
        return res.status(500).json({message : err});
    }

}

export const deleteUser = async(req, res) => {
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID inconnu : ' + req.params.id);

    try{                
        await UserModel.deleteOne({_id: req.params.id}).exec();
        res.status(200).json({message: "Donnée supprimée avec succès ! "}); 
    }catch (err) {
        return res.status(500).json({message : err});
    }
}

export const follow = async (req, res) => {
    if (
      !ObjectID.isValid(req.params.id) ||
      !ObjectID.isValid(req.body.idToFollow)
    )
      return res.status(400).send("ID inconnu : " + req.params.id);
  
    try {
        // add to the follower list
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.body.idToFollow } },
            { new: true, upsert: true })
        .then((data) => res.send(data))
        .catch((err) => res.status(500).send({ message: err })),
  
        // add to following list
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: { followers: req.params.id }},
            { new: true, upsert: true })
        // .then((data) => res.send(data))
        // .catch((err) => res.status(500).send({ message: err }))
    } catch (err) {
      return res.status(500).json({ message: err });
    }
};

export const unfollow = async (req, res) => {
    if (
      !ObjectID.isValid(req.params.id) ||
      !ObjectID.isValid(req.body.idToUnfollow)
    )
      return res.status(400).send("ID inconnu : " + req.params.id);
  
    try {
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.body.idToUnfollow } },
            { new: true, upsert: true })    
        .then((data) => res.send(data))
        .catch((err) => res.status(500).send({ message: err })),
  
        // Retirer de la liste des followers
        await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            { $pull: { followers: req.params.id } },
            { new: true, upsert: true })
        // .then((data) => res.send(data))
        // .catch((err) => res.status(500).send({ message: err }))
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }