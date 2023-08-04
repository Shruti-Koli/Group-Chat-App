const Chat = require('../models/chat');
const User = require('../models/user');
const Group = require('../models/group');
const UserAndGroup = require('../models/user-and-group');

const sequelize = require('../utils/database');
const { Op } = require('sequelize');

function Invalidstring(str){
    if(str.trim().length==0 || str == undefined){
        return true;
    }else{
        return false;
    }
}

exports.addGroup =async (req, res, next)=>{
    const t = await sequelize.transaction()
    try{
        console.log("userid",req.user.id);
        const groupName = req.body.groupName.trim();
        console.log("groupname:",groupName);
        if(Invalidstring(groupName)){
            return res.status(400).json({message:'Group Name can not be Empty'})
        }//groupName


        const user =0//await Groups.findAll({where:{groupName:groupName}});
        if(user.length>0){
            return res.status(400).json({message:'Group with this name already exists'})
        }else{
            const data = await Group.create({groupName: groupName},{ transaction:t})
    
            console.log("created group id:",data.id)
        
            await UserAndGroup.create({userId: req.user.id, groupId: data.id, admin: true}, { transaction: t }) 

            await t.commit()
            res.status(200).json({message: 'Successfully created new group'})
        }
    }
    catch(err){
        console.log(err);
        await t.rollback();
        console.log(err)
        res.status(500).json({message:err})
    }
};

exports.getGroups = async(req, res, next)=>{
    try{

        const user=await User.findOne({where : {id:req.user.id}});
        const data =await user.getGroups(); 

        res.status(200).json({
            allGroups: data
         })
    }catch(err){
        console.log(err)
        res.status(500).json({message:err})
    }
}

exports.getGroupUsers = async(req, res, next)=>{
    try{
        const groupId = req.query.groupId;
        const userx=await UserAndGroup.findOne({where: {userId: req.user.id, groupId:groupId}});
        //console.log("nowuser",user);
        if(userx.admin){   
            const reqgroup = await Group.findByPk(groupId);
            const listofusers= await reqgroup.getUsers({
                attributes:['id','name','email']
            })

            // const userList = await User.findAll({
            //     attributes: ['id', 'name', 'email'],
            //     include: [
            //       {
            //         model: Group,
            //         where: { id: groupId },
            //         attributes: [admin], // Set this to an empty array to exclude Group attributes from the result
            //       }
            //     ],
            //   });



            // const userList = await UserAndGroup.findAll({
            //     where:{
            //         groupId: groupId},    
            //     include: [{     
            //         model : User,
            //         attributes : ['name','email'],
            //     },],
            //     order : ['id']
            // });
            console.log("userList:::",listofusers)
            return res.status(200).json({listofusers: listofusers})
        }else{
            return res.status(400).json({message:'Only admins can edit the group'})
        }  
    }catch(err){
        console.log(err)
        res.status(500).json({message:err})
    }
}

