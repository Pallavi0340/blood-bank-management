const userModel = require("../models/usermodel");
module.exports = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.userId);
    //check admin
    if (!user || user.role !== "admin") {
      return res.status(403).send({
        success: false,
        message: "Access denied. Admin only.",
      });
    }
    next();
  } catch (error) {
    console.log("Admin middleware error:", error.message);

    return res.status(500).send({
      success: false,
      message: "Error in admin authorization",
    });
  }
};
