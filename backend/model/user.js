const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = mongoose.Schema({
    //name can have spaces 
    name: { type: String, required: true, minLength: 3, maxLength: 20, validate: value => { if (!validator.isAlpha(value, 'en-US', { ignore: ' ' })) { throw new Error({ error: 'Name can only contain alphabets' }) } } },
    
    email: { type: String, required: true, unique: true, lowercase: true, validate: value => { if (!validator.isEmail(value)) { throw new Error({ error: 'Invalid Email address' }) } } },

    password: { type: String, required: true, minLength: 7, validate: value => { if (!validator.isStrongPassword(value)) { throw new Error({ error: 'Password is not strong enough' }) } } },

    imagePath: { type: String, required: true }

})

const User = mongoose.model('User', userSchema)
module.exports = User