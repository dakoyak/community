'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     * 다른 모델과의 관계(Association)를 정의합니다.
     */
    static associate(models) {
      // Define association here
      // 1. Like는 User에 속합니다 (belongsTo)
      Like.belongsTo(models.User, {
        foreignKey: 'UserId',
        targetKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      // 2. Like는 Post에 속합니다 (belongsTo)
      Like.belongsTo(models.Post, {
        foreignKey: 'PostId',
        targetKey: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Like.init({
    // id: 자동 생성 (Primary Key)
    // UserId: 추천한 사용자 ID (Foreign Key)
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
    // PostId: 추천된 게시글 ID (Foreign Key)
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
    modelName: 'Like', // Sequelize 내부에서 사용할 모델 이름
    tableName: 'Likes', // 실제 데이터베이스 테이블 이름
    timestamps: true, // createdAt, updatedAt 컬럼 자동 생성
    indexes: [ // 인덱스 추가 (중복 추천 방지 및 조회 성능 향상)
      {
        unique: true, // UserId와 PostId 조합은 고유해야 함 (한 사람이 같은 글 중복 추천 방지)
        fields: ['UserId', 'PostId']
      }
    ]
  });
  return Like;
};
