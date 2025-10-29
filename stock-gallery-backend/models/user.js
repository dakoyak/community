'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here

      // 1:N 관계 (User가 여러 Comment를 가짐)
      User.hasMany(models.Comment, {
        foreignKey: 'UserId', // Comment 테이블의 UserId 컬럼이 User를 참조
        sourceKey: 'id',      // User 테이블의 id 컬럼을 참조
        onDelete: 'CASCADE', // User 삭제 시 관련 Comment 삭제
      });

      // 1:N 관계 (User가 여러 Post를 가짐)
      User.hasMany(models.Post, {
        foreignKey: 'UserId', // Post 테이블의 UserId 컬럼이 User를 참조
        sourceKey: 'id',      // User 테이블의 id 컬럼을 참조
        onDelete: 'CASCADE', // User 삭제 시 관련 Post 삭제
      });

      // N:M 관계 (User가 여러 Post를 추천함, Like 테이블을 통해)
      User.belongsToMany(models.Post, {
        through: models.Like, // 연결 테이블로 Like 모델 사용
        foreignKey: 'UserId', // Like 테이블에서 User를 참조하는 키
        otherKey: 'PostId',    // Like 테이블에서 상대방(Post)을 참조하는 키
        as: 'LikedPosts'       // 관계 별칭 (선택 사항, 나중에 조회 시 사용)
      });
    }
  }

  User.init({
    // id: 자동 생성 (Primary Key)
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // 고유해야 함
      validate: {
        isEmail: true, // 이메일 형식 검사
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // 고유해야 함
    },
    // createdAt, updatedAt: 자동 생성 (timestamps: true)
  }, {
    sequelize, // models/index.js에서 넘겨주는 sequelize 인스턴스
    modelName: 'User', // Sequelize 내부에서 사용할 모델 이름
    tableName: 'Users', // 실제 데이터베이스 테이블 이름
    timestamps: true, // createdAt, updatedAt 컬럼 자동 생성 및 관리
  });
  return User;
};