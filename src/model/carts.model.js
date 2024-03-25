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
                closed: { type: Boolean, default: false },
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

async function AddProduct(cid, pid, quantity) {

    try {

        console.log(`${cid} ${pid} ${quantity}`);

        const cart = await CartModel.findById(cid);
        console.log(cart);
        const product = await ProductsModel.findById(pid);
        console.log(product);

        if (!cart) {
            throw new Error(`No existe el cart ${cid}`);
        }
        if (!product) {
            throw new Error(`No existe el producto ${pid}`);
        }

        const index = cart.products.findIndex(prod => prod.product === pid);
        console.log(`resultado index ${index}`);
        if (index !== -1) {
            cart.products[index].quantity = quantity + cart.products[index].quantity
        } else {
            cart.products.push({ product: pid, quantity: quantity });
        }

        await CartModel.findOneAndUpdate({ _id: cid }, cart)
        return { status: "success", message: "Producto Agregado", producto: cart }

    } catch (error) {
        return { status: "addProduct failed", message: error.message }
    }
}

async function DeleteByCidAndPid(cid, pid) {
    try {
        const deletedCart = await CartModel.findOneAndUpdate(
            { _id: cid }, // Filter by cart ID
            { $pull: { products: { product: pid } } }, // Remove product with pid from products array
            { new: true } // Return the updated cart document
        );
        return deletedCart;
    } catch (error) {
        const errMessage = `Error al eliminar el carrito por cid ${cid}  y pid ${pid} `;
        throw new Error(`${errMessage}: ${error.message}`);
    }
}


module.exports = { cartModel, GetAllCarts, CreateCart, AddProduct, DeleteByCidAndPid };