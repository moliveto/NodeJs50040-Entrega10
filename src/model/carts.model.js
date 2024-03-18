const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                    //required: true
                },
                quantity: {
                    type: Number
                    //required: true
                }
            },
        ],
        default: [],
    }
});

cartSchema.pre('findOne', function () {
    this.populate('products._id')
});

const collectionName = 'carts';
const cartModel = mongoose.model(collectionName, cartSchema);

module.exports = cartModel;