const verifyAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        throw new ApiError(403, "Access restricted to admins only");
    }
    next();
};

export {verifyAdmin}