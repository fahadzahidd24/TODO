const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users')
const app = express();


let mongoDb = mongoose.connect(`mongodb+srv://crud:${process.env.MONGO_PASS}@crud.fg66fgt.mongodb.net/TODO?retryWrites=true&w=majority`)
if(mongoDb){
    console.log('Connected to MongoDB');
}
else{
    console.log('Error connecting to MongoDB');
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });

app.use('/api/users', userRoutes)


module.exports = app;