import express from "express";
import Product from "../../models/Product.js";
const router = express.Router()

router.route('/').get(async (req, res) => {
    Product.find({})
    .then(data => {return res.json(data)})
    .catch(err => {return res.json(err)})
})

export default router;