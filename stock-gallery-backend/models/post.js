'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      // N:1 관계 (Post는 User에 속함)
      Post.belongsTo(models.User, {
        foreignKey: 'UserId', // Post 테이블에 UserId 컬럼으로 User의 id를 참조합니다.
        targetKey: 'id',      // User 테이블의 id 컬럼을 참조합니다.
        onDelete: 'CASCADE', // 사용자가 삭제되면 해당 사용자의 게시글도 함께 삭제됩니다.
        onUpdate: 'CASCADE',
      });

      // 1:N 관계 (Post는 여러 Comment를 가짐)
      Post.hasMany(models.Comment, {
        foreignKey: 'PostId', // Comment 테이블의 PostId 컬럼이 Post를 참조
        sourceKey: 'id',      // Post 테이블의 id 컬럼을 참조
        onDelete: 'CASCADE', // Post 삭제 시 관련 Comment 삭제
      });

      // N:M 관계 (Post는 여러 User에게 추천받음, Like 테이블을 통해)
      Post.belongsToMany(models.User, {
        through: models.Like, // 연결 테이블로 Like 모델 사용
        foreignKey: 'PostId', // Like 테이블에서 Post를 참조하는 키
        otherKey: 'UserId',    // Like 테이블에서 상대방(User)을 참조하는 키
        as: 'LikerUsers'       // 관계 별칭 (선택 사항)
      });
    }
  }

  Post.init({
    // id: 자동 생성 (Primary Key)
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT, // 게시글 내용은 길 수 있으므로 TEXT 타입 사용
      allowNull: false,
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // 기본값을 0으로 설정
    },
    // UserId: 외래 키 (Foreign Key) 정의. 어떤 User가 작성했는지 연결합니다.
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // 참조할 테이블 이름 (models/user.js 에서 정의한 tableName)
        key: 'id',      // 참조할 테이블의 컬럼 이름 (Users 테이블의 id)
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
    // createdAt, updatedAt: 자동 생성 (timestamps: true)
  }, {
    sequelize, // models/index.js에서 넘겨주는 sequelize 인스턴스
    modelName: 'Post', // Sequelize 내부에서 사용할 모델 이름
    tableName: 'Posts', // 실제 데이터베이스 테이블 이름
    timestamps: true, // createdAt, updatedAt 컬럼 자동 생성
  });
  return Post;
};