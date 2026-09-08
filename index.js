const express = require("express");

const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");




const app = express();

const PORT = process.env.PORT || 8080;

const dbString = "mongodb+srv://cypher:cypherTech4Lif3@cluster0.v3lsjms.mongodb.net/?appName=Cluster0";
const compassString = "mongodb://localhost:27017/cohort8";


app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello, world")
});

app.use("/users", userRoutes);

app.use("/products", productRoutes);

const dbUrl = process.env.NODE_ENV === "production" ? dbString : compassString;

mongoose.connect(dbUrl).then(() => {
    console.log(`Connected to MongoDB on ${dbUrl}`); 
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})




