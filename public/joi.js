// 数据检验配置
const Joi = require('joi');
const { Mint } = require('mint-filter')
const legitimate = require('./legitimate');
const text = legitimate.harmonious[0].split('\n');

const validateData = (schema, type) => {
    return (req, res, next) => {
        const validation = schema.validate((type != 0) ? (req.body) : (req.query));
        req = validation.value;
        const arr = Object.values(validation.value);
        const str = arr.join(', ');
        const filters = new Mint(text);
        const filteredData = filters.filter(str);
        if (validation.error) {
            return res.status(400).json({ error: '内容格式有误------' + validation.error.details[0].message });
        } else if (filteredData.words.length > 0) {
            return res.status(400).json({ error: ['含有敏感词汇----------'] + [filteredData.words] });
        } else {
            req = validation.value;
            return next();
        }
    };
}

// 注册
const enroll = Joi.object({
    username: Joi.string().regex(/^[\u4e00-\u9fa5a-zA-Z0-9@!.#]{2,16}$/).required(),
    email: Joi.string().regex(/^[1-9][0-9]{4,10}$/).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9@!.#]{6,20}$/).required(),
    captcha: Joi.string().regex(/^[0-9]{2,10}$/).required(),
    avatar: Joi.string().regex(/^[A-Za-z0-9+/=]/).min(0).max(40000)
});

// 注测发送验证码
const captcha = Joi.object({
    username: Joi.string().regex(/^[\u4e00-\u9fa5a-zA-Z0-9@!.#]{2,16}$/).required(),
    email: Joi.string().regex(/^[1-9][0-9]{4,10}$/).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9@!.#]{6,20}$/).required(),
    avatar: Joi.string().regex(/^[A-Za-z0-9+/=]/).min(0).max(40000)
});

// 账号登录
const login = Joi.object({
    email: Joi.string().regex(/^[1-9][0-9]{4,10}$/).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9@!.#]{6,20}$/).required(),
});

// 登录与修改密码时发送验证码
const sendcaptcha = Joi.object({
    email: Joi.string().regex(/^[1-9][0-9]{4,10}$/).required(),
});

// 验证码登录
const captchalogin = Joi.object({
    email: Joi.string().regex(/^[1-9][0-9]{4,10}$/).required(),
    captcha: Joi.string().regex(/^[0-9]{2,10}$/).required(),
});

// 修改密码
const revise = Joi.object({
    email: Joi.string().regex(/^[1-9][0-9]{4,10}$/).required(),
    captcha: Joi.string().regex(/^[0-9]{2,10}$/).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9@!.#]{6,20}$/).required(),
});

// 发布文章
const publish = Joi.object({
    author: Joi.string().regex(/^[\u4e00-\u9fa5a-zA-Z0-9@!.#]{2,16}$/).required(),
    title: Joi.string().min(5).max(300).required(),
    content: Joi.string().min(10).max(10000).required(),
    authorID: Joi.string().regex(/^[0-9]{1,255}$/).required(),
    image: Joi.string().regex(/^[A-Za-z0-9+/=]/).min(0).max(40000),
    privacy: Joi.string().regex(/^[0-1]{1,1}$/).required()
});

// 更改文章（公开，不公开，删除）
const change = Joi.object({
    id: Joi.string().regex(/^[0-9]$/).required(),
    author: Joi.string().regex(/^[\u4e00-\u9fa5a-zA-Z0-9@!.#]{2,16}$/).required(),
    privacy: Joi.string().regex(/^[0-2]{1,1}$/).required()
});

// 获取个人与发布的文章
const all = Joi.object({
    id: Joi.string().regex(/^[0-9]{1,255}$/).required(),
    attribute: Joi.string().regex(/^[0-9]{1,255}$/)
});

// 获取点赞、收藏、评论文章
const individual = Joi.object({
    id: Joi.string().regex(/^[0-9]{1,255}$/).required(),
    attribute: Joi.string().regex(/^[0-2]{1,1}$/).required(),
});

// 获取公共文章
const public = Joi.object({
    essayID: Joi.string().regex(/^[0-9]{1,255}$/),
    attribute: Joi.string().regex(/^[0-2]{1,1}$/).required(),
    indexA: Joi.string().regex(/^[0-9]{1,3}$/).required(),
    indexB: Joi.string().regex(/^[0-9]{1,3}$/).required(),
});

// 搜索公共文章或用户
const search = Joi.object({
    keyword: Joi.string().min(1).max(20),
    classify: Joi.string().regex(/^[0-1]{1,1}$/).required()
});

// 获取公共文章评论内容
const detailed = Joi.object({
    essayID: Joi.string().regex(/^[0-9]{1,255}$/),
    indexA: Joi.string().regex(/^[0-9]{1,3}$/),
    indexB: Joi.string().regex(/^[0-9]{1,3}$/),
});

// 评论文章
const comments = Joi.object({
    essayID: Joi.string().regex(/^[0-9]{1,255}$/).required(),
    evaluators: Joi.string().regex(/^[\u4e00-\u9fa5a-zA-Z0-9@!.#]{2,16}$/).required(),
    evaluatorsID: Joi.string().regex(/^[0-9]{1,255}$/).required(),
    articleauthorID: Joi.string().regex(/^[0-9]{1,255}$/).required(),
    comments: Joi.string().min(1).max(200).required()
});

// 点赞文章
const like = Joi.object({
    evaluatorsID: Joi.string().regex(/^[0-9]{1,255}$/).required(),
    essayID: Joi.string().regex(/^[0-9]{1,255}$/).required(),
    articleauthorID: Joi.string().regex(/^[0-9]{1,255}$/).required(),
    likes: Joi.string().regex(/^[0-1]{1,1}$/).required()
});

// 收藏文章
const collection = Joi.object({
    evaluatorsID: Joi.string().regex(/^[0-9]{1,255}$/).required(),
    essayID: Joi.string().regex(/^[0-9]{1,255}$/).required(),
    articleauthorID: Joi.string().regex(/^[0-9]{1,255}$/).required(),
    collection: Joi.string().regex(/^[0-1]{1,1}$/).required()
});

// 关注作者
const concern = Joi.object({
    evaluatorsID: Joi.string().regex(/^[0-9]{1,255}$/).required(),
    articleauthorID: Joi.string().regex(/^[0-9]{1,255}$/).required(),
    concern: Joi.string().regex(/^[0-1]{1,1}$/).required()
});

// 判断是否关注，评论，收藏，点赞
const judgment = Joi.object({
    essayID: Joi.string().regex(/^[0-9]{1,255}$/).required(),
    evaluatorsID: Joi.string().regex(/^[0-9]{1,255}$/).required(),
    authorID: Joi.string().regex(/^[0-9]{1,255}$/).required(),
});

// 获取个人信息信息
const information = Joi.object({
    id: Joi.string().regex(/^[0-9]{1,255}$/).required(),
});

module.exports = {
    validateData,
    enroll,
    captcha,
    login,
    sendcaptcha,
    captchalogin,
    revise,
    publish,
    change,
    all,
    public,
    search,
    detailed,
    comments,
    like,
    collection,
    concern,
    information,
    judgment,
    individual
}