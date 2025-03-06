import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import executeQuery from '../utils/dbReader.js';
import { regexEmail } from '../utils/utils.js';

// J'ai besoin : 
// - d'envoyer la demande de connexion avec email et password et de renvoyer si correcte un token


export const postLogin = async (req, res) => {
    try{

        const { email , password } = req.body;

        if(email=== '' || password === ''){
            res.status(400).json({message: 'Veuillez remplir tous les champs'});
        }

        const regetEmail = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$');

        if(!regetEmail.test(email)){
            res.status(400).json({message: 'Email incorrect'});
        }
        if(password.length < 6){
            res.status(400).json({
                status: 400,
                message: 'Mot de passe trop court'
            });
        }

        const filePathCheckByEmail = path.join("queries/users/getAuthByEmail.sql");
        const resultCheckEmail = await executeQuery(filePathCheckByEmail, [email]);
        if(resultCheckEmail.length === 0){
            res.status(400).json({
                status: 400,
                message: 'Email ou mot de passe incorrect'
            });
        }

        console.log(resultCheckEmail);

        //on recupére le mot de passe hashé 
        const hash = resultCheckEmail[0].password;

        const isMatch = await bcrypt.compare(password, hash);

        if(!isMatch){
            res.status(400).json({
                status: 400,
                message: 'Email ou mot de passe incorrect'
            });
        }
 
        const filePathDataUser = path.join("queries/users/getUserById.sql");
        const userData = await executeQuery(filePathDataUser, [resultCheckEmail[0].id]);
        if(userData.length === 0){
            res.status(500).json({
                status: 500,
                message: 'Erreur serveur'
            });
        }

        const token = jwt.sign({id: userData[0].id}, process.env.JWT_SECRET, {expiresIn: '1d'});

        req.session.token = token;

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Connexion réussie', 
            user: {
            firstname: userData[0].firstname,
            lastname: userData[0].lastname,
            email: userData[0].email,
            photo_path: userData[0].photo_path,
            organization: {
                id: userData[0].organization_id,
                name: userData[0].organization_name,
            },
        }});
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            statu: 500,
            message: 'Erreur serveur'
        });
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

        const filePathDataUser = path.join("queries/users/getUserById.sql");
        const userData = await executeQuery(filePathDataUser, [token.id]);
        if(userData.length === 0){
            res.status(500).json({
                status: 500,
                message: 'Erreur serveur'
            });
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Connecté',
            user: {
                firstname: userData[0].firstname,
                lastname: userData[0].lastname,
                email: userData[0].email,
                photo_path: userData[0].photo_path,
                organization: {
                    id: userData[0].organization_id,
                    name: userData[0].organization_name,
                },
            }
        });
    
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

export const createUser = async (req, res) => {
    try{

        console.log('createUser');
        const {firstname, lastname, email, password, photo_path } = req.body;


        //////// SECURITE 
        if(firstname === '' || lastname === '' || email === '' || password === ''){
            res.status(400).json({
                status: 400,
                message: 'Veuillez remplir tous les champs'
            });
        }

        if (regexEmail.test(email) === false){
            res.status(400).json({
                status: 400,
                message: 'Email incorrect'
            });
        }

        if(password.length < 6){
            res.status(400).json({
                status: 400,
                message: 'Mot de passe trop court'
            });
        }
        
        //on vérifie si l'email est déjà utilisé
        const filePathCheckByEmail = path.join("queries/users/getAuthByEmail.sql");
        const resultCheckEmail = await executeQuery(filePathCheckByEmail, [email]);
        if(resultCheckEmail.length > 0){
            res.status(400).json({
                status: 400,
                message: 'Email déjà utilisé'
            });
        }

        /////////////////

        const hash = await bcrypt.hash(password, 10);

        const filePathCreateUser = path.join("queries/users/createUser.sql");
        const resultCreateUser = await executeQuery(filePathCreateUser, [firstname, lastname, email, hash, photo_path]);
        if(resultCreateUser.affectedRows === 0){
            res.status(500).json({
                status: 500,
                message: 'Erreur serveur lors de la création de l\'utilisateur'
            });
        }

        res.status(201).json({
            status: 201,
            message: 'Utilisateur créé'
        });

        
    }
    catch(e){
        console.error("createUser :", e);
        res.status(500).json({
            status : 500,
            message: "Erreur serveur lors de la création de lutilisateur"
        });
    };
}
