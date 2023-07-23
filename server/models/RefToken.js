import mongoose from 'mongoose';
const refTokenSchema = new mongoose.Schema({
    refToken: String,
})
export default mongoose.model("RefToken", refTokenSchema)