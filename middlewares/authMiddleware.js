import jwt from 'jsonwebtoken';

// check si la personne est connectée
export const isConnected = async (req, res, next) => {
    try{
        const sessionToken = req.session.token;

        if(!sessionToken){
            return res.status(401).json({message: 'isConnected sessionToken Non connecté'});
        }

        const token = jwt.verify(sessionToken, process.env.JWT_SECRET);

        if(!token){
            req.session.destroy();
            return res.status(401).json({message: 'isConnected token Non connecté'});
        }
        req.user = token;
        next();
    }
    catch(e){
        console.log("Erreur authMiddleware :", e)
    }
};