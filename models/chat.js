const Sequelize=require('sequelize');
const sequelize=require('../utils/database');

const chat =sequelize.define('chat',{
    id:
    {
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        unique:true
    },
    message:Sequelize.STRING,
    type:Sequelize.STRING
})

module.exports=chat;