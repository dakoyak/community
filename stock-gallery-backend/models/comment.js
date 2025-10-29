'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     * 다른 모델과의 관계(Association)를 정의합니다.
     */
    static associate(models) {
      // Define association here
      // 1. Comment는 User에 속합니다 (belongsTo)
      Comment.belongsTo(models.User, {
        foreignKey: 'UserId', // Comments 테이블에 UserId 컬럼 생성
        targetKey: 'id',
        onDelete: 'CASCADE', // User가 삭제되면 Comment도 삭제
        onUpdate: 'CASCADE',
      });

      // 2. Comment는 Post에 속합니다 (belongsTo)
      Comment.belongsTo(models.Post, {
        foreignKey: 'PostId', // Comments 테이블에 PostId 컬럼 생성
        targetKey: 'id',
        onDelete: 'CASCADE', // Post가 삭제되면 Comment도 삭제
        onUpdate: 'CASCADE',
      });
    }
  }

  Comment.init({
    // id: 자동 생성 (Primary Key)
    content: {
      type: DataTypes.TEXT, // 댓글 내용은 길 수 있으므로 TEXT
      allowNull: false,
    },
    // UserId: 댓글 작성자 ID (Foreign Key)
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Users 테이블 참조
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    // PostId: 댓글이 달린 게시글 ID (Foreign Key)
    PostId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Posts', // Posts 테이블 참조
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
    // createdAt, updatedAt: 자동 생성 (timestamps: true)
  }, {
    sequelize, // models/index.js에서 넘겨주는 sequelize 인스턴스
    modelName: 'Comment', // Sequelize 내부에서 사용할 모델 이름
    tableName: 'Comments', // 실제 데이터베이스 테이블 이름
    timestamps: true, // createdAt, updatedAt 컬럼 자동 생성
  });
  return Comment;
};