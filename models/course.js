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
                    msg: 'A title is required'
                },
                notEmpty: {
                    msg: 'Please provide a title'
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
        },

        materialsNeeded: {
            type: DataTypes.STRING,
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