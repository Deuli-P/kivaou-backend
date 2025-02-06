


export const authMiddleware = async (req, res, next) => {
    console.log('authMiddleware');
    next();
}

export const adminMiddleware = async (req, res, next) => {
    console.log('adminMiddleware');
    next();
}