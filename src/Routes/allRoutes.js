module.exports = (app) => {
    const testController = require("../Controllers/testController.js")
    const loginController = require("../Controllers/loginControllers.js")
    const paymentController = require("../Controllers/paymentControllers.js")
    const MappingController = require("../Controllers/mappingControllers.js")
    const userProfileController = require("../Controllers/userProfileControllers.js")
    const myCourseController = require("../Controllers/myCourseControllers.js")
    const jwtAuth = require("../../Services/jwt");
    var router = require("express").Router();

    router.get("/", jwtAuth.jwtAuthentication, testController.testapi)
    router.post("/sendotp", loginController.sendOtp);
    router.post("/register", loginController.register)
    router.post("/login", loginController.login)
    router.post("/resetPassword", loginController.resetPassword)
    router.post("/razorpayPaymentCapture", paymentController.payment)
    router.get("/getCourseMapping", MappingController.getCourseMapping)
    router.get("/getMethodMapping", MappingController.getMethodMapping)
    router.get("/getuserProfile", userProfileController.getUserProfile)
    router.post("/paymentVerification", paymentController.paymentVerification)
    router.post("/updatePersonalDetails", loginController.updatePersonalDetails)
    router.post("/methodandcourse", myCourseController.saveCourseandMethod)
    router.post("/Videos", myCourseController.videos)
    router.post("/video", myCourseController.video)
    router.post("/getNotes", myCourseController.getNotes)
    router.get("/getHistory", userProfileController.getHistory)
    router.get("/getSectionMapping", MappingController.getSectionMapping)
    router.get("/getSubjects", MappingController.getSubjectsMapping)
    router.get("/getChapters", MappingController.getChaptersMapping)
    router.get("/getTopics", MappingController.getTopicMapping)
    router.get("/milestone", myCourseController.milestone)
    router.post("/saveProgress", myCourseController.saveProgress)
    router.get("/patternMapping", testController.patternMapping)
    router.get("/getTestQuestions", testController.getTestQuestions)
    router.post("/createTest", testController.createTest)
    app.use("/api/v1", router);
};
