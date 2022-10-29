import express from 'express';
import userRouter from './routes/user.js';
const app = express();

app.use('/users', userRouter);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})