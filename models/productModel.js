const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    stock: {
        type: Boolean,
        default: true,
    },
    productImage: {
        type: String,
        default: ""
    },
    photoPublicId: {
        type: String,
        default: ""
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
     timestamps: true
});


const productModel = mongoose.model("Product", productSchema);

module.exports = productModel