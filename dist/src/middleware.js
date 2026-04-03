import * as jwt from 'jsonwebtoken';
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
        jwt.verify(token, process.env.JWT_SECRET || 'REDACTED');
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};
//# sourceMappingURL=middleware.js.map