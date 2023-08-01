const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const path = require('path')
const sequelize = require('./utils/database')
const cors = require('cors')
const fs = require('fs')

const User = require('./models/user');
const Chat = require('./models/chat');

const userroutes = require('./routes/user')
const chatroutes = require('./routes/chat')

const app = express();
app.use(cors());
app.use(bodyParser.json({extended:false}));

// app.use((req, res) => {
//     res.sendFile(path.join(__dirname, `public/${req.url}`))
// })

app.use('/user',userroutes);
app.use('/chat',chatroutes);

User.hasMany(Chat);
Chat.belongsTo(User);

sequelize.sync()
.then(() => {
    app.listen(3000)
}) 
.catch(err => {
    console.log(err)
})