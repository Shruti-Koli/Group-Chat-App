const Chat = require('../models/chat');
const User = require('../models/user');
const sequelize = require('../utils/database');

function Invalidstring(str){
    if(str.trim().length==0 || str == undefined){
        return true;
    }else{
        return false;
    }
}

exports.getChats = async(req, res, next)=>{
    try{
        const data = await Chat.findAll()
        res.status(200).json({
            messages: data
         })
    }catch(err){
        console.log(err)
        res.status(500).json({message:err})
    }
}

exports.addChat =async (req, res, next)=>{
    try{
        console.log(req.body.message);
        console.log(req.user.id);
        const message = req.body.message.trim();
        if(Invalidstring(message)){
            return res.status(400).json({message:'Type some message to send'})
        }
        const data = await Chat.create({
            message:message,
            type:"string",
            userId: req.user.id
        })
        res.status(200).json({newMessage: data});
    }
    catch(err){
        //await t.rollback();
        console.log(err)
        res.status(500).json({message:err})
    }
};