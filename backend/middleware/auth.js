import jwt from 'jsonwebtoken';
import ENV from '../config.js';

/** auth middleware */
export default async function Auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Access denied. Invalid token format." });
        }

        const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Authentication Failed!" });
    }
}


export function localVariables(req, res, next) {
    req.app.locals = {
        OTP : null,
        resetSession : false
    }
    next();
}