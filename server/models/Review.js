import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
    title: String,
    text: String,
    images: [],
    productId: String,
    productRating: Number,
    author: {},
}, {
    timestamps: {
        createdAt: true, 
        updatedAt: true
    }
    }
)
export default mongoose.model("Review", reviewSchema);