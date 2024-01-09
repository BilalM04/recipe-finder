require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

var cors = require('cors')
app.use(cors())

mongoose.connect(
    process.env.MONGODB_URI, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json());

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

app.listen(process.env.PORT || port, () => console.log("Server is running"));
