module.exports = (sequelize, DataTypes) => {
  const blogs = sequelize.define("blogs", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  blogs.associate = (models) => {
    blogs.hasMany(models.comments, {
      onDelete: "cascade",
    });
    blogs.hasMany(models.likes, {
      onDelete: "cascade",
    });
  };
  return blogs;
};
