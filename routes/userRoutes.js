const express = require("express");
const { getAllUsers, createUser, getUser, deleteUser, updateUser, loginUser } = require("../controllers/userController");

const router = express.Router();

router.post("/new-user", createUser);
router.post("/login", loginUser)

router.get("/all-users", getAllUsers);

router.get("/user/:id", getUser);

router.delete("/user/:id", deleteUser);

router.patch("/user/:id", updateUser);


module.exports = router;