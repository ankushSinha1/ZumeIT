import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    brand: String,
    description: String,
    specs: [],
    images: [],
    price: Number,
    merchantDetails: {},
    inStock: Boolean,
    rating: Number,
}, {    
    timestamps: {
        createdAt: true, 
        updatedAt: true,
    }
})

export default mongoose.model("Product", productSchema);