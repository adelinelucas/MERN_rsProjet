// pour l'inscription // connexion et déconnection de l'utilisateur 

const UserModel = require('../models/user.model');
// on a chargé la librairie JSON WEB Token qui va nous permettre de gérer la sécurité de la connection à notre application 
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errors.utils');
const maxAge = 3 * 21 * 60 * 60 * 1000 ;

const createToken = (id) =>{
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
};

module.exports.signUp = async (req, res) => {
    console.log(req.body);
    const {pseudo, email, password} = req.body

    try{
        const user = await UserModel.create({pseudo, email, password});
        res.status(201).json({user: user._id});
    }
    catch (error){
        const errors = signUpErrors(error);
        res.status(200).send({errors})
    }
} 


module.exports.signIn = async (req, res) => {
    const {email, password} = req.body;
    console.log(req.body);
    try {
        // on récupère dans la bdd l'email et le passorwd de notre utilisateur que l'on stock dans notre constante user
        const user = await UserModel.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true , maxAge});
        res.status(200).json({user: user._id});
    } catch (err) {
        const errors = signInErrors(err);
        res.status(200).json({ errors });
    }
}

module.exports.logout = async (req, res) => {
    // au moment du logout on supprome au bout d'1 miliseconde
    res.cookie('jwt', '', {maxAge : 1}); 
    res.redirect('/');
}