const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please enter to confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
    message: "Password are not the same",
  },
  role: {
    type: String,
    enum: ["user", "seller", "admin"],
    default: "user",
  },
  photo: String,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

//The userSchema.pre("save", ...) middleware in Mongoose is a pre-save hook that runs before saving a document to the database. In this case, it is used to perform operations before saving a user document, specifically for hashing the password.

userSchema.pre("save", async function (next) {
  // the hashing works only when there's a new user with new password or when user changes their password
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12); // hashing password

  this.passwordConfirm = undefined;

  next();
});

// comparing password for logging in the user
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// this instance method is used to determine whether the user had change the password or not
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

module.exports = model("User", userSchema);
