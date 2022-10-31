import express from 'express';
import userRouter from './routes/user.js';
import advertRouter from './routes/advert.js';
import warehouseRouter from './routes/warehouse.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', userRouter);
app.use('/adverts', advertRouter);
app.use('/warehouses', warehouseRouter);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})