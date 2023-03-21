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
    destination: (req, file, cb)=>{
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if(isValid){
            error = null;
        }
        cb(error, "backend/images");
    }
    ,
    filename: (req, file, cb)=>{
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
})

router.post('/signup', multer({storage: storage}).single('image'), async (req,res)=>{
    const url = req.protocol + '://' + req.get('host');
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPass,
        imagePath: url + '/images/' + req.file.filename
    })
    const userSaved = await user.save();
    if(userSaved){
        // console.log(userSaved);
        res.status(200).json({message: 'User created successfully',user: userSaved})
    }
    else{
        res.status(500).json({message: 'User creation failed'})
    }
})


// const storage = multer.diskStorage({
//     destination: (req, file, cb)=>{
//         const isValid = MIME_TYPE_MAP[file.mimetype];
//         let error = new Error('Invalid mime type');
//         if(isValid){
//             error = null;
//         }
//         cb(error, "backend/images");
//     }
//     ,
//     filename: (req, file, cb)=>{
//         const name = file.originalname.toLowerCase().split(' ').join('-');
//         const ext = MIME_TYPE_MAP[file.mimetype];
//         cb(null, name + '-' + Date.now() + '.' + ext);
//     }
// })


// router.post('/signup', multer({storage: storage}).single('image'), async (req,res)=>{
//     const hashedPass = await bcrypt.hash(req.body.password, 10);
//     const user = new User({
//         name: req.body.name,
//         email: req.body.email,
//         password: hashedPass
//     })
//     const userSaved = await user.save();
//     if(userSaved){
//         res.status(201).json({
//             message: 'User created successfully',
//         })
//     }
//     else{
//         res.status(400).json({
//             message: 'User not created'
//         })
//     }
// })

router.post('/login', async (req,res)=>{
    User.findOne({email: req.body.email}, (err, user)=>{
        if(err){
            res.status(500).json({
                message: 'Error in finding user'
            })
        }
        if(!user){
            res.status(404).json({
                message: 'User not found'
            })
        }
        if(user){
            bcrypt.compare(req.body.password, user.password, (err, result)=>{
                if(err){
                    res.status(500).json({
                        message: 'Error in comparing password'
                    })
                }
                if(result){
                    const token = jwt.sign({email: user.email, userId: user._id}, process.env.JWT_KEY, {expiresIn: '1h'})
                    res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    })
                }
                else{
                    res.status(401).json({
                        message: 'Auth failed'
                    })
                }
            })
        }
    })
})
module.exports = router;