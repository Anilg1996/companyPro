const express = require('express');
const router = express.Router();
const {createUser,loginUser,updateUserProfile,getAllUser,deleteUser} = require("./controller/userController")
const {authentication,authorisation} = require("./auth");
module.exports = router

//-------------------------------------Handling Handled route---------------------------------
router.post("/createuser",createUser);
router.post("/login",loginUser);
router.get("/getuser",getAllUser);
router.put("/:userId",updateUserProfile,authentication,authorisation);
router.delete("/:userId",deleteUser,authentication,authorisation);

//------------------------------------Handling unhandled route---------------------------------
router.all("/*", function (req, res) {
    return res.status(400).send({ status: false, msg: "Path not found" })
});