const query = require('../mysql/index');
const xss = require('xss');

// 发布文章
exports.publish = async (req, res) => {
    const { author, title, content, authorID, image, privacy } = req.body;
    const { authorization } = req.headers
    const now = new Date().toLocaleString();
    const sqlStr1 = 'select * from userdata where id = ? and token = ? and destroyed = 0';
    const sqlStr2 = 'insert into actionarticles set ?';
    const sqlStr3 = 'select count(*) as count from actionarticles where authorID = ? and privacy != 2';
    const sqlStr4 = 'update userdata set essay = ? where id = ?';
    try {
        const articleactions1 = await query(sqlStr1, [authorID, authorization]);
        if (articleactions1.length === 0) { return res.send({ status: 0, message: '用户验证不通过！' }) };
        const articleactions2 = await query(sqlStr2, { author: author, authorID: authorID, title: title, content: content, image: image, privacy: privacy, releasetime: now });
        if (articleactions2.affectedRows === 0) { return res.send({ status: 0, message: '发布失败，请稍后再试！' }) };
        const articleactions3 = await query(sqlStr3, [authorID]);
        await query(sqlStr4, [articleactions3[0].count, authorID]);
        res.send({ status: 200, message: '发布成功！' });
    } catch (err) { res.status(500).send({ status: 0, message: err.message }); }
}

// 更改文章（公开，不公开，删除）
exports.change = async (req, res) => {
    const { id, author, privacy } = req.body;
    const { authorization } = req.headers
    const now = new Date().toLocaleString();
    const sqlStr1 = 'select * from userdata where username = ? and token = ? and destroyed = 0';
    const sqlStr2 = 'select * from actionarticles where id = ? and author = ? and privacy != 2';
    const sqlStr3 = 'update actionarticles set privacy = ?, revisetime = ? where id = ? and author = ?';
    const sqlStr4 = 'select count(*) as count from actionarticles where author = ? and privacy != 2';
    const sqlStr5 = 'update userdata set essay = ? where username = ?';
    try {
        const articleactions1 = await query(sqlStr1, [author, authorization]);
        if (articleactions1.length === 0) { return res.send({ status: 0, message: '用户验证不通过！' }) };
        const articleactions2 = await query(sqlStr2, [id, author]);
        if (articleactions2.length === 0) { return res.send({ status: 0, message: '找不到该文章！' }) };
        await query(sqlStr3, [privacy, now, id, author]);
        const articleactions4 = await query(sqlStr4, [author]);
        await query(sqlStr5, [articleactions4[0].count, author]);
        res.send({ status: 200, message: '修改成功！' });
    } catch (err) { res.status(500).send({ status: 0, message: err.message }); }
}