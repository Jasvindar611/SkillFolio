const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const checkAuth = require("../middleware/check-auth");
const multer = require("multer");
const cors = require("cors");
const router = express.Router();

const MIME_TYPE_MAP ={
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
}

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("invalid mime type");
        if(isValid){
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) =>{
        const name = file.originalname
        .toLowerCase()
        .split(" ")
        .join("-");
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + "-" + Date.now() + ext);
        }
});
router.use(cors());

router.post("/signup", multer({ storage: storage }).single("image"), async (req, res, next) => {
    try {
        const url = req.protocol + "://" + req.get("host");
      const hash = await  bcrypt.hash(req.body.password, 10);
      const user = new User({
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        gender: req.body.gender,
        dob: req.body.dob,
        imagePath: url + "/images/" + req.file.filename,
        password: hash,
      });
  
      const result = await user.save();
      res.status(201).json({
        message: "User created successfully",
        result: result,
      });
    } catch (err) {
      if (err.name === "ValidationError" && err.errors.email && err.errors.email.kind === "unique") {
        res.status(409).json({
          message: "Email address already exists. Please use a different email.",
        });
      } else {
        const errorMessage = err.message || "Server error. Please try again later.";
        res.status(500).json({
            message: errorMessage,
        });
      }
    }
  });

    router.post("/login", (req, res, next) =>{
        let fetchedUser;
        User.findOne({email: req.body.email})
        .then(user =>{
            if(!user){
                return res.status(401).json({
                    message:"Please check your email and try again"
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result =>{
            if(!result){
                return res.status(401).json({
                    message:"Incorrect password! Please check your password and try again"
                });
            }
            const token = jwt.sign(
                {email: fetchedUser.email, userId: fetchedUser._id},
                "secret_this_should_be_longer",
                {expiresIn: "1h"}
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            });
        })
        .catch(err =>{
            return res.status(401).json({
                message: "Invalid authentication credentials"
            });
        });
    });

    router.get("/details",checkAuth, (req, res, next) => {
        User.findById(req.userData.userId)
        .then(user =>{
            if(!user){
                return res.status(404).json({
                    message: "User not found"
                });
            }
            res.status(200).json({
                fName: user.fName,
                lName: user.lName,
                email: user.email,
                gender: user.gender,
                dob:user.dob,
                imagePath: user.imagePath

            });
        })
        .catch(error => {
            res.status(500).json({
                message: "something went wrong",
                error: error
            });
        });
    });


module.exports = router;