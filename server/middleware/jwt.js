import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const createAccessToken = (user) => {
    const accessToken = jwt.sign(
        {userId: user.user_id},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15s' }
    );

    return accessToken;
}

export const varifyToken = (req, res, next) => {
    const accessToken = req.cookies['access-token'];

    if(!accessToken){
        return res.status(400).json({error: "User not Authenticated!"});
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, userId) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403)
        }

        req.userId = userId
        next()
    })

}