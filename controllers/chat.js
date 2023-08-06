const Chat = require('../models/chat');
const User = require('../models/user');
const sequelize = require('../utils/database');
const { Op } = require('sequelize');

function Invalidstring(str){
    if(str.trim().length==0 || str == undefined){
        return true;
    }else{
        return false;
    }
}

exports.getChats = async(req, res, next)=>{
    try{
        const previousId = req.query.previousId;
        const groupId = req.query.groupId;
        //console.log('previousId======',previousId);
        const data = await Chat.findAll({
            attributes: ['id','message','groupId'],
            where:{
                id:{
                [Op.gt]:previousId
                }, groupId: groupId},    
            include: [{     
                model : User,
                attributes : ['name'],
                required : true
            }],
            order : ['id']
        })


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
        //console.log("req.body.message",req.body.message);
        //console.log("user id",req.user.id);
        const message = req.body.message.trim();
        const groupId = req.query.groupId;
        //console.log("groupId",groupId);
        if(Invalidstring(message)){
            return res.status(400).json({message:'Type some message to send'})
        }
        const data = await Chat.create({
            message:message,
            type:"string",
            userId: req.user.id,
            groupId:groupId
        })
        res.status(200).json({newMessage: data});
    }
    catch(err){
        //await t.rollback();
        console.log(err)
        res.status(500).json({message:err})
    }
};