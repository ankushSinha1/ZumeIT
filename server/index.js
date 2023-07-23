import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import homeRoute from './routes/homeRoute/homeRoute.js'
import categoryRoute from './routes/categoryRoute/categoryRoute.js'
import paymentRoute from './routes/paymentRoute/paymentRoute.js'
import registerRoutes from './routes/authRoutes/registerRoutes.js'
import loginRoutes from './routes/authRoutes/loginRoutes.js'
import productRoutes from './routes/productRoutes/productRoutes.js'
import userCustomerRoutes from './routes/userCustomerRoutes/userCustomerRoutes.js'
import userMerchantRoutes from './routes/userMerchantRoutes/userMerchantRoutes.js'

const app = express();
app.use(express.json({limit: '25mb'}))
dotenv.config()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors({
    origin: 'https://zumeit.onrender.com',
    credentials: true,
}))
mongoose.connect(process.env.MONGO_URL)         // MongoDB Connection

// app.use('/', homeRoute)
app.use('/category', categoryRoute)
app.use('/payment', paymentRoute)
app.use('/register', registerRoutes)
app.use('/login', loginRoutes)
app.use('/product', productRoutes)
app.use('/user', userCustomerRoutes)
app.use('/user-m', userMerchantRoutes)



app.listen(process.env.PORT, () => {
    console.log(`Server connected and running at PORT: ${process.env.PORT}`)
})