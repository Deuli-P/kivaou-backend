import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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
        const sessionToken = req.session.token;

        if(!sessionToken){
            res.status(401).json({message: 'Non connecté'});
        }

        const token = jwt.verify(sessionToken, process.env.JWT_SECRET);

        if(!token){
            req.session.destroy();
            res.status(401).json({message: 'Non connecté'});
        }

        


    }
    catch(e){
        console.error(e);
        res.status(500).json({message: 'Erreur serveur'});
    }
}

export const getLogout = async (req, res) => {
    try{
        req.session.destroy()
        .then(e=> {
            res.status(200).json({message: 'Déconnexion réussie'});
        })
        .catch(e => {
            console.error(e);
            res.status(500).json({message: 'Erreur serveur'});
        });

    }
    catch(e){
        console.error(e);
        res.status(500).json({message: 'Erreur serveur'});
    }
}