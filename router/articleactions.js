const express = require('express');
const router = express.Router();
const operateHandler = require('../router-handler/articleactions');
const verify = require('../public/joi');

// 发布文章
router.post('/publish', verify.validateData(verify.publish, 1), operateHandler.publish);

// 更改文章（公开，不公开，删除）
router.post('/change', verify.validateData(verify.change, 1), operateHandler.change);

module.exports = router