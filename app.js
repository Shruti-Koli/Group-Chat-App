const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const path = require('path')
const sequelize = require('./util/database')
const cors = require('cors')
const fs = require('fs')

const User = require('./Models/user')

const userroutes = require('./routes/user_routes')


const app = express();
app.use(cors());
app.use(bodyParser.json({extended:false}));

// app.use((req, res) => {
//     res.sendFile(path.join(__dirname, `public/${req.url}`))
// })

app.use('/user',userroutes);

sequelize.sync()
.then(() => {
    app.listen(4000)
}) 
.catch(err => {
    console.log(err)
})