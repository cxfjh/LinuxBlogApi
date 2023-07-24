// 邮箱发送验证码配置
const nodemailer = require('nodemailer');

const randomFns = () => {
    let code = "";
    for (let i = 0; i < 6; i++) { code += parseInt(Math.random() * 10) }
    return code
}

const QQMail = 'QQ邮箱';
const QQmailCode = '邮箱授权码';

const captcha = (captchas, mail) => {
    const mailTransport = nodemailer.createTransport({
        host: 'smtp.qq.email',
        service: 'qq',
        secure: true,
        auth: {
            user: QQMail,
            pass: QQmailCode
        }
    })
    const options = {
        from: ' "注册验证码" <' + QQMail + '>',
        to: '<' + mail + '@qq.com>',
        bcc: '密送',
        subject: '【LinuxBlog科技有限公司】',
        text: '',
        html: `<h1>【LinuxBlog科技有限公司】你正在【注册账号】，验证码：${captchas}。您正在使用QQ邮箱验证注册账号，有效期10分钟，请勿泄露。</h1>`
    };
    mailTransport.sendMail(options, (error, info) => { if (error) { console.log(error); } else { res.send(error); } });
}

module.exports = {
    randomFns,
    captcha
}