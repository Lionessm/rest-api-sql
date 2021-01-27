'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    firstName: {
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
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A last name is required'
        },
        notEmpty: {
          msg: 'Please provide a last name'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'The email you entered already exists'
      },
      validate: {
        notNull: {
          msg: 'An email is required'
        },
        isEmail: {
          msg: 'Email is not valid. Please provide a valid email.'
        }
      }
    },

    confirmedPassword: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        console.log("val", val);
        console.log("this.confirmedPassword", this.confirmedPassword);
        if (val === this.confirmedPassword ) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue('password', hashedPassword);
        }
      },
      validate: {
        notNull: {
          msg: 'Both passwords must match'
        }
      }
    }
  }, { sequelize });

  // Add associations.
  User.associate = (models) => {

    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: 'id',
        allowNull: false,
      },
    });
  };

  return User;
};