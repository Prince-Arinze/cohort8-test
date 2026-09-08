const productModel = require("../models/productModel");
const userModel = require("../models/UserModel");

const uploadProduct = async (req, res) => {
    const {
        name,
        price,
        description,
        stock,
        productImage,
        quantity,
        category
    } = req.body;

    try {
        const getUser = await userModel.findById(req.params.userId);

        if (!getUser) {
            return res.status(404).json({
                error: true,
                message: "User not found"
            });
        }

        const product = await productModel.create({
            name,
            price,
            description,
            stock,
            productImage,
            quantity,
            category
        });

        getUser.products.push(product._id);

        await getUser.save();

        return res.status(201).json({
            error: false,
            message: "Product uploaded successfully",
            data: product
        });

    } catch (err) {
        return res.status(500).json({
            error: true,
            message: "Error uploading product"
        });
    }
};


const getAllProducts = async (req, res) => {
    try {
        const getAll = await productModel.find();
        if(getAll.length === 0){
            return res.status(404).json({
                error: true,
                message: "No product found"
            })
        };
        return res.status(200).json({
            error: false,
            message: "Products fetched successfully",
            data: getAll
        });
    } catch (err) {
       return res.status(500).json({
            error: true,
            message: `Error Fetching products: ${err.message}`
       });
    }
}


module.exports = {
    uploadProduct,
    getAllProducts
}