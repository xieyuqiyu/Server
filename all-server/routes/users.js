/**
 * @fileoverview
 * 用户相关的路由配置
 * 
 * 该文件定义了用户模块的所有API路由，包括：
 * - 获取用户列表
 * - 获取单个用户信息
 * - 创建新用户
 * - 更新用户信息
 * - 删除用户
 * 
 * @author xieyuqiyu
 * @version 1.0.0
 * @date 2025-01-06
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 获取用户列表
router.get('/', userController.getUsers);

// 获取单个用户
router.get('/:id', userController.getUserById);

// 创建新用户
router.post('/', userController.createUser);

// 更新用户信息
router.put('/:id', userController.updateUser);

// 删除用户
router.delete('/:id', userController.deleteUser);

module.exports = router;