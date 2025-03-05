import jwt from 'jsonwebtoken';

// J'ai besoin : 
// - d'envoyer la demande de connexion avec email et password et de renvoyer si correcte un token


export const postLogin = async (req, res) => {

    const { email , password } = req.body;

    if(email=== '' || password === ''){
        res.status(400).json({message: 'Veuillez remplir tous les champs'});
    }

    const regetEmail = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$');

    if(!regetEmail.test(email)){
        res.status(400).json({message: 'Email incorrect'});
    }
    if(password.length < 6){
        res.status(400).json({message: 'Mot de passe trop court'});
    }


};

export const getSession = async (req, res) => {
    try{
        



    }
    catch(e){
        console.error(e);
        res.status(500).json({message: 'Erreur serveur'});
    }
}