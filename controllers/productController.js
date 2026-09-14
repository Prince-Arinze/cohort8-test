const fs = require("fs");
const productModel = require("../models/productModel");
const userModel = require("../models/UserModel");
const cloudinary = require("../config/cloudinary");


const uploadProduct = async (req, res) => {
    const {
        name,
        price,
        description,
        stock,
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

        if (!req.file) {
            return res.status(400).json({
                message: "Image is required... please upload an image"
            })
        };

        const result = await cloudinary.uploader.upload(req.file.path);
        const imageUrl = result.secure_url;
        const photoPublicId = result.public_id

        const product = await productModel.create({
            name,
            price,
            description,
            stock,
            productImage: imageUrl,
            photoPublicId,
            quantity,
            category,
            user: getUser._id
        });

        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error(
                    "Failed to remove temp upload:",
                    err.message
                );
            }
        })

        return res.status(201).json({
            error: false,
            message: "Product uploaded successfully",
            data: product
        });

    } catch (err) {
        return res.status(500).json({
            error: true,
            message: `Error uploading product: ${err.message}`
        });
    }
};


const getAllProducts = async (req, res) => {
    try {
        const getAll = await productModel.find();
        if (getAll.length === 0) {
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

const getSingleProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await productModel.findById(productId);

        if (!product) return res.status(404).json({
            error: true,
            message: "Product not found"
        });

        res.status(200).json({
            error: false,
            message: "Product successfully retrieved",
            data: product
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: `Error retrieving product: ${err.message}`
        });
    }
};

const getUserProducts = async (req, res) => {
    const userId = req.params.userId;
    try {
        const userProducts = await productModel.find({ user: userId });

        if (userProducts.length === 0) return res.status(404).json({
            error: true,
            message: "No product found for this user"
        });

        return res.status(200).json({
            error: false,
            message: "Products fetched successfully",
            data: userProducts
        })
    } catch (err) {
        res.status(500).json({ error: true, message: err.message })
    }
}

const updateProduct = async (req, res) => {
    const { productId, userId } = req.params;
    const { price, stock, quantity } = req.body;

    try {
        const userProduct = await productModel.findById(productId);

        if (!userProduct) {
            return res.status(404).json({
                error: true,
                message: "Product not found"
            })
        };

        const { user } = userProduct;

        if (userId !== user.toString()) {
            return res.status(403).json({
                error: true,
                message: "You are not authorized to perform this operation"
            });
        }

        const updates = {
            price,
            stock,
            quantity
        };


        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);

            updates.productImage = result.secure_url;
            updates.photoPublicId = result.public_id;

            if (userProduct.photoPublicId) {
                await cloudinary.uploader.destroy(userProduct.photoPublicId)
            };

            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error(
                        "Failed to remove temp upload:",
                        err.message
                    );
                }
            })
        }

        const product = await productModel.findByIdAndUpdate(productId, updates, {
            new: true,
            runValidators: true
        });
        return res.status(200).json({
            error: false,
            message: "This product has been updated successfully",
            data: product
        });
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: err.message
        })
    }
}

const deleteProduct = async (req, res) => {
    const { productId, userId } = req.params;
    try {
        const userProduct = await productModel.findById(productId);
        if (!userProduct) {
            return res.status(404).json({
                error: true,
                message: "product not found"
            })
        };

        if (userId !== userProduct.user.toString()) {
            return res.status(403).json({
                error: true,
                message: "You are not authorized to perform this operation"
            })
        }

        if (userProduct.photoPublicId) {
            await cloudinary.uploader.destroy(userProduct.photoPublicId);
        };

        await productModel.findByIdAndDelete(productId);

        return res.status(200).json({
            error: false,
            message: "Product successfully deleted."
        })
    } catch (err) {
        return res.status(500).json({
            error: true,
            message: err.message
        })
    }

}

module.exports = {
    uploadProduct,
    getAllProducts,
    getSingleProduct,
    getUserProducts,
    updateProduct,
    deleteProduct
}