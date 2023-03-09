const jwt = require("jsonwebtoken")
const { isValidObjectId } = require("mongoose");
const userModel = require("./model/userModel");


const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, msg: "token must be present in header" })
        jwt.verify(token, 'anil', function (err, decodedToken) {
            if (err)  return res.status(401).send({ status: false, msg: "invalid Token " }) 
            req.decodedToken = decodedToken
            next()
        })
    } catch (err) {
        return res.status(500).send({ msg: err.message })
    }
}

const authorisation = async function (req, res, next) {
    try {
        let getuserId = req.params.userId;

        if (!isValidObjectId(getuserId)) return res.status(400).send({ status: false, msg: "Enter a valid userId" })

        let user = await userModel.findOne({ _id: getuserId })
        if (!user) return res.status(404).send({ status: false, msg: "User not found !" })
        if (user.isDeleted) return res.status(400).send({ status: false, msg: "User is already been deleted" })

        let userId = book.userId
        if (userId != req.decodedToken.userId) return res.status(403).send({ status: false, msg: "you do not have authorization to this " });
        next()
    }
    catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

module.exports = { authentication, authorisation }

