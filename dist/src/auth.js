import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Router } from 'express';
const router = Router();
const ADMIN_EMAIL = 'bilgehanerduran@gmail.com';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('***REMOVED***', 10);
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (email !== ADMIN_EMAIL) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }
    const valid = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);
    if (!valid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
});
export default router;
//# sourceMappingURL=auth.js.map