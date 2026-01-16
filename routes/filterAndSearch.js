const wrapAsync = require("../utils/wrapAsync");
const express = require("express");
const router = express.Router();
const listings = require("../controller/filterAndSearch");

// Search + all listings
router.get("/", wrapAsync(listings.searchBar));

module.exports = router;
