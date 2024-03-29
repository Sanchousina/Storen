import DB from '../db/index.js';

export const ROLES_LIST = await DB.user.getRoles();

export const verifyRole = (requiredRoles) => {
    return (req, res, next) => {
        if(requiredRoles.includes(req.userRole)){
            return next();
        }
        return res.status(403).json("You don't have permission");
    }
}

export const verifyUserByID = (req, res, next) => {
    if(req.params.userId == req.userId){
        return next();
    }
    return res.status(403).json("You don't have permission");
}

export const verifyAdvertPermissions = async (req, res, next) => {
    const userId = req.userId;
    const advertId = req.params.advertId;
    try{
        const userHasAdvert = await DB.advert.userHasAdvert(userId, advertId);
        if(userHasAdvert || req.userRole == 'admin'){
            return next();
        }
        return res.status(403).json("You don't have permission");
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export const verifyContractPermissions = async (req, res, next) => {
    const userId = req.userId;
    const contractId = req.params.contractId;
    try{
        const userHasContract = await DB.contract.userHasContract(userId, contractId);
        if(userHasContract){
            return next();
        }
        return res.status(403).json("You don't have permission");
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}

export const verifyAdvertOwnerContractResponse = async (req, res, next) => {
    const userId = req.userId;
    const contractId = req.params.contractId;
    try{
        const advertOwner = await DB.contract.checkAdvertOwnerForContract(userId, contractId);
        if(advertOwner){
            return next();
        }
        return res.status(403).json("You don't have permission");
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}
