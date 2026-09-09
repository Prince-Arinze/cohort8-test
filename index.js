const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

const PORT = process.env.PORT || 8080;


app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({message: "App is running!"})
});

app.use("/users", userRoutes);

app.use("/products", productRoutes);

const dbUrl = process.env.NODE_ENV === "production" ? process.env.MONGO_URI : process.env.COMPASS_URI;

mongoose.connect(dbUrl).then(() => {
    console.log(`Connected to MongoDB on ${dbUrl}`); 
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})




