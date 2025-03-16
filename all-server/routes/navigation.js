/**
 * @fileoverview
 * 导航站点相关的路由配置
 * 
 * 该文件定义了导航站点模块的所有API路由，包括：
 * - 获取导航站点列表
 * - 获取单个导航站点信息
 * - 创建新导航站点
 * - 更新导航站点信息
 * - 删除导航站点
 * 
 * @author xieyuqiyu
 * @version 1.0.0
 * @date 2025-01-06
 */

const express = require('express');
const router = express.Router();
const navigationController = require('../controllers/navigationController');

/**
 * @swagger
 * /api/navigation/upload:
 *   post:
 *     summary: 上传SVG图片
 *     tags: [Navigation]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 要上传的SVG文件
 *     responses:
 *       201:
 *         description: SVG文件上传成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: SVG文件上传成功
 *                 file:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                       example: 1234567890-logo.svg
 *                     path:
 *                       type: string
 *                       example: /uploads/svg/1234567890-logo.svg
 *                     size:
 *                       type: number
 *                       example: 1024
 *       400:
 *         description: 无效的请求或文件格式
 *       500:
 *         description: 服务器错误
 */
router.post('/upload', navigationController.upload.single('file'), navigationController.uploadSvg);

/**
 * @swagger
 * /api/navigation:
 *   get:
 *     summary: 获取所有导航站点
 *     tags: [Navigation]
 *     responses:
 *       200:
 *         description: 成功获取导航站点列表
 */
router.get('/', navigationController.getNavigationSites);

/**
 * @swagger
 * /api/navigation/{id}:
 *   get:
 *     summary: 获取单个导航站点
 *     tags: [Navigation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 导航站点ID
 *     responses:
 *       200:
 *         description: 成功获取导航站点信息
 */
router.get('/:id', navigationController.getNavigationSiteById);

/**
 * @swagger
 * /api/navigation:
 *   post:
 *     summary: 创建新导航站点
 *     tags: [Navigation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - logo
 *               - url
 *               - name
 *             properties:
 *               logo:
 *                 type: string
 *                 description: SVG文件路径，必须以/uploads/svg/开头并以.svg结尾
 *               url:
 *                 type: string
 *                 description: 网站URL
 *               name:
 *                 type: string
 *                 description: 网站名称
 *               description:
 *                 type: string
 *                 description: 网站描述
 *     responses:
 *       201:
 *         description: 成功创建导航站点
 */
router.post('/', navigationController.createNavigationSite);

/**
 * @swagger
 * /api/navigation/{id}:
 *   put:
 *     summary: 更新导航站点信息
 *     tags: [Navigation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 导航站点ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *                 description: SVG文件路径，必须以/uploads/svg/开头并以.svg结尾
 *               url:
 *                 type: string
 *                 description: 网站URL
 *               name:
 *                 type: string
 *                 description: 网站名称
 *               description:
 *                 type: string
 *                 description: 网站描述
 *     responses:
 *       200:
 *         description: 成功更新导航站点信息
 */
router.put('/:id', navigationController.updateNavigationSite);

/**
 * @swagger
 * /api/navigation/{id}:
 *   delete:
 *     summary: 删除导航站点
 *     tags: [Navigation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 导航站点ID
 *     responses:
 *       200:
 *         description: 成功删除导航站点
 */
router.delete('/:id', navigationController.deleteNavigationSite);

module.exports = router;