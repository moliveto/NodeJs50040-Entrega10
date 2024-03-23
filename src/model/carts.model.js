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
                quantity: { type: Number, default: 1 },
                _id: false,
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

async function GetAllCarts() {
    try {
        const carts = await cartModel.find();
        return carts;
    } catch (error) {
        const errMessage = 'Error al obtener los carritos';
        throw new Error(`${errMessage}: ${error.message}`);
    }
}

async function CreateCart(newCart) {
    try {
        //console.log(newCart);
        const cart = new cartModel(newCart);
        const savedCart = await cart.save();
        return savedCart;
    } catch (error) {
        const errMessage = 'Error al crear el carrito';
        throw new Error(`${errMessage}: ${error.message}`);
    }
}

module.exports = { cartModel, GetAllCarts, CreateCart };