const express = require('express');
const router = express.Router();
const detailsHandler = require('../router-handler/details');
const verify = require('../public/joi');

// 获取个人详细信息
router.get('/information', verify.validateData(verify.information, 0), detailsHandler.information);

// 获取个人的文章
router.get('/all', verify.validateData(verify.all, 0), detailsHandler.all);

// 获取个人的点赞文章
router.get('/individual', verify.validateData(verify.individual, 0), detailsHandler.individual);

module.exports = router