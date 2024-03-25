const { Router } = require("express");
const handlePolicies = require("../middleware/handle-policies.middleware");
const { cartModel, GetAllCarts, CreateCart, AddProduct, DeleteByCidAndPid } = require("../model/carts.model");
const { userModel } = require("../model/user.model");

const router = Router();

router.get('/', handlePolicies(["admin"]), async (req, res) => {
    try {
        const carts = await GetAllCarts();
        res.send(carts);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error retrieving carts: ${error}`);
    }
});

router.get("/:cid", handlePolicies(["user", "admin"]), async (req, res) => {
    const cid = req.params.cid
    const cart = await cartModel.find({ _id: cid }).populate("products.product", { title: 1, price: 1, stock: 1, code: 1 });
    res.status(200).send({ cart });
})

router.post('/', handlePolicies(["user", "admin"]), async (req, res) => {
    try {
        const { user: { id } } = req.user;
        const newCart = { products: [{ product: req.body.product, quantity: req.body.quantity }] };
        const cart = await CreateCart(newCart);

        const userData = await userModel.findById({ _id: id });
        userData.carts.push({ cart: cart._id });
        const updatedCart = await userModel.updateOne({ _id: id }, userData);

        if (!updatedCart.acknowledged) {
            return res.status(500).json({
                message: `error al actualizar el cart del usuario`,
            });
        }

        res.json({
            ok: true,
            message: 'Cart added',
            cart: cart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error adding cart: ${error}`);
    }
});

router.delete("/:cid/product/:pid", handlePolicies(["user", "admin"]), async (req, res) => {
    try {
        const pid = req.params.pid;
        const cid = req.params.cid
        await DeleteByCidAndPid(cid, pid);
        res.json({
            ok: true,
            message: 'Cart deleted',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error deleting cart: ${error}`);
    }
});

router.put('/:cid', handlePolicies(["user", "admin"]), async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const cart = await cartModel.findByIdAndUpdate(
            cid,
            { $set: { products } },
            { new: true } // Retorna el documento actualizado
        );

        if (!cart) {
            return res.status(404).send({ error: 'Carrito no encontrado' });
        }

        res.status(200).send({ cart });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al actualizar el carrito' });
    }
});

router.put('/:cid/products/:pid', handlePolicies(["user", "admin"]), async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await cartModel.findById(cid);

        if (!cart) {
            return res.status(404).send({ error: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(product => product.product.toString() === pid);

        if (productIndex === -1) {
            return res.status(404).send({ error: 'Producto no encontrado en el carrito' });
        }

        cart.products[productIndex].quantity = quantity;

        await cart.save();

        res.status(200).send({ cart });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al actualizar la cantidad del producto' });
    }
});

router.delete('/:cid', handlePolicies(["user", "admin"]), async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartModel.findByIdAndUpdate(cid, { $set: { products: [] } });

        if (!cart) {
            return res.status(404).send({ error: 'Carrito no encontrado' });
        }

        res.status(200).send({ message: 'Carrito vaciado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al vaciar el carrito' });
    }
});


module.exports = router;