const mongoose = require("mongoose");
const { Types, Schema, model } = mongoose;
const mongoosePaginateV2 = require("mongoose-paginate-v2");
const { getAllProductsFromJson } = require('../data/product-data.js');

// Definir el esquema para el producto
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, default: 'Sin imagen' },
    code: { type: String, required: true, unique: true, index: true },
    stock: { type: Number, required: true },
    status: { type: Boolean, default: true },
});

const collectionName = 'products';
productSchema.plugin(mongoosePaginateV2);
const productsModel = mongoose.model(collectionName, productSchema);

async function getAllProducts() {
    try {
        const products = await productsModel.find();
        return products;
    } catch (error) {
        throw new Error('Error al obtener los productos');
    }
}

async function InsertMany() {
    try {
        const productsData = await getAllProductsFromJson();
        const products = await productsModel.insertMany(productsData);
        return products;
    } catch (error) {
        throw new Error(`Error en insersion masiva de productos ${error}`);
    }
}

async function GetProductById(productId) {
    try {
        const product = await productsModel.findById(productId);
        return product;
    } catch (error) {
        const errMessage = `Error al obtener los productos por ID ${productId}`;
        throw new Error(`${errMessage}: ${error.message}`);
    }
}

async function GetAllProductsFilteredAndPaged(filter, options) {
    try {
        const {
            docs,
            totalDocs,
            page,
            totalPages,
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage,
        } = await productsModel.paginate(filter, options);

        // console.log(docs);
        // console.log(filter);
        // console.log(options);

        const prevLink = hasPrevPage ? `/api/products?page=${prevPage}` : null;
        const nextLink = hasNextPage ? `/api/products?page=${nextPage}` : null;

        return {
            Payload: docs,
            TotalPages: totalPages,
            PrevPage: prevPage,
            NextPage: nextPage,
            Page: page,
            HasPrevPage: hasPrevPage,
            HasNextPage: hasNextPage,
            PrevLink: prevLink,
            NextLink: nextLink
        };
    } catch (error) {
        throw new Error(`Error al obtener los productos: ${error.message}`);
    }
}

async function CreateProduct(productData) {
    try {
        const product = new productsModel(productData);
        const savedProduct = await product.save();
        return savedProduct;
    } catch (error) {
        const errMessage = `Error al crear el producto`;
        throw new Error(`${errMessage}: ${error.message}`);
    }
}

async function UpdateProduct(productId, newData) {
    try {
        const updatedProduct = await productsModel.findByIdAndUpdate(productId, newData, { new: true });
        return updatedProduct;
    } catch (error) {
        const errMessage = `Error al actualizar el producto`;
        throw new Error(`${errMessage}: ${error.message}`);
    }
}

async function DeleteProduct(productId) {
    try {
        if (!Types.ObjectId.isValid(productId)) {
            throw new Error(`El productId ${productId} no es un ObjectId válido`);
        }

        const objectId = new Types.ObjectId(productId);
        const result = await productsModel.deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
            throw new Error(`Producto con id ${productId} no encontrado`);
        }
        return result;
    } catch (error) {
        const errMessage = `Error al eliminar el producto ${productId}`;
        throw new Error(`${errMessage}: ${error.message}`);
    }
}

module.exports = { productsModel, getAllProducts, InsertMany, GetProductById, GetAllProductsFilteredAndPaged, CreateProduct, UpdateProduct, DeleteProduct };