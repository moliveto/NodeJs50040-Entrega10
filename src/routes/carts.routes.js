const { Router } = require("express");
const { CartModel } = require("../model/carts.model");

const router = Router();

router.get('/', async (req, res) => {
    try {
        const carts = await CartModel.find();
        res.send(carts);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error retrieving carts: ${error}`);
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const cart = await CartModel.findById(cartId);
        if (cart) {
            res.send(cart);
        } else {
            res.status(404).send('Cart not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error retrieving cart: ${error}`);
    }
});

router.post('/', async (req, res) => {
    try {
        const newCart = req.body;
        const cart = new CartModel(newCart);
        const savedCart = await cart.save();
        res.json({
            ok: true,
            message: 'Cart added',
            cart: savedCart,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error adding cart: ${error}`);
    }
});

router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const cid = req.params.cid
        await cartManager.deleteByCidAndPid(cid, pid);
        res.json({
            ok: true,
            message: 'Cart deleted',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error deleting cart: ${error}`);
    }
});

router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        const cart = await CartModel.findByIdAndUpdate(
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

router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await CartModel.findById(cid);

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

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await CartModel.findByIdAndUpdate(cid, { $set: { products: [] } });

        if (!cart) {
            return res.status(404).send({ error: 'Carrito no encontrado' });
        }

        res.status(200).send({ message: 'Carrito vaciado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al vaciar el carrito' });
    }
});

router.get("/:cid", async (req, res) => {
    const cid = req.params.cid
    const cart = await CartModel.find({ _id: cid }).populate("products.product", { title: 1, price: 1, stock: 1, code: 1 });
    res.status(200).send({ cart });
})

module.exports = router;