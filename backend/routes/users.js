const express = require('express');
const router = express.Router();
const User = require('../model/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const multer = require('multer')

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images");
    }
    ,
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
})

router.post('/signup', multer({ storage: storage }).single('image'), async (req, res) => {
    const url = req.protocol + '://' + req.get('host');
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPass,
        imagePath: url + '/images/' + req.file.filename
    })
    const userSaved = await user.save();
    if (userSaved) {
        // console.log(userSaved);
        res.status(200).json({ message: 'User created successfully' })
    }
    else {
        res.status(500).json({ message: 'User creation failed' })
    }
})



router.post('/login', async (req, res, next) => {
    const userFound = await User.find({ email: req.body.email });
    if (userFound) {
        bcrypt.compare(req.body.password, userFound[0].password, (err, result) => {
            if (err) {
                return res.status(401).send({
                    message: 'Password is incorrect'
                })
            }
            if (result) {
                const token = jwt.sign({ email: userFound.email, userId: userFound._id }, process.env.JWT_KEY, { expiresIn: "1h" })
                res.status(200).send({
                    message: 'Logged In Successfully',
                    token: token,
                    expiresIn: 3600,
                    userEmail: userFound[0].email,
                })
            }
            // res.status(401).send({
            //     message: 'Authentication failed'
            // })
        })
    } else {
        res.status(401).send({
            message: 'This Email is not registered to any account'
        })
    }
})

router.get('/:email',async(req,res,next)=>{
    const userFound = await User.find({email:req.params.email})
    if(userFound){
        res.status(200).json({message:"User Found",user:userFound})
    }else{
        res.status(404).json({message:'User not found'})
    }
})

router.put('/update/:email', multer({ storage: storage }).single('image'),async(req,res,next)=>{
    const userFound = await User.find({email:req.params.email})
    if(userFound){
        console.log(userFound)
        const url = req.protocol + '://' + req.get('host');
        userFound[0].name = req.body.name;
        userFound[0].email = req.body.email;
        userFound[0].imagePath = url + '/images/' + req.file.filename;
        const userUpdated = await userFound[0].save();
        if(userUpdated){
            res.status(200).json({message:'User updated successfully',user:userUpdated})
        }else{
            res.status(500).json({message:'User update failed'})
        }
    }else{
        res.status(404).json({message:'User not found'})
    }
})

// router.get('/:id', async (req, res, next) => {
//     const userFound = await User.findById(req.params.id);
//     if (userFound) {
//         console.log(userFound);
//         res.status(200).json({ user: userFound });
//     } else {
//         res.status(404).json({ message: 'User not found' })
//     }
// })

// router.put('/:id', multer({ storage: storage }).single('image'), async (req, res, next) => {
//     const url = req.protocol + '://' + req.get('host');
//     const userFound = await User.findById(req.params.id);
//     if (userFound) {
//         userFound.name = req.body.name;
//         userFound.email = req.body.email;
//         userFound.imagePath = url + '/images/' + req.file.filename;
//         const userUpdated = await userFound.save();
//         if (userUpdated) {
//             res.status(200).json({ message: 'User updated successfully', user: userUpdated })
//         } else {
//             res.status(500).json({ message: 'User update failed' })
//         }
//     } else {
//         res.status(404).json({ message: 'User not found' })
//     }
// })

module.exports = router;