const express = require("express");
const Resume = require("../model/resume");
const chechAuth = require("../middleware/check-auth");
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

router.post(
    "/builder",
    chechAuth,
    multer({ storage: storage }).single("image"),
    (req, res, next) =>{
        const url = req.protocol + "://" + req.get("host");
        const resume = new Resume({
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        mob: req.body.mob,
        dob: req.body.dob,
        address: req.body.address,
        education1: req.body.education1,
        college: req.body.college,
        startYear: req.body.startYear,
        endYear: req.body.endYear,
        skills: req.body.skills,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    resume.save().then(result =>{
        res.status(201).json({
            message: "Resume created Successfully",
            result: result,
            resumeId: result._id,
        });
    })
    .catch(error =>{
        res.status(500).json({
            message: "Creating resume Failed"
        });
    });
});


    router.get("/preview/:creatorId", (req, res, next) =>{
        const creatorId = req.params.creatorId;
        Resume.findOne({creator: creatorId})
        .then(userData =>{
            if(userData){
            res.status(200).json({
                message: "resume fetched",
                resumeData: [userData]
            });
        }
        else{
            res.status(404).json({
                message:"Resume not found",
            });
        }
        })
        .catch(error =>{
            res.status(500).json({
                message: "Error occurred while fetching resume"
            });
        });
    });





module.exports = router;