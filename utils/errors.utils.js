export const signUpErrors = (error) => {
    let errors = {pseudo: '', email:'', password:''}
    if(error.message.includes('pseudo'))
        errors.pseudo = "Pseudo incorrect ou déjà utilisé";

    if(error.message.includes('email'))
        errors.email = "Email incorrect";

    if(error.message.includes('password'))
        errors.password = "Le mot de passe doit contenir au moins 6 caractères";

    if(error.code === 11000 && Object.keys(error.keyValue)[0].includes('pseudo') )
        errors.pseudo = "Ce pseudo existe déjà";

    if(error.code === 11000 && Object.keys(error.keyValue)[0].includes('email'))
        errors.email = "Cet email existe déjà";

    return errors;
} 

export const signInErrors = (err) => {
    let errors = { email:'', password:''}
  
    console.log(err);
    if (err.message.includes("email")) 
      errors.email = "Email inconnu!";
    
    if (err.message.includes('password'))
      errors.password = "Le mot de passe ne correspond pas!"
  
    return errors;
}

export const uploadError = (err) => {
    let errors = {format: '', maxSize: ''}

    if(err.message.includes('invalid file'))
        errors.format = "Format incompatible";

    if(err.message.includes('max size'))
        errors.maxSize = "Le fichier dépasse 500ko";
    
    return errors;
}