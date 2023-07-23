import express from "express";
import bcrypt from 'bcrypt'
import cloudinary from 'cloudinary';
import UserCustomer from "../../models/UserCustomer.js";
import UserMerchant from "../../models/UserMerchant.js";
import RefToken from "../../models/RefToken.js";
import { tokenGen, refreshTokenGen } from "../../Controllers/tokenGenerator.js";
const router = express.Router()

//UPLOADING IMAGE ON CLOUDINARY
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
router.route('/uploadImage').post(async (req, res)  => {
  await cloudinary.v2.uploader.upload_large(req.body.myFile, opts)
  .then(result => {return res.json(result)})
  .catch(err => {return res.json(err)})
})



//REGISTERING as a CUSTOMER

router.route("/customer").post(async (req, res) => {
    
    const { email } = req.body;
    const userCustomer = await UserCustomer.findOne({ email });
    if (userCustomer) {
      return res.json({msg: "User with this email already exists!"})
    }
    //Hashing the inputted password by the user and replacing it with original one and then storing in database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const newUser = new UserCustomer(req.body);
    newUser.save();
    const refToken = refreshTokenGen(newUser._id);
    const response = {
        user: newUser,
        token: tokenGen(newUser._id),
        refToken: refToken,
        msg: `Welcome to ZumeIT, ${newUser.firstName} ${newUser.lastName}!!`
    };
    let newRefToken = new RefToken({refToken: refToken})
    newRefToken.save();
    try {
        return res.json(response);
    }catch (err) {
        return res.json(err.toString());
    }
});

//REGISTERING as a MERCHANT

router.route("/merchant").post(async (req, res) => {
    
    const { email } = req.body;
    const userMerchant = await UserMerchant.findOne({ email });
    if (userMerchant) {
      return res.json({msg: "User with this email already exists!"})
    }
    //Hashing the inputted password by the user and replacing it with original one and then storing in database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const newUser = new UserMerchant(req.body);
    newUser.save();
    const refToken = refreshTokenGen(newUser._id);
    const response = {
      user: newUser,
      token: tokenGen(newUser._id),
      refToken: refToken,
      msg: `Welcome to ZumeIT, ${newUser.firstName} ${newUser.lastName}!!`,
    };
    let newRefToken = new RefToken({refToken: refToken})
    newRefToken.save();
    try {
        return res.json(response);
    }catch (err) {
        return res.json(err.toString());
    }
});

export default router;