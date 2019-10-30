'use strict';
module.exports = (sequelize, DataTypes) => {
  const Books = sequelize.define('Books', {
    book_id: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true
      // allowNull: false
    },
    title: DataTypes.STRING,
    author: DataTypes.STRING, 
    price: DataTypes.NUMBER,
    stock: DataTypes.NUMBER
  },
    { timestamps: false });
  Books.associate = function (models) {
    // associations can be defined here
  };
  return Books;
};