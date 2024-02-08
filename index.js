import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { userRoute } from './routes/userRoute.js';
import { residencyRoute } from './routes/residencyRoute.js';
import Stripe from "stripe";




dotenv.config()


const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

app.post('/create-payment-intent', async (req, res) => {
    try {
      const { amount  , currency } = req.body;
  
      const paymentIntent = await stripe.paymentIntents.create({
  
          amount,
         currency ,
  
         payment_method_types: ['card'],
         description: 'Payment Request From CloudLumous Pvt, Ltd',
         receipt_email : 'vikashvermacom92@gmail.com',      
      });
  
  
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
  
    } catch (error) {
      console.error('Error creating Payment Intent:', error.message);
      res.status(500).json({ error: 'Error creating Payment Intent : ' + error.message });
    }
  });

app.use('/api/user', userRoute)
app.use("/api/residency", residencyRoute)