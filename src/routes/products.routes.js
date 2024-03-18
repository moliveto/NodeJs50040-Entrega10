const { Router } = require("express");
const { getAllProducts, InsertMany, GetProductById, GetAllProductsFilteredAndPaged, CreateProduct, UpdateProduct, DeleteProduct } = require("../model/products.model");
const handlePolicies = require("../middleware/handle-policies.middleware");

const router = Router();

// router.get("/", handlePolicies(["admin", "users"]), async (req, res) => {
//     try {
//         const products = await getAllProducts();
//         res.send(products);
//     } catch (error) {
//         res.status(500).send({ error: "Error al obtener los productos" });
//     }
// });

router.get("/insertion", handlePolicies(["admin"]), async (req, res) => {
    const results = await InsertMany();
    return res.json({
        message: `data inserted succesfully`,
        results,
    });
});

router.get("/:pid", handlePolicies(["admin", "users"]), async (req, res) => {
    const pid = req.params.pid;
    try {
        const product = await GetProductById(pid);
        res.send(product);
    } catch (error) {
        res.status(500).send({ error: "Error al obtener el producto por ID" });
    }
});

router.get("/", handlePolicies(["admin", "users"]), async (req, res) => {
    try {
        // Definir los parámetros predeterminados si no se proporcionan en la solicitud
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const sort = req.query.sort === 'desc' ? -1 : 1;
        const query = req.query.query || ''; // Por ahora solo se considera una búsqueda por título

        // Construir el objeto de opciones para la paginación
        const options = {
            page,
            limit,
            sort: { price: sort } // Ordenar por precio ascendente o descendente
        };

        // Construir el objeto de filtro para la búsqueda
        const filter = null;
        if (query) {
            // Búsqueda por título (ignorando mayúsculas y minúsculas)
            filter = {
                title: { $regex: query, $options: 'i' }
            };
        }

        const result = await GetAllProductsFilteredAndPaged(filter, options);

        res.json({
            status: 'success',
            payload: result.Payload,
            totalPages: result.TotalPages,
            prevPage: result.PrevPage,
            nextPage: result.NextPage,
            page: result.Page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.PrevLink,
            nextLink: result.NextLink
        });
    } catch (error) {
        res.status(500).json({ error: `${error.message}` });
    }
});

router.post("/", handlePolicies(["admin"]), async (req, res) => {
    try {
        console.log(req);
        const bodyProd = req.body;
        const newProduct = await CreateProduct(bodyProd);
        res.send(newProduct);
    } catch (error) {
        res.status(500).send({ error: `Error al agregar el producto ${error}` });
    }
});

router.put("/:id", handlePolicies(["admin"]), async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProduct = await UpdateProduct(id, req.body);
        res.send(updatedProduct);
    } catch (error) {
        res.status(500).send({ error: `Error al actualizar el producto ${error}` });
    }
});

router.delete("/:id", handlePolicies(["admin"]), async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await DeleteProduct(id);
        res.send(deletedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: `Error al eliminar el producto ${error}` });
    }
});

module.exports = router;