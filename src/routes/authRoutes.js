const express=require("express");
const router=express.Router();
const authController=require("../controllers/authController");

router.post("/register",authController.register);
router.post("/login",authController.login);
router.post("/refresh",authController.refresh);
router.post("/logout",authController.logout);

router.get("/mail-test", async (req, res) => {

    const emailService = require("../services/emailService");

    await emailService.sendMail({

        to: "subhalaxmisrichandan08@gmail.com",

        subject: "Test Email",

        html: "<h1>Hello PawPoint 🐶</h1>",

    });

    res.send("Mail Sent");

});
router.post(
    "/forgot-password",
    authController.forgotPassword
);
router.post(
    "/reset-password/:token",
    authController.resetPassword
);
module.exports=router;

