const express = require('express');
const router = express.Router();
const appraiseHandler = require('../router-handler/appraise');
const verify = require('../public/joi');

// 评论文章
router.post('/comments', verify.validateData(verify.comments, 1), appraiseHandler.comments);

// 点赞文章
router.post('/like', verify.validateData(verify.like, 1), appraiseHandler.like);

// 点赞文章
router.post('/collection', verify.validateData(verify.collection, 1), appraiseHandler.collection);

// 关注作者
router.post('/concern', verify.validateData(verify.concern, 1), appraiseHandler.concern);

// 关注作者
router.get('/judgment', verify.validateData(verify.judgment, 0), appraiseHandler.judgment);

module.exports = router