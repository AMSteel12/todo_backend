var express = require("express");
var router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");

const saltRounds = 10;

const privateKey = process.env.JWT_PRIVATE_KEY;

router.use(function (req, res, next) {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      req.hashedPassword = hash;
      next();
    });
  });
});

router.post("/login", async function (req, res, next) {
  if (req.body.username && req.body.password) {
    const user = await User.findOne()
      .where("username")
      .equals(req.body.username)
      .exec();

    if (user) {
      console.log(user);
      return await bcrypt
        .compare(req.body.password, user.password)
        .then((result) => {
          if (result === true) {
            const token = jwt.sign({id: user._id}, privateKey, {
              algorithm: "RS256",
            });
            return res.status(200).json({
              id: user._id,
              username: user.username,
              access_token: token,
            });
          } else {
            return res.status(401).json({error: "Invalid login credentials."});
          }
        })
        .catch((error) => {
          return res.status(500).json({error: error.message});
        });
    }

    return res.status(401).json({ error: "Invalid login credentials." });
  } else {
    return res.status(400).json({ error: "Missing login credentials" });
  }
});

router.post("/register", async function (req, res, next) {
  if (req.body.username && req.body.password && req.body.passwordConfirmation) {
    if (req.body.password === req.body.passwordConfirmation) {
      const user = new User({
        username: req.body.username,
        password: req.hashedPassword,
      });
      await user
        .save()
        .then((savedUser) => {
          console.log();
          return res.status(201).json({
            id: savedUser._id,
            username: savedUser.username,
          });
        })
        .catch((error) => {
          return res.status(500).json({ error: error.message });
        });
    }
    return res.status(400).json({ error: "Registration passwords are not a match" });
  } else {
    return res.status(400).json({ error: "Missing registration credentials" });
  }
});

module.exports = router;
