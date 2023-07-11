const express = require('express');
const router = express.Router();
const userHandler = require('../router-handler/user');
const verify = require('../public/joi');
const limit = require('../public/limit');

// 注册
router.post('/reguser', verify.validateData(verify.enroll, 1), userHandler.reguser);

// 注册发送验证码
router.post('/captcha', verify.validateData(verify.captcha, 1), limit.limitFrequency, userHandler.captcha);

// 账号登录
router.post('/login', verify.validateData(verify.login, 1), userHandler.login);

// 登录与修改密码时发送验证码
router.post('/sendcaptcha', verify.validateData(verify.sendcaptcha, 1), userHandler.sendcaptcha);

// 验证码登录
router.post('/captchalogin', verify.validateData(verify.captchalogin, 1), limit.limitFrequency, userHandler.captchalogin);

// 修改密码
router.post('/revise', verify.validateData(verify.revise, 1), userHandler.revise);

module.exports = router