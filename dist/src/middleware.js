import jwt from 'jsonwebtoken';
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'No token' });
        return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'No token' });
        return;
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch (err) {
        console.error('JWT verify failed:', err.message, '| JWT_SECRET defined:', !!process.env.JWT_SECRET);
        res.status(401).json({ error: 'Invalid token' });
    }
};
//# sourceMappingURL=middleware.js.map