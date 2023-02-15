import mongoose from 'mongoose';
// import {isEmail} from 'validator';
import pkg from 'validator';
const {isEmail} = pkg
import bcrypt from 'bcrypt';
// const { userInfo } = require('../controllers/user.controller');

const userSchema = new mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true,
            minLength:3,
            maxLength:55,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            max:1024,
            minlength:6,
            trim: true
        },
        picture: {
            type: String,
            default: "./uploads/avatar.png"
        },
        bio :{
            type: String,
            max: 1024,
        },
        followers: {
            type: [String]
        },
        following: {
            type: [String]
        },
        likes: {
            type: [String]
        }
    },
    {
      timestamps: true,
    }
);

// crypter le mdp
//play function before save into display: 'block';
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// lors du login pour récupérer les mots de passes
// on compare le mot de passe de connexion au mdp en bdd en passant par bcrytp
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error("incorrect password");
    }
    throw Error("incorrect email");
};

const UserModel = mongoose.model("user", userSchema);
// module.exports = UserModel;
export default UserModel;