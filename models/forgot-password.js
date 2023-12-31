
const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Forgotpassword = sequelize.define('forgotpassword', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: {
        type: Sequelize.BOOLEAN
    },
    expiresby: {
        type: Sequelize.DATE
    }
})

module.exports = Forgotpassword;