import { UserModel } from '../models/UserModel.js';

export const updateUser = async (req, res) => {
    try{
        const user = req.user;


        const { firstname, lastname, photo_path } = req.body;

        if (!firstname.trim() || !lastname.trim()) {
            return res.status(400).json({
                status: 400,
                message: "Veuillez remplir tous les champs"
            });
        }
        
        const resultUpdateUser = await UserModel.updateUserInfo([
            user.id,
            firstname.trim(),
            lastname.trim(),
            photo_path.trim() || null
        ]);
        if (resultUpdateUser.rowCount === 0) {
            return res.status(500).json({
                status: 500,
                message: "Erreur serveur lors de la mise à jour de l'utilisateur"
            });
        }

        res.status(200).json({
            status: 200,
            message: "Utilisateur mis à jour",
            user: resultUpdateUser.rows[0].update_user_info
        });
    }
    catch(e){
        console.error(e);
        res.status(500).json({message: 'Erreur serveur'});
    }
};

export const getUser = async (req, res) => {
    try{

        const user = req.user;

        const resultGetUser = await UserModel.getUserInfo([
            user.id
        ]);

        if (resultGetUser.rowCount === 0) {
            return res.status(500).json({
                status: 500,
                message: "Erreur serveur lors de la récupération de l'utilisateur"
            });
        }

        const result = resultGetUser.rows[0].get_user_info;

        
        res.status(200).json(result);

    }
    catch(e){
        console.error(e);
        res.status(500).json({message: 'Erreur serveur lors de la récupération de l\'utilisateur'});
    }
};

