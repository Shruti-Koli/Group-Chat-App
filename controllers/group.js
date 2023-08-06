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
        //console.log("userid",req.user.id);
        const groupName = req.body.groupName.trim();
        //console.log("groupname:",groupName);
        if(Invalidstring(groupName)){
            return res.status(400).json({message:'Group Name can not be Empty'})
        }//groupName


        const user = await Group.findAll({where:{groupName:groupName}});
        if(user.length>0){
            return res.status(400).json({message:'Group with this name already exists'})
        }else{
            const data = await Group.create({groupName: groupName},{ transaction:t})
    
            //console.log("created group id:",data.id)
        
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

exports.isAdmin = async(req, res, next)=>{
    try{
        const groupId = req.query.groupId;
        const usera = await User.findByPk(req.user.id);
        const usersDetails= await usera.getGroups({
                where:{id: groupId }
            })
        //console.log("usersDetails",usersDetails[0].userAndGroup.admin)
        if(usersDetails[0].userAndGroup.admin){
            return res.status(200).json({
                message: "is admin"
             })
        }else{
            return res.status(400).json({
                message: "Only Admins can edit the group"
             })
        }
        
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

            // console.log("userList:::",listofusers)
            return res.status(200).json({listofusers: listofusers})
        }else{
            return res.status(400).json({message:'Only admins can edit the group'})
        }  
    }catch(err){
        console.log(err)
        res.status(500).json({message:err})
    }
}

exports.addNewUser = async(req, res, next)=>{
    try{
        const groupId = req.query.groupId;
        const userx=await UserAndGroup.findOne({where: {userId: req.user.id, groupId:groupId}});

        if(userx.admin){   
            //console.log("userid",req.user.id);
            const email = req.body.email.trim();
            //console.log("email:",email);
            if(Invalidstring(email)){
                return res.status(400).json({message:'Field can not be Empty'})
            }
            const userpresent = await User.findAll({where:{email:email}});

            if(userpresent.length==0){
                return res.status(404).json({message:'User not found'});
            }

            const reqgroup = await Group.findByPk(groupId);
            const listofusers= await reqgroup.getUsers({
                where: {email: email}
            })

            if(listofusers.length>0){
                return res.status(400).json({message:'this person already exists in the group'})
            }else{
                await UserAndGroup.create({userId: userpresent[0].id, groupId: groupId}) //, admin: true
                return res.status(200).json({message: 'Successfully added new user'})
            }
        }else{
            return res.status(400).json({message:'Only admins can add new members to the group'})
        }  
    }catch(err){
        console.log(err)
        res.status(500).json({message:err})
    }
}

exports.removeUser = async(req, res, next)=>{
    try{
        const groupId = req.query.groupId;
        const userx=await UserAndGroup.findOne({where: {userId: req.user.id, groupId:groupId}});

        if(userx.admin){   

            const userIdtoRemove = req.body.userId;
            //console.log("userIdtoRemove:",userIdtoRemove);

            const reqgroup = await Group.findByPk(groupId);
            const userpresent= await UserAndGroup.findAll({where: {userId: userIdtoRemove, groupId:groupId}})
            //console.log("userpresent[0].id,", userpresent[0].id)
            if(userpresent.length==0){
                return res.status(404).json({message:'User not is in the group'});
            }else{
                await UserAndGroup.destroy({
                    where: {userId:userIdtoRemove, groupId:groupId}
                });//, admin: true
                return res.status(200).json({message: 'User successfully removed'})
            }
        }else{
            return res.status(400).json({message:'Only admins can remove members from the group'})
        }  
    }catch(err){
        console.log(err)
        res.status(500).json({message:err})
    }
}

//addNewAdmin
//removeAdmin

exports.addNewAdmin = async(req, res, next)=>{
    try{
        const groupId = req.query.groupId;
        const userx=await UserAndGroup.findOne({where: {userId: req.user.id, groupId:groupId}});

        if(userx.admin){   
            const userIdtoMakeAdmin = req.body.userId;
            //console.log("userIdtoMakeAdmin:",userIdtoMakeAdmin);

            const reqgroup = await Group.findByPk(groupId);
            const userpresent= await UserAndGroup.findAll({where: {userId: userIdtoMakeAdmin, groupId:groupId}})
            //console.log("userpresent[0].id,", userpresent[0].id)
            if(userpresent.length==0){
                return res.status(404).json({message:'User not is in the group'});
            }else{
                await UserAndGroup.update({admin: true},{where:{userId:userIdtoMakeAdmin, groupId:groupId}})

                return res.status(200).json({message: 'Admin Updated'})
            }
        }else{
            return res.status(400).json({message:'Only admins can remove members from the group'})
        }  
    }catch(err){
        console.log(err)
        res.status(500).json({message:err})
    }
}

exports.removeAdmin = async(req, res, next)=>{
    try{
        const groupId = req.query.groupId;
        const userx=await UserAndGroup.findOne({where: {userId: req.user.id, groupId:groupId}});

        if(userx.admin){   
            const userIdtoMakeAdmin = req.body.userId;

            const reqgroup = await Group.findByPk(groupId);
            const userpresent= await UserAndGroup.findAll({where: {userId: userIdtoMakeAdmin, groupId:groupId}})
            //console.log("is he an admin?,", userpresent[0].admin);
            if(userpresent[0].admin== true){
                if(userpresent.length==0){
                    return res.status(404).json({message:'User not is in the group'});
                }else{
                    await UserAndGroup.update({admin: false},{where:{userId:userIdtoMakeAdmin, groupId:groupId}})
    
                    return res.status(200).json({message: 'Admin Updated'})
                }
            }else{
                return res.status(400).json({message:'this user is not an admin'})
            }
            
        }else{
            return res.status(400).json({message:'Only admins can remove members from the group'})
        }  
    }catch(err){
        console.log(err)
        res.status(500).json({message:err})
    }
}