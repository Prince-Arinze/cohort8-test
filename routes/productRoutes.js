const express = require("express");
const { uploadProduct, getAllProducts } = require("../controllers/productController.js");

const productRouter = express.Router();


productRouter.post("/upload/:userId", uploadProduct);
productRouter.get("/getAll", getAllProducts);


module.exports = productRouter;