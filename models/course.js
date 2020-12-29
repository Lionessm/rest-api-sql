'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {

    class Course extends Model {}
    Course.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A name is required'
                },
                notEmpty: {
                    msg: 'Please provide a name'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A description is required'
                },
                notEmpty: {
                    msg: 'Please provide a description'
                }
            }
        },
        estimatedTime: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'The email you entered already exists'
            },
            validate: {
                notNull: {
                    msg: 'An email is required'
                },
                notEmpty: {
                    msg: 'Please provide an email'
                }
            }
        },
        materialsNeeded: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        userId: {
            type: DataTypes.INTEGER,
            foreignKey: {
                fieldName: 'id',
                allowNull: false,
            },
        },

    }, { sequelize });

    Course.associate = (models) => {
        // TODO Add associations.
        Course.belongsTo(models.User, {
            foreignKey: {
                fieldName: 'id',
                allowNull: false,
            },
        });
    };

    return Course;
    };