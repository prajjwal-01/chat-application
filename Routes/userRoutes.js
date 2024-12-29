const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);

// second Method
router.post("/login", authUser);
// router.route("/").get(protect, allUsers);
// or we can use this method
// router.route("/").post(registerUser).get(allUsers);

module.exports = router;
