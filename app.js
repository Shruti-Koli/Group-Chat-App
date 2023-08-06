const express = require('express');
const bodyParser = require('body-parser');
const http =require ("http");
require('dotenv').config();
const path = require('path');
const sequelize = require('./utils/database');
const cors = require('cors');
const socketIO=require('socket.io')

const User = require('./models/user');
const Chat = require('./models/chat');
const Group = require('./models/group');
const UserAndGroup = require('./models/user-and-group');

const userroutes = require('./routes/user');
const chatroutes = require('./routes/chat');
const grouproutes = require('./routes/group');

const app = express();

const server = http.createServer(app);
const io= socketIO(server,{ cors : { origin : '*'}});

app.use(bodyParser.json({extended:false}));

// app.use((req, res) => {
//     res.sendFile(path.join(__dirname, `public/${req.url}`))
// })



//relationships: 
User.hasMany(Chat);
Chat.belongsTo(User);

Group.hasMany(Chat)
Chat.belongsTo(Group)

User.belongsToMany(Group, {through : UserAndGroup})
Group.belongsToMany(User, {through : UserAndGroup})

// sequelize.sync()
// .then(() => {
//     app.listen(3000)
// }) 
// .catch(err => {
//     console.log(err)
// })
io.on("connection", (socket) => {
    console.log(`------------User connected: ${socket.id}`);

    socket.on("sentMessage", () => {
        console.log('messageReceived');
        socket.broadcast.emit("recieveMessage");
    });
});
app.use(cors({
    origin:'*'
}));
app.use('/user',userroutes);
app.use('/chat',chatroutes);
app.use('/group',grouproutes);

sequelize.sync()
.then((res)=>{
    server.listen(3000);
})
.catch(err=>console.log(err));