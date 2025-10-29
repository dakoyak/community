// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const cors = require('cors');
const db = require('./models'); // Import Sequelize instance and models (runs models/index.js)
const authRouter = require('./routes/auth'); // Import authentication router
const postRouter = require('./routes/post'); // Import post router
const commentRouter = require('./routes/comment'); // Import comment router
const errorMiddleware = require('./middleware/errorMiddleware'); // Import error middleware

// Create Express application instance
const app = express();

// Define the port for the server
const port = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors()); // Enable CORS for all routes
// 1. Parse incoming JSON requests and put the parsed data in req.body
app.use(express.json());
// 2. (Optional) Parse URL-encoded requests (e.g., from HTML forms)
// app.use(express.urlencoded({ extended: false }));

// --- Routes ---
// Root path for basic server check (Test route)
app.get('/', (req, res) => {
  res.send('해외주식 갤러리 백엔드 서버가 작동 중입니다! 🚀');
});

// Mount the authentication router for requests starting with /api/v1/auth
app.use('/api/v1/auth', authRouter);

// Mount the post router for requests starting with /api/v1/posts
app.use('/api/v1/posts', postRouter); // <--- 2. postRouter 등록 (주석 해제!)

// Mount the comment router for requests starting with /api/v1/comments
app.use('/api/v1/comments', commentRouter);

// --- Error Handling Middleware ---
app.use(errorMiddleware);


// --- Sync Database and Start Server ---
// Synchronize all defined models with the database.
db.sequelize.sync({ force: false })
  .then(() => {
    // This message indicates that the models were synchronized successfully.
    console.log('🔄 데이터베이스 동기화 완료.');

    // Start the server only after the database synchronization is successful
    app.listen(port, () => {
      console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
    });
  })
  .catch((err) => {
    // This message indicates that synchronization failed.
    console.error('❌ 데이터베이스 동기화 실패:', err);
  });

