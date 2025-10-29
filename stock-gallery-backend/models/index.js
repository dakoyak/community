'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development'; // 환경 변수 NODE_ENV가 없으면 'development' 사용

// .env 파일 로드 (config.json 대신 여기서 직접 환경 변수 사용)
require('dotenv').config();

// config/config.json 파일 대신 환경 변수를 직접 사용하여 Sequelize 인스턴스 생성
const sequelize = new Sequelize(
  process.env.DB_NAME,      // 데이터베이스 이름 (.env 에서 읽어옴)
  process.env.DB_USER,      // 사용자 이름 (.env 에서 읽어옴)
  process.env.DB_PASSWORD,  // 비밀번호 (.env 에서 읽어옴)
  {
    host: process.env.DB_HOST, // 호스트 주소 (.env 에서 읽어옴)
    dialect: 'postgres',     // 사용할 데이터베이스 종류
    logging: console.log,   // SQL 쿼리 로그를 콘솔에 출력 (개발 시 유용)
    // dialectOptions: { // SSL 설정 등이 필요할 경우 추가
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false // 개발 환경에서는 false로 설정하기도 함
    //   }
    // }
  }
);

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