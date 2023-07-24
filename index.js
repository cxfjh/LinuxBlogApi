// 创建服务器
const express = require('express');
const app = express();

// 托管网站文件
app.use(express.static('./web'));

// 注册日志中间件创建日志文件流
const morgan = require("morgan");
const fs = require("fs");
const requestIp = require('request-ip');
const accessStream = fs.createWriteStream("./log/access.log", { flags: "a" });
app.use(
    morgan(
        (tokens, req, res) => {
            const timestamp = new Date().toLocaleString();
            const method = tokens.method(req, res);
            const url = tokens.url(req, res);
            const status = tokens.status(req, res);
            const responseTime = `${tokens["response-time"](req, res)} ms`;
            const ip = requestIp.getClientIp(req);
            const userAgent = req.get('User-Agent');
            return `[${timestamp}] [${ip}] [${method}] [${url}] [${status}] [${responseTime}] ["${userAgent}"]`;
        },
        {
            stream: accessStream
        }
    )
);

// 解决跨域与解析表单
const cors = require('cors');
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// 验证 token
const authorization = require('./public/authorization')
app.use('/authorization', authorization.verifyToken)

// 注册路由
const userRouter = require('./router/user');
const operateRouter = require('./router/articleactions');
const shareRouter = require('./router/share');
const appraiseRouter = require('./router/appraise');
const detailsRouter = require('./router/details');
app.use('/api', userRouter);
app.use('/authorization', operateRouter);
app.use('/api', shareRouter);
app.use('/authorization', appraiseRouter);
app.use('/authorization', detailsRouter);

// 错误中间件
app.use((err, req, res, next) => { if (err) { res.status(400).send({ error: '发送未知错误！' }); } });

// 启动服务器兼初始化数据库
app.listen(80, () => {
    const query = require('./mysql/index.js');
    query('truncate table captchadata');
    console.log('启动服务器成功！')
})