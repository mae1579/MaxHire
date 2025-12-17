const express = require("express");

const logoutRouter = express.Router();

logoutRouter.post("/", (req, res)=> {


    res.clearCookie("token_auth", "", {
        httpOnly: true,
        sameSite: "strict",
        expires: new Date(0)
    })
    res.status(200).json({message:"Wylogowano pomyslnie"});

})

module.exports = {
    logoutRouter,
}
