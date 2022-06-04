import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';

dotenv.config();
mongoose
  .connect(
    'mongodb+srv://hcmongodbuser:ja1Y0m0bad9cgf7s@cluster0.mvgky.mongodb.net/harajdotcenter?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('connect to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/keys/google', (req, res) => {
  res.send(process.env.GOOGLE_API_KEY);
});

app.use('/api/seed', seedRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/upload', uploadRouter);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 80;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
