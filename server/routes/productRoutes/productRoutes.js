import express from "express";
import Product from "../../models/Product.js";
import Review from '../../models/Review.js'
import { protect } from "../../middleware/middleware.js";
import cloudinary from 'cloudinary';
import UserMerchant from "../../models/UserMerchant.js";
const router = express.Router()

cloudinary.config({
    cloud_name: 'dvstzyogy',
    api_key: '544918322574147',
    api_secret: 'WJv1374MZiWj1W-_zUMnxPAfir4',
  });  
  const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
  };
  router.route('/uploadImages').post(async (req, res)  => {
    await cloudinary.v2.uploader.upload_large(req.body.myFile, opts)
    .then(result => {return res.json(result)})
    .catch(err => {return res.json(err)})
  })
  

//CREATE
router.route('/new').post(protect, async (req, res) => {
    if(req.status && req.status.msg === 'Token expired!'){
        return res.json(req.status)
    }
    try{
        console.log(req.user)
        const merchant = await UserMerchant.findById(req.user.data)
        if(merchant && merchant.email === req.body.merchantDetails.email){
            await Product.create(req.body)
            .then((data) => {return res.json({data, msg: "New product uploaded!"})})
            .catch(err => {return res.json({msg: err.toString()})})
        }else if(!merchant){
            req.status = {msg: 'Merchant does not exist'}
            return res.json(req.status)
        }
        else{
            return res.json(req.status);
        }
    }catch(err){
        return res.json({msg: err.toString()})
    }
})

//READ
router.route('/:productId').get((req, res) => {
    var reviews= []
    var finalRating = 0
    Product.findById(req.params.productId)
    .then(async data=> {
        await Review.find({productId: req.params.productId})
        .then(response => {
            reviews = response
            response.map(singleReview => {
                finalRating += singleReview.productRating
            })
        })
        .catch(err => {return res.json({err: err.toString()})})
        data.rating = finalRating/reviews.length
        return res.json({product: data, reviews: reviews})
    }).catch(err => {
        return res.json({err: err.toString()})
    })
    
})

//GET ALL PRODUCTS OF A MERCHANT 

router.route('/:userId/products-uploaded').get(async(req, res) => {
    await Product.find({'merchantDetails._id': req.params.userId})
    .then(async data => {
        return res.json(data)
    })
    .catch(err => {
        return res.json({err: err.toString()})
    })
})
//UPDATE
router.route('/:productId/edit').get((req, res) => {
    Product.findById(req.params.productId)
    .then(( data) => {
        return res.json(data)
    }).catch(err => {
        return res.json({err: err.toString()})
    })
})

router.route('/:productId/update').patch(protect, (req, res) => {
    if(req.status && req.status.msg === 'Token expired!'){
        return res.json(req.status)
    }
    Product.findByIdAndUpdate(req.params.productId, {$set: req.body})
    .then( data => {
            return res.json({data, msg: 'Product Details updated!'})
        }
    )
    .catch(err => {return res.json({msg: err.toString()})})
})

//DELETE
router.route('/:productId/delete').delete(protect, (req, res) => {
    if(req.status && req.status.msg === 'Token expired!'){
        return res.json(req.status)
    }
    Product.findByIdAndRemove(req.params.productId)
    .then((data) => {   
        Review.deleteMany({productId: req.params.productId})
        .then(data => console.log(data))
        .catch(err => console.log(err))
        return res.json({ msg: "Product deleted!"})
    }).catch(err => {
        return res.json({err: err.toString()})
    })
})

/* -----------------------------------------------------------  */

//CREATE REVIEW
router.route('/:productId/review/new').post(protect, async (req, res) => {
    if(req.status && req.status.msg === 'Token expired!'){
        return res.json(req.status)
    }
    await Review.create(req.body)
    .then(async (data) => {
        return res.json({data, msg: "Review added!"});
    }).catch(err => {
        return res.json({err: err.toString()})
    })
})

//UPLOADING IMAGES WITHIN A REVIEW
router.route('/:productId/review/uploadImages').post(async (req, res)  => {
    await cloudinary.v2.uploader.upload_large(req.body.myFile, opts)
    .then(result => {return res.json(result)})
    .catch(err => {return res.json(err)})
  })

//READ REVIEWS
router.route('/:productId/review').get((req, res) => {
    Review.find({productId: req.params.productId})
    .then((data) => {
        return res.json(data);
    }).catch(err =>{
        return res.json(err)
    })
})

//UPDATE REVIEW
router.route('/:productId/review/:reviewId/edit').get(async (req, res) => {
    
    Review.findById(req.params.reviewId)
    .then(( data) => {
        return res.json(data)
    }).catch(err => {
        return res.json({err: err.toString()})
    })
})

router.route('/:productId/review/:reviewId/update').patch(protect, async (req, res) => {
    if(req.status && req.status.msg === 'Token expired!'){
        return res.json(req.status)
    }
    await Review.findByIdAndUpdate(req.params.reviewId, {$set: req.body})
    .then(async (data) => {
        return res.json({data, msg: 'Review updated'})
    })
    .catch(err => {
        console.log(err)
        return res.json({err: err.toString()})
    })
})

//DELETE REVIEW
router.route('/:productId/review/:reviewId/delete').delete(async (req, res) => {
    await Review.findByIdAndRemove(req.params.reviewId)
    .then((data) => {
        return res.json({ data, msg: 'Review deleted' });
    })
    .catch((err) => {
        console.log(err); // Optional, for debugging purposes
        return res.json({ err: err.toString() });
    })
})

export default router;