export const verifyRole = (requiredRoles) => {
    return (req, res, next) => {
        if(requiredRoles.includes(req.userRole)){
            return next();
        }
        return res.status(403).json("You don't have permission");
    }
}

