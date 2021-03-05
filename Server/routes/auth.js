const express = require("express");
const router = express.Router();
const User = require("../models/user");
const UserData = require("../models/userData");
const Role = require("../models/role");
const Study = require("../models/study");
const Challenge = require("../models/challenge");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const neuronegmService = require("../services/neuronegm/connect");

const authMiddleware = require("../middlewares/authMiddleware");
const { isValidObjectId } = require("mongoose");
const {
  generateProgress,
  saveGMPlayer,
  sendConfirmationEmail,
} = require("../utils/routeUtils");

router.post(
  "/register",
  [authMiddleware.verifyBodyAdmin, authMiddleware.uniqueEmail],
  async (req, res) => {
    // Role
    const role = await Role.findOne({ name: "admin" }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
    });
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);
    //create user
    const user = new User({
      email: req.body.email.toLowerCase(),
      password: hashpassword,
      role: role._id,
    });
    await neuronegmService.connectGM(
      req.body.email,
      req.body.password,
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
    //save user in db
    await user.save((err, user) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
      res.status(200).json({
        user,
      });
    });
  }
);

router.post(
  "/register/:study_id",
  [authMiddleware.verifyBody, authMiddleware.uniqueEmail],
  async (req, res) => {
    const study_id = req.params.study_id;
    if (!isValidObjectId(study_id)) {
      return res.status(404).json({
        ok: false,
        message: "Study doesn't exist!",
      });
    }

    // Find student role
    const role = await Role.findOne({ name: "student" }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
    });

    // Find study
    const study = await Study.findOne({ _id: study_id }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
    });

    // Find study challenges
    const challenges = await Challenge.find({ study: study }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
    });

    if (!study) {
      return res.status(404).json({
        ok: false,
        message: "STUDY_NOT_FOUND_ERROR",
      });
    }

    //create userData
    const userData = new UserData({
      tutor_names: req.body.tutor_names,
      tutor_last_names: req.body.tutor_last_names,
      tutor_phone: req.body.tutor_phone,
      names: req.body.names,
      last_names: req.body.last_names,
      birthday: req.body.birthday,
      course: req.body.course,
      institution: req.body.institution,
      institution_commune: req.body.institution_commune,
      institution_region: req.body.institution_region,
      relation: req.body.relation,
    });          

    //save userData in db
    userData.save((err, userData) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        })
      }
    });
    
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);

    //create user
    const user = new User({
      email: req.body.email,
      names: req.body.names,
      password: hashpassword,
      role: role._id,
      study: study._id,
      userData: userData._id
    });

    //save user in db
    user.save((err, user) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }

      // Generate user study progress entry
      generateProgress(challenges, user, study)
        .catch((err) => {
          return res.status(404).json({
            ok: false,
            err,
          });
        })
        .then((progress) => {
          // Register player in NEURONE-GM
          saveGMPlayer(req, user, study, res);

          // Send confirmation email
          sendConfirmationEmail(user, userData, res, req);

          res.status(200).json({
            user,
          });
        });
    });
  }
);

router.post("/login", async (req, res) => {
  //checking if username exists
  const user = await User.findOne({
    email: req.body.email.toLowerCase(),
  }).populate("role");
  if (!user) res.status(400).send("EMAIL_NOT_FOUND");
  //checking password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) res.status(400).send("INVALID_PASSWORD");
  //check if user is confirmed
  if (!user.confirmed) res.status(400).send("USER_NOT_CONFIRMED");
  //create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("x-access-token", token).send({ user: user, token: token });
});

module.exports = router;
