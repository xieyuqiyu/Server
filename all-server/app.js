const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
require('dotenv').config();
const { testConnection } = require('./config/db');

const app = express();

// 中间件配置
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 配置静态文件服务
app.use('/uploads', express.static('public/uploads'));

// 测试数据库连接
// testConnection();

// 导入路由
const usersRouter = require('./routes/users');
const navigationRouter = require('./routes/navigation');

// 注册路由
app.use('/api/users', usersRouter);
app.use('/api/navigation', navigationRouter);

// API文档
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 基础路由
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API server' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API文档地址: http://localhost:${PORT}/api-docs`);
});