'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development'; // 환경 변수 NODE_ENV가 없으면 'development' 사용

// .env 파일 로드 (config.json 대신 여기서 직접 환경 변수 사용)
require('dotenv').config();

// config/config.json 파일 대신 환경 변수를 직접 사용하여 Sequelize 인스턴스 생성
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // AWS RDS의 경우 이 설정이 필요할 수 있습니다.
    }
  }
});

// 데이터베이스 연결 테스트 함수
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL 데이터베이스 연결 성공!');
  } catch (error) {
    console.error('❌ PostgreSQL 데이터베이스 연결 실패:', error);
  }
};

// 연결 테스트 실행
testConnection();


const db = {};

// models 폴더 내의 모델 파일들을 자동으로 읽어와서 db 객체에 추가하는 부분 (나중에 모델 만들면 사용됨)
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize; // Sequelize 인스턴스
db.Sequelize = Sequelize; // Sequelize 라이브러리 자체

module.exports = db; // db 객체 내보내기 (sequelize 인스턴스 포함)