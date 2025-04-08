import executeQuery from '../utils/dbReader.js';
import path from 'path';


export const updateUser = async (req, res) => {
    try{
        const user = req.user;


        const { firstname, lastname, photo_path } = req.body;

        if (!firstname || !lastname) {
            return res.status(400).json({
                status: 400,
                message: "Veuillez remplir tous les champs"
            });
        }
        const filePathUpdateUser = path.join("queries/auth/updateUserInfo.sql");
        const resultUpdateUser = await executeQuery(filePathUpdateUser, [
            user.id,
            firstname,
            lastname,
            photo_path || null
        ]);
        if (resultUpdateUser.rowCount === 0) {
            return res.status(500).json({
                status: 500,
                message: "Erreur serveur lors de la mise à jour de l'utilisateur"
            });
        }

        console.log(resultUpdateUser.rows[0].update_user_info);
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