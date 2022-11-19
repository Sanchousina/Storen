//import { sign, verify } from 'jsonwebtoken';
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