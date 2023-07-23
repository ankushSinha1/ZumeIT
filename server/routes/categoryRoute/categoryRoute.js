import express from "express";
import Product from '../../models/Product.js'
const router = express.Router()

router.route('/:productCategory').get(async (req, res) =>{
    await Product.find({'merchantDetails.shopCategory': req.params.productCategory})
    .then(data => {
        return res.json(data)
    })
    .catch(err => {return res.json({err: err.toString()})})
})

export default router