import jwt from "jsonwebtoken"

export function OptionalAuthMiddleware(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = { id: String(decoded.id) };
    } catch {
        req.user = null;
    }

    next();
}
