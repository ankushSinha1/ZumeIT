import mongoose from 'mongoose';
const userCustomerSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    profilePic: String,
    orders: [],
    cart:[],
    address: String,
    contactNum: Number,
}, {    
        timestamps: {
            createdAt: true, 
            updatedAt: true,
        }
    }
)
export default mongoose.model("UserCustomer", userCustomerSchema);