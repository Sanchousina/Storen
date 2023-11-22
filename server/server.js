import express from 'express';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.js';
import advertRouter from './routes/advert.js';
import warehouseRouter from './routes/warehouse.js';
import contractRouter from './routes/contract.js';
import favoriteRouter from './routes/favorite.js';
import galleryRouter from './routes/gallery.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', userRouter);
app.use('/adverts', advertRouter);
app.use('/warehouses', warehouseRouter);
app.use(contractRouter);
app.use('/users', favoriteRouter);
app.use(galleryRouter);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
})
