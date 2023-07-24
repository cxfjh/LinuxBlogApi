const query = require('../mysql/index');
const authorization = require('../public/authorization')
const mailbox = require('../public/mailbox');

// 注册
exports.reguser = async (req, res) => {
    const { username, password, email, captcha, avatar, verify } = req.body;
    const now = new Date().toLocaleString();
    const sqlStr1 = 'select * from captchadata where captchaUser = ? and captchaPassword = ? and captchaEmail = ? and captcha = ? ';
    const sqlStr2 = 'insert into userdata set ?';
    const sqlStr3 = 'delete from captchadata where captchaEmail = ? or captchaUser = ?';
    try {
        const userinfo1 = await query(sqlStr1, [username, password, email, captcha]);
        if (userinfo1.length === 0) { return res.send({ status: 0, message: '账号密码用户名或验证码错误！' }) };
        const userinfo2 = await query(sqlStr2, { username: username, password: password, email: email, avatar: avatar, token: verify, registrationTime: now });
        if (userinfo2.affectedRows !== 1) { return res.send({ status: 0, message: '注册用户失败，请稍后再试！' }) };
        await query(sqlStr3, [email, username]);
        res.send({ status: 200, message: '注册成功！' });
    } catch (err) { res.status(500).send({ status: 0, message: err.message }); }
}

// 注册发送验证码
exports.captcha = async (req, res) => {
    const { username, password, email, avatar } = req.body;
    const now = new Date().toLocaleString();
    const verify = mailbox.randomFns();
    const sqlStr1 = 'select * from userdata where username = ? or email = ?';
    const sqlStr2 = 'insert into captchadata set ?';
    try {
        const userinfo1 = await query(sqlStr1, [username, email]);
        if (userinfo1.length === 1) { return res.send({ status: 0, message: '用户名或账号被占用！' }) };
        const userinfo2 = await query(sqlStr2, { captchaUser: username, captchaPassword: password, captchaEmail: email, captcha: verify, times: now });
        if (userinfo2.affectedRows !== 1) { return res.send({ status: 0, message: '验证码发送失败，请稍后再试！' }) };
        mailbox.captcha(verify, email);
        res.send({ status: 200, message: '验证码发送成功！' });
    } catch (err) { res.status(500).send({ status: 0, message: err.message }); }
}

// 账号登录
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const now = new Date().toLocaleString();
    const sqlStr1 = 'select * from userdata where password = ? and email = ? and destroyed = 0';
    const sqlStr2 = 'update userdata set token = ?, logonTime = ? where email = ? and password = ?';
    const sqlStr3 = 'select id,username from userdata where password = ? and email = ? and destroyed = 0';
    try {
        const userinfo1 = await query(sqlStr1, [password, email]);
        if (userinfo1.length !== 1) { return res.status(401).send({ status: 0, message: '账号或密码错误！' }); }
        const user = { ...userinfo1[0], password: '', avatar: '', token: '' };
        const tokenStr = authorization.generateToken(user, authorization.secret, '168h');
        const userinfo2 = await query(sqlStr2, [tokenStr, now, email, password]);
        if (userinfo2.affectedRows !== 1) { return res.status(500).send({ status: 0, message: '登录失败，请稍后再试！' }); }
        const userinfo3 = await query(sqlStr3, [password, email]);
        if (userinfo3.length !== 1) { return res.status(401).send({ status: 0, message: '账号或密码错误！' }); }
        res.send({ status: 200, message: '登录成功！', token: tokenStr, id_name: userinfo3 });
    } catch (err) { res.status(500).send({ status: 0, message: err.message }); }
}

// 登录与修改密码时发送验证码
exports.sendcaptcha = async (req, res) => {
    const { email } = req.body;
    const now = new Date().toLocaleString();
    const verify = mailbox.randomFns();
    const sqlStr1 = 'select * from userdata where email = ? and destroyed = 0';
    const sqlStr2 = 'insert into captchadata set ?';
    try {
        const userinfo1 = await query(sqlStr1, [email]);
        if (userinfo1.length !== 1) { return res.status(401).send({ status: 0, message: '该账号未注册或被封禁！' }); }
        const userinfo2 = await query(sqlStr2, { captchaEmail: email, captcha: verify, times: now });
        if (userinfo2.affectedRows !== 1) { return res.status(401).send({ status: 0, message: '发送验证码失败，请稍后再试！' }); }
        mailbox.captcha(verify, email);
        res.send({ status: 200, message: '验证码发送成功！' });
    } catch (err) { res.status(500).send({ status: 0, message: err.message }); }
}

// 验证码登录
exports.captchalogin = async (req, res) => {
    const { email, captcha } = req.body;
    const now = new Date().toLocaleString();
    const sqlStr1 = 'select * from userdata where email = ?';
    const sqlStr2 = 'select * from captchadata where captchaEmail = ? and captcha = ? ';
    const sqlStr3 = 'update userdata set token = ?, logonTime = ? where email = ?';
    const sqlStr4 = 'delete from captchadata where captchaEmail = ?';
    try {
        const userinfo1 = await query(sqlStr1, [email]);
        if (userinfo1.length !== 1) { return res.send({ status: 0, message: '该账号未注册！' }) };
        const userinfo2 = await query(sqlStr2, [email, captcha]);
        if (userinfo2.length !== 1) { return res.send({ status: 0, message: '验证码或账号错误！' }) };
        const user = { ...userinfo2[0] };
        const tokenStr = authorization.generateToken(user, authorization.secret, '24h');
        const userinfo3 = await query(sqlStr3, [tokenStr, now, email]);
        if (userinfo3.affectedRows !== 1) { return res.send({ status: 0, message: '登录失败，请稍后再试！' }) };
        await query(sqlStr4, [email]);
        res.send({ status: 200, message: '登录成功！', token: tokenStr })
    } catch (err) { res.status(500).send({ status: 0, message: err.message }); }
}

// 修改密码
exports.revise = async (req, res) => {
    const { password, email, captcha } = req.body;
    const now = new Date().toLocaleString();
    const sqlStr1 = 'select * from userdata where email = ?';
    const sqlStr2 = 'select * from captchadata where captchaEmail = ? and captcha = ? ';
    const sqlStr3 = 'update userdata set password = ?, reviseTime = ? where email = ?';
    const sqlStr4 = 'delete from captchadata where captchaEmail = ?';
    try {
        const userinfo1 = await query(sqlStr1, [email]);
        if (userinfo1.length !== 1) { return res.send({ status: 0, message: '该账号未注册！' }) };
        const userinfo2 = await query(sqlStr2, [email, captcha]);
        if (userinfo2.length !== 1) { return res.send({ status: 0, message: '验证码或账号错误！' }) };
        const userinfo3 = await query(sqlStr3, [password, now, email]);
        if (userinfo3.affectedRows !== 1) { return res.send({ status: 0, message: '修改密码失败，请稍后再试！' }) };
        await query(sqlStr4, [email]);
        res.send({ status: 200, message: '修改密码成功！' })
    } catch (err) { res.status(500).send({ status: 0, message: err.message }); }
}
