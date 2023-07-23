import express from "express";
import UserCustomer from "../../models/UserCustomer.js";
import { protect } from "../../middleware/middleware.js";
import Review from '../../models/Review.js'
const router = express.Router()
//ADD TO CART
router.route('/:userId/addItemToCart').post((req, res) =>{
  UserCustomer.findByIdAndUpdate(req.params.userId, {"$push": {'cart': req.body}})
  .then(data=>{return res.json({data, msg: 'Item added to cart'})})
  .catch(err => {return res.json({err: err.toString()})})
})

//DELETE FROM CART
router.route('/:userId/deleteItemFromCart').post((req, res)=>{

  UserCustomer.findByIdAndUpdate(req.params.userId, {"$pull": {"cart": req.body.element}})
  .then(data=>{return res.json({data, msg: 'Item removed from cart'})})
  .catch(err => {return res.json({err: err.toString()})})
})
//READ 
router.route('/:userId').get(async (req, res) => {
    UserCustomer.findById(req.params.userId)
    .then(data => {
        if(data === null){
            return res.json({msg: 'This user does not exist'})
        }else{
            return res.json(data)
        }
    })
    .catch(err => {return res.json({err: err.toString()})})
})

//UPDATE
router.route("/:userId/edit").get( (req, res) => {
    if(req.status && req.status.msg === 'Token expired!'){
      return res.json(req.status)
    }
    UserCustomer.findById(req.params.userId)
    .then((data) => {
      return res.json(data);
    })
    .catch(err => {return res.json({err: err.toString()})})
  });
router.route("/:userId/update").patch(protect, (req, res) => {
    UserCustomer.findByIdAndUpdate(req.params.userId, { $set: req.body })
    .then(data => {
      Review.updateMany({'author.email': data.email}, {$set: {'author': data}})
      return res.json({data, msg: "User details updated!" });
    })
    .catch(err => {return res.json({msg: err.toString()})})
})
//Add in ORDERS ARRAY
router.route('/:userId/update-orders').patch(protect,async (req, res)=>{
  if(req.status && req.status.msg === 'Token expired!'){
    return res.json(req.status)
  }
  var currentOrders = []
  await req.body.cart.map(order => {
    currentOrders.push(order)
  })
  await UserCustomer.findByIdAndUpdate(req.params.userId, {"$push": {"orders": {currentOrders, 'Date': req.body.date}}})
  .then(async data => {
    await UserCustomer.findByIdAndUpdate(req.params.userId, {"cart" : []})
    .then(res => console.log(res))
    return res.json({data, msg: 'orders added'})
  })
  .catch(err => {
    return res.json({err: err.toString()})
  })
})
//DELETE
router.route("/:userId/delete").delete(protect, (req, res) => {
    if(req.status && req.status.msg === 'Token expired!'){
      return res.json(req.status)
    }
    UserCustomer.findByIdAndRemove(req.params.userId)
    .then((data) => {
      return res.json({data, msg: "User deleted!" });
    })
    .catch(err => {
      return res.json({err: err.toString()})
    })
});

export default router;