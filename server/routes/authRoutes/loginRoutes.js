import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserCustomer from '../../models/UserCustomer.js';
import UserMerchant from '../../models/UserMerchant.js';
import RefToken from '../../models/RefToken.js';
import { tokenGen, refreshTokenGen } from "../../Controllers/tokenGenerator.js";

const router = express.Router()

//LOGGING IN as a CUSTOMER
router.route('/customer').post(async (req, res) => {
    const userCustomer = await UserCustomer.findOne({email: req.body.email});
    if(!userCustomer){
        return res.json({msg: 'Customer with this email does not exist'})
    }
    try{
        //match will be a boolean value based on the comparison of req.body.password and user.password
        const match =  bcrypt.compare(req.body.password, userCustomer.password);
        if(!match){return res.json({msg: "Incorrect password`"})}
        else{
            const accessToken = tokenGen(userCustomer._id);
            const refToken = refreshTokenGen(userCustomer._id)
            const response = {
                user: userCustomer,
                token: accessToken,
                refToken: refToken,
                msg: `Welcome back, ${userCustomer.firstName} ${userCustomer.lastName} ! `
            }
            let newRefToken = new RefToken({refToken: refToken})
            newRefToken.save();
            try{
                return res.json(response)
                
            }catch(err){
                return res.json({msg: err.toString()})
            }
        }
    }catch(err){
        console.log(err)
        return res.json({msg: err.toString()})
    }
})

//LOGGING IN as a MERCHANT
router.route('/merchant').post(async (req, res) => {
    const userMerchant = await UserMerchant.findOne({email: req.body.email});
    if(!userMerchant){
        return res.json({msg: 'Merchant with this email does not exist'})
    }
    try{
        //match will be a boolean value based on the comparison of req.body.password and user.password
        const match =  bcrypt.compare(req.body.password, userMerchant.password);
        if(!match){return res.json({msg: "Incorrect password`"})}
        else{
            const accessToken = tokenGen(userMerchant._id);
            const refToken = refreshTokenGen(userMerchant._id)
            // delete user.password;
            const response = {
                user: userMerchant,
                token: accessToken,
                refToken: refToken,
                msg: `Welcome back, ${userMerchant.firstName} ${userMerchant.lastName} ! `
            }
            let newRefToken = new RefToken({refToken: refToken})
            newRefToken.save();
            try{
                return res.json(response)
                
            }catch(err){
                return res.json(err)
            }
        }
    }catch(err){
        console.log(err)
        return res.json({msg: err.toString()})
    }
})

// *----------------------------------------------------------------------------*


// ROUTES FOR MANAGING REFRESHTOKEN

//Storing refToken in Database
router.route('/refToken').post(async (req, res) => {
    let dataInside = await RefToken.findOne({refToken: req.body.refToken})
    if(dataInside){
        jwt.verify(dataInside.refToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err){
                if(err.toString()==='TokenExpiredError: jwt expired'){
                    return res.json({msg: 'RefToken expired'})
                }
                return res.json({msg: err.toString()})
            }else{
                const response = {
                    user: req.body.user,
                    token: tokenGen(req.body.user._id),
                    refToken: dataInside.refToken,
                    msg: 'New refToken registered!'
                }
                try{
                    return res.json(response)
                }catch(err){
                    return res.json({msg: err.toString()})
                }
            }
        })
    }else{
        return res.json({msg: 'Refresh token not found!'})
    }
})

//Deleting refToken from Database
router.route('/deleteRefToken').post(async (req, res) => {
    let foundToken = await RefToken.findOne({refToken: req.body.refToken})
    if(foundToken){
        RefToken.deleteOne({refToken: foundToken.refToken})
        .then(data => {return res.json({msg: 'Token removed from database'})})
        .catch(err => console.log(err))
    }
})

export default router;