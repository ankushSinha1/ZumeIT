import express from "express";
import UserMerchant from "../../models/UserMerchant.js";
import Product from "../../models/Product.js";
import { protect } from "../../middleware/middleware.js";
const router = express.Router()

//READ 
router.route('/:userId').get(async (req, res) => {
    UserMerchant.findById(req.params.userId)
    .then(data => {
        if(data === null){
            return res.json({msg: 'This user does not exist'})
        }else{
            return res.json(data)
        }
    })
    .catch(err => {return res.json({msg: err.toSting()})})
})

//UPDATE
router.route("/:userId/edit").get((req, res) => {
    if(req.status && req.status.msg === 'Token expired!'){
      return res.json(req.status)
    }
    UserMerchant.findById(req.params.userId)
    .then((data) => {
      return res.json(data);
    })
    .catch(err => {return res.json({err: err.toString()})})
  });
router.route("/:userId/update").patch(protect, (req, res) => {
    Product.findOneAndUpdate({'author._id': req.params.userId}, {$set: {'author': req.body}})
    .then(data => console.log('Updated'))
    .catch(err => console.log(err))
    UserMerchant.findByIdAndUpdate(req.params.userId, { $set: req.body })
    .then(data => { 
      return res.json({data, msg: "User details updated!" });
    })
    .catch(err => {return res.json({msg: err.toString()})})
})

//DELETE
router.route("/:userId/delete").delete(protect, (req, res) => {
    if(req.status && req.status.msg === 'Token expired!'){
      return res.json(req.status)
    }
    UserMerchant.findByIdAndRemove(req.params.userId)
    .then((data) => {
      return res.json({data, msg: "User deleted!" });
    })
    .catch(err => {
      return res.json({err: err.toString()})
    })
});

export default router;