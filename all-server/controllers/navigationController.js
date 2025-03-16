/**
 * @fileoverview
 * 导航站点相关的控制器
 * 
 * 该文件实现了导航站点模块的所有业务逻辑，包括：
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

const pool = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 配置multer存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads/svg');
    // 确保目录存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const originalName = path.parse(file.originalname).name;
    cb(null, `${timestamp}-${originalName}.svg`);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/svg+xml') {
    cb(null, true);
  } else {
    cb(new Error('只允许上传SVG文件'), false);
  }
};

// 配置上传中间件
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制文件大小为5MB
  }
});

// 获取所有导航站点
async function getNavigationSites(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM navigation_sites');
    res.json(rows);
  } catch (error) {
    console.error('获取导航站点列表失败:', error);
    res.status(500).json({ message: '获取导航站点列表失败' });
  }
}

// 获取单个导航站点
async function getNavigationSiteById(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM navigation_sites WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: '导航站点不存在' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('获取导航站点失败:', error);
    res.status(500).json({ message: '获取导航站点失败' });
  }
}

// 创建新导航站点
async function createNavigationSite(req, res) {
  const { logo, url, name, description } = req.body;

  // 验证必填字段
  if (!logo || !url || !name) {
    return res.status(400).json({ message: 'logo、url和name为必填字段' });
  }

  try {
    // 检查必填字段
    if (!logo || !url || !name) {
      return res.status(400).json({ message: 'logo、url和name为必填字段' });
    }

    // 验证logo路径格式
    if (!logo.startsWith('/uploads/svg/') || !logo.endsWith('.svg')) {
      return res.status(400).json({ message: 'logo必须是有效的SVG文件路径' });
    }

    // 插入新记录
    const [result] = await pool.query(
      'INSERT INTO navigation_sites (logo, url, name, description) VALUES (?, ?, ?, ?)',
      [logo, url, name, description]
    );

    res.status(201).json({
      id: result.insertId,
      logo,
      url,
      name,
      description
    });
  } catch (error) {
    console.error('创建导航站点失败:', error);
    res.status(500).json({ message: '创建导航站点失败' });
  }
}

// 更新导航站点信息
async function updateNavigationSite(req, res) {
  const { logo, url, name, description } = req.body;
  const id = req.params.id;

  try {
    // 检查站点是否存在
    const [existing] = await pool.query('SELECT * FROM navigation_sites WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: '导航站点不存在' });
    }



    // 验证logo路径格式（如果提供了新logo）
    if (logo && (!logo.startsWith('/uploads/svg/') || !logo.endsWith('.svg'))) {
      return res.status(400).json({ message: 'logo必须是有效的SVG文件路径' });
    }

    // 构建更新语句
    const updates = [];
    const values = [];
    if (logo) {
      updates.push('logo = ?');
      values.push(logo);
    }
    if (url) {
      updates.push('url = ?');
      values.push(url);
    }
    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: '没有提供要更新的字段' });
    }

    values.push(id);
    const [result] = await pool.query(
      `UPDATE navigation_sites SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '更新失败，导航站点不存在' });
    }

    // 获取更新后的记录
    const [updated] = await pool.query('SELECT * FROM navigation_sites WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('更新导航站点失败:', error);
    res.status(500).json({ message: '更新导航站点失败' });
  }
}

// 删除导航站点
async function deleteNavigationSite(req, res) {
  try {
    const [result] = await pool.query('DELETE FROM navigation_sites WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '导航站点不存在' });
    }
    res.json({ message: '导航站点删除成功' });
  } catch (error) {
    console.error('删除导航站点失败:', error);
    res.status(500).json({ message: '删除导航站点失败' });
  }
}

// 上传SVG图片
async function uploadSvg(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '请选择要上传的SVG文件' });
    }

    // 读取上传的文件内容
    const fileContent = fs.readFileSync(req.file.path, 'utf8');

    // 验证SVG内容
    if (!fileContent.trim().startsWith('<svg') || !fileContent.trim().endsWith('</svg>')) {
      // 删除无效文件
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: '无效的SVG文件格式' });
    }

    // 返回文件信息
    res.status(201).json({
      message: 'SVG文件上传成功',
      file: {
        filename: req.file.filename,
        path: `/uploads/svg/${req.file.filename}`,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('上传SVG文件失败:', error);
    // 如果上传过程中出错，尝试删除已上传的文件
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('删除失败的上传文件时出错:', unlinkError);
      }
    }
    res.status(500).json({ message: '上传SVG文件失败' });
  }
}

module.exports = {
  getNavigationSites,
  getNavigationSiteById,
  createNavigationSite,
  updateNavigationSite,
  deleteNavigationSite,
  upload,
  uploadSvg
};