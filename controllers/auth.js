import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { regexEmail, regexPassword } from '../utils/utils.js';
import { UserModel } from '../models/UserModel.js';
import { AuthModel } from '../models/AuthModel.js';

export const getLogin = async (req, res) => {
    try {
        const { email, password } = req.body;


        if (!email.trim() || !password.trim()) {
            return res.status(400).json({ status: 400, message: "Veuillez remplir tous les champs" });
        }

        if (!regexEmail.test(email.trim())) {
            return res.status(400).json({ status: 400, message: "Format de l'email est incorrect" });
        }

        if(password.trim().length < 6){
            return res.status(400).json({status: 400, message: 'Mot de passe trop court'});
        }

        const resultGetUser = await AuthModel.getAuthByEmail([email.trim()]);

        if (!resultGetUser.rows.length) {
            return res.status(400).json({ status: 400, message: "Mauvais email ou mot de passe" });
        }

        const authInfo = resultGetUser.rows[0].get_auth_by_email;


        if(!authInfo){
            return res.status(400).json({ status: 400, message: "Mauvais email ou mot de passe" });
        }


        const isMatch = await bcrypt.compare(password, authInfo.password_save);
        if (!isMatch) {
            return res.status(400).json({ status: 400, message: "Mauvais email ou mot de passe" });
        }

        
        const resultGetUserInfo = await AuthModel.getUserInfoByAuthId([authInfo.id]);


        const result = resultGetUserInfo.rows[0].get_user_info_by_auth_id;

        if (!result) {
            return res.status(500).json({ status: 500, message: "Mauvais email ou mot de passe" });
        }

        const user = result.user_info

        const token = jwt.sign({ 
            id:user.id,
            user_type: user.user_type,
            organization_id: user.organization?.id || null,
            organization_role: user.organization?.role || null
        }, process.env.JWT_SECRET, { expiresIn: 24 * 60 * 60 * 1000 });

        req.session.token = token;

        res.status(result.status).json(result);

    } catch (e) {
        console.error(e);
        res.status(500).json({ status: 500, message: "Erreur serveur lors de la connexion" });
    }
};


export const getSession = async (req, res) => {
    try{
        const token = req.user;

        const resultGetUserInfo = await UserModel.getUserInfoById([token.id]);

        const user = resultGetUserInfo.rows[0].get_user_info_by_user_id;

        if (!user) {
            req.session.destroy();
            return res.status(500).json({ status: 500, message: "Utilisateur introuvable" });
        }

        res.status(200).json({
            status: 200,
            success: true,
            user: user,
        });
    }
    catch(e){
        console.error(e);
        res.status(500).json({message: 'Erreur serveur'});
    }
}

export const getLogout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error("Erreur lors de la déconnexion :", err);
                return res.status(500).json({ message: "Erreur serveur" });
            }
            res.status(200).json({ success: true, message: "Déconnexion réussie" });
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


export const createUser = async (req, res) => {
    try {

        const { firstname, lastname, email, password, photo_path } = req.body;

        // Vérifications de sécurité
        if (!firstname.trim() || !lastname.trim() || !email.trim() || !password.trim()) {
            return res.status(400).json({
                status: 400,
                message: "Veuillez remplir tous les champs"
            });
        }

        if (!regexEmail.test(email.trim())) {
            return res.status(400).json({
                status: 400,
                message: "Format de l'email est incorrect"
            });
        }

        if (password.trim().length < 12) {
            return res.status(400).json({
                status: 400,
                message: "Mot de passe trop court"
            });
        }

        if (password.trim().length > 200) {
            return res.status(400).json({
                status: 400,
                message: "Mot de passe trop long"
            });
        }


        if(!regexPassword.test(password.trim())){
            return res.status(400).json({
                status: 400,
                message: "Le mot de passe doit contenir au moins 12 caractères, une lettre et un chiffre et un caractère spécial"
            });
        }

        // Hachage du mot de passe
        const hash = await bcrypt.hash(password.trim(), 10);

        
        const resultCreateUser = await AuthModel.createAuth([
            email.trim(),
            hash.trim(),
            firstname.trim(),
            lastname.trim(),
            photo_path.trim() || null
        ]);

        if (resultCreateUser.rowCount === 0) {
            return res.status(500).json({
                status: 500,
                message: "Erreur serveur lors de la création de l'utilisateur"
            });
        }


        const result = resultCreateUser.rows[0].create_user;

        if (!result) {
            return res.status(500).json({
                status: 500,
                message: "Erreur serveur lors de la création de l'utilisateur"
            });
        }

        const user = result.user;
        
        const token = jwt.sign({ 
            id:user.id, 
            user_type: user.user_type,
            organization_id: user.organization?.id || null,
            organization_role: user.organization?.role || null
        }, process.env.JWT_SECRET, { expiresIn: "24h" });

        req.session.token = token;
  
        res.status(result.status).json(result);

    } catch (e) {
        console.error("createUser :", e);
        res.status(500).json({
            status: 500,
            message: "Erreur serveur lors de la création de l'utilisateur"
        });
    }
};
