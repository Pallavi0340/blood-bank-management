const express = require("express")
const authMiddleware = require("../middlewares/authMiddleware");
const { bloodGroupDetailsContoller } = require("../controllers/analyticsController");

const router = express.Router();
//get donors records
router.get('/bloodGroups-data', authMiddleware, bloodGroupDetailsContoller)
// module.exports = router;

module.exports = router;