import express from 'express';
import userRouter from './routes/user.js';
import advertRouter from './routes/advert.js';

const app = express();

app.use('/users', userRouter);
app.use('/adverts', advertRouter);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})