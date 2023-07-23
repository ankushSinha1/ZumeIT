import express from 'express'
import Razorpay from 'razorpay'
import dotenv from 'dotenv'
import crypto from 'crypto'
const router = express.Router()
dotenv.config()
var instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
});

router.route('/order-creation').post((req, res) =>{
    var options = {
        amount: req.body.amount * 100,  // amount in the smallest currency unit
        currency: "INR",
      };
      instance.orders.create(options, (err, order) => {
        if(err){
          console.log(err)
          return res.json({err: err.toString()})
        }
        return res.json({order, msg: 'Order created'})
      });
    })
router.route('/payment-verification').post((req, res) =>{
    let body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id
    var expectedSignature = crypto.createHmac('sha256', process.env.KEY_SECRET).update(body.toString()).digest('hex');
  
    if(expectedSignature === req.body.razorpay_signature){
      return res.json({msg: 'signatureValid'})
    }
    return res.json({msg: 'signatureInvalid'})
  })
export default router