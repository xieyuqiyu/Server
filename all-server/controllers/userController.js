/**
 * @fileoverview
 * 用户控制器
 * 
 * 该文件实现了用户模块的所有业务逻辑，包括：
 * - 用户列表查询
 * - 单个用户查询
 * - 用户创建
 * - 用户信息更新
 * - 用户删除
 * 
 * @author xieyuqiyu
 * @version 1.0.0
 * @date 2025-01-06
 */

const { pool } = require('../config/db');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 获取所有用户列表
 *     description: 返回系统中所有用户的信息列表
 *     tags: [用户管理]
 *     responses:
 *       200:
 *         description: 成功获取用户列表
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: 用户ID
 *                   name:
 *                     type: string
 *                     description: 用户名称
 *                   email:
 *                     type: string
 *                     description: 用户邮箱
 *                   date:
 *                     type: string
 *                     description: 日期
 *       500:
 *         description: 服务器错误
 */
async function getUsers(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM users_test');
    res.json(rows);
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({ message: '获取用户列表失败' });
  }
}

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: 获取单个用户信息
 *     description: 根据用户ID获取特定用户的详细信息
 *     tags: [用户管理]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 用户ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 成功获取用户信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: 用户ID
 *                 name:
 *                   type: string
 *                   description: 用户名称
 *                 email:
 *                   type: string
 *                   description: 用户邮箱
 *       404:
 *         description: 用户不存在
 *       500:
 *         description: 服务器错误
 */
async function getUserById(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM users_test WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ message: '获取用户信息失败' });
  }
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: 创建新用户
 *     description: 创建一个新的用户记录
 *     tags: [用户管理]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: 用户名称
 *               email:
 *                 type: string
 *                 description: 用户邮箱
 *     responses:
 *       201:
 *         description: 用户创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: 新创建的用户ID
 *                 message:
 *                   type: string
 *                   description: 成功消息
 *       500:
 *         description: 服务器错误
 */
async function createUser(req, res) {
  const { name, email } = req.body;
  const currentDate = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).replace(/\//g, '年').replace(/\s/g, '月') + '日';

  try {
    const [result] = await pool.execute(
      'INSERT INTO users_test (name, email, date, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      [name, email, currentDate, new Date(), new Date()]
    );
    res.status(201).json({ id: result.insertId, message: '用户创建成功' });
  } catch (error) {
    console.error('创建用户失败:', error);
    res.status(500).json({ message: '创建用户失败' });
  }
}

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: 更新用户信息
 *     description: 根据用户ID更新特定用户的信息
 *     tags: [用户管理]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 用户ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: 用户名称
 *               email:
 *                 type: string
 *                 description: 用户邮箱
 *     responses:
 *       200:
 *         description: 用户信息更新成功
 *       404:
 *         description: 用户不存在
 *       500:
 *         description: 服务器错误
 */
async function updateUser(req, res) {
  const { name, email } = req.body;
  try {
    const [result] = await pool.execute(
      'UPDATE users_test SET name = ?, email = ?, updated_at = ? WHERE id = ?',
      [name, email, new Date(), req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json({ message: '用户信息更新成功' });
  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({ message: '更新用户信息失败' });
  }
}

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: 删除用户
 *     description: 根据用户ID删除特定用户
 *     tags: [用户管理]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 用户ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 用户删除成功
 *       404:
 *         description: 用户不存在
 *       500:
 *         description: 服务器错误
 */
async function deleteUser(req, res) {
  try {
    const [result] = await pool.execute('DELETE FROM users_test WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json({ message: '用户删除成功' });
  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({ message: '删除用户失败' });
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};