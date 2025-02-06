
// - J'ai besoin de vérifier si le token est présent et valide
// - J'ai besoin de savoir si il y a un utilisateur connecté et si il est Admin

export const authMiddleware = async (req, res, next) => {

    const token = req.session.token;
    if(!token){
        res.status(401).json({message: 'Vous n\'êtes pas connecté'});
        res.redirect('/login');
    }

    // Vérifier si le token est valide
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET,(err, decoded) => {
        
        if(err){
            res.status(401).json({message: 'Token invalide'});
            return res.redirect('/login');
        }
        return decoded;
    });

    if(!verifyToken){
        res.status(401).json({message: 'Token invalide'});
        res.redirect('/login');
    }

    next();
}

export const adminMiddleware = async (req, res, next) => {

    const token = req.session.token;
    if(!token){
        res.status(401).json({message: 'Vous n\'êtes pas connecté'});
        res.redirect('/login');
    }

    // Vérifier si le token est valide
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET,(err, decoded) => {
        
        if(err){
            res.status(401).json({message: 'Token invalide'});
            return res.redirect('/login');
        }
        return decoded;
    });

    if(!verifyToken){
        res.status(401).json({message: 'Token invalide'});
        res.redirect('/login');
    }

    if(verifyToken.role !== 'admin'){
        res.status(403).json({message: 'Vous n\'avez pas les droits pour accéder à cette page'});
        res.redirect('/login');
    }
    
    next();
}