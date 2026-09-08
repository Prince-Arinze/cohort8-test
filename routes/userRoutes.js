const express = require("express");
const { getAllUsers, createUser, getUser, deleteUser, updateUser } = require("../controllers/userController");

const router = express.Router();

router.post("/new-user", createUser);

router.get("/all-users", getAllUsers);

router.get("/user/:id", getUser);

router.delete("/user/:id", deleteUser);

router.patch("/user/:id", updateUser);

module.exports = router;