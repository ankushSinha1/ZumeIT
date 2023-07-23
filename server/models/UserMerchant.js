import mongoose from "mongoose";
const userMerchantSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    profilePic: String,
    shopName: String,
    shopCategory: String,
    address: String,
    products: [],
    contactNum: Number,
}, {
        timestamps: {
            createdAt: true,
            updatedAt: true,
        }
    }
)

export default mongoose.model("UserMerchant", userMerchantSchema)