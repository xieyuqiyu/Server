const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'All-Server API 文档',
      version: '1.0.0',
      description: '这是一个用户管理系统的API文档',
      contact: {
        name: 'xieyuqiyu',
        email: 'xieyuqiyu@example.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? `http://192.168.1.100:${process.env.PORT || 3009}`
          : `http://localhost:${process.env.PORT || 3009}`,
        description: process.env.NODE_ENV === 'production' ? '生产服务器' : '开发服务器'
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

module.exports = swaggerJsdoc(options);