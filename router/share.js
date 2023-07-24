const express = require('express');
const router = express.Router();
const shareHandler = require('../router-handler/share');
const verify = require('../public/joi');

// 获取公共文章
router.get('/public', verify.validateData(verify.public, 0), shareHandler.public);

// 搜索公共文章或用户
router.get('/search', verify.validateData(verify.search, 0), shareHandler.search);

// 获取公共文章详细评论
router.get('/detailed', verify.validateData(verify.detailed, 0), shareHandler.detailed);

module.exports = router
