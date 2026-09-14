const express = require("express");

const {
    uploadProduct,
    getAllProducts,
    getSingleProduct,
    getUserProducts,
    updateProduct,
    deleteProduct
} = require("../controllers/productController.js");

const upload = require("../config/multer.js");

const productRouter = express.Router();

productRouter.post(
    "/upload/:userId",
    upload.single("productImage"),
    uploadProduct
);

productRouter.get("/product/:productId", getSingleProduct);

productRouter.get("/user/product/:userId", getUserProducts);

productRouter.patch(
    "/product/:productId/:userId",
    upload.single("productImage"),
    updateProduct
);

productRouter.delete(
    "/product/:productId/:userId",
    deleteProduct
);

productRouter.get("/getAll", getAllProducts);

module.exports = productRouter;