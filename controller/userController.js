const User = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getUser = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    data: {
      users,
    },
  });
});
