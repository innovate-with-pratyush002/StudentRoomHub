const wrapAsync = require("../utils/wrapAsync");
const express = require("express");
const router = express.Router();
const profile = require("../controller/userProfile");

//Profile details of user
router.get("/", wrapAsync(profile.userProfile));

module.exports = router;