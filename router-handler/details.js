const query = require('../mysql/index');

// 获取个人详细信息
exports.information = async (req, res) => {
    const { id } = req.query;
    const { authorization } = req.headers;
    const sqlStr = 'select username, email, avatar, essay, fan, concern, beliked from userdata where id = ? and token = ? and destroyed = 0';
    try {
        const personalInfo = await query(sqlStr, [id, authorization])
        if (personalInfo.length === 0) { return res.send({ status: 0, message: '获取信息失败！' }) }
        res.send({ status: 200, message: personalInfo });
    } catch (err) { res.status(500).send({ status: 0, message: err.message }); }
}

// 获取个人的文章
exports.all = async (req, res) => {
    const { id } = req.query;
    const { authorization } = req.headers
    const sqlStr1 = 'select * from userdata where id = ? and token = ? and destroyed = 0';
    const sqlStr2 = 'select * from actionarticles where authorID = ? and privacy != 2 order by id desc';
    try {
        const personalInfo1 = await query(sqlStr1, [id, authorization]);
        if (personalInfo1.length === 0) { return res.send({ status: 0, message: '用户验证不通过！' }) };
        const personalInfo2 = await query(sqlStr2, [id]);
        res.send({ status: 200, message: personalInfo2 });
    } catch (err) { res.status(500).send({ status: 0, message: err.message }); }
}

// 获取个人的点赞文章
exports.individual = async (req, res) => {
    const { id, attribute } = req.query;
    const { authorization } = req.headers;
    let sqlStr;
    switch (attribute) {
        case '0': sqlStr = 'select essayID from likesdata where evaluatorsID = ? and likes = 1 order by str_to_date (likestime, "%Y/%m/%d %H:%i:%s") desc'; break;
        case '1': sqlStr = 'select essayID from collectiondata where evaluatorsID = ? and collection = 1 order by str_to_date (collectiontime, "%Y/%m/%d %H:%i:%s") desc'; break;
        default: sqlStr = 'select essayID from commentsdata where evaluatorsID = ? and comments is not null order by str_to_date (commentstime, "%Y/%m/%d %H:%i:%s") desc';
    }
    const sqlStr1 = 'select * from userdata where id = ? and token = ? and destroyed = 0';
    try {
        const personalInfo1 = await query(sqlStr1, [id, authorization]);
        if (personalInfo1.length === 0) { return res.send({ status: 0, message: '用户验证不通过！' }) };
        let personalInfo2 = await query(sqlStr, [id]);
        personalInfo2 = personalInfo2.map(item => item.essayID).join(',');
        const sqlStr3 = `select * from actionarticles where id in (${personalInfo2}) order by field (id,${personalInfo2})`;
        const personalInfo3 = await query(sqlStr3);
        res.send({ status: 200, message: personalInfo3 });
    } catch (err) { res.status(500).send({ status: 0, message: err.message }); }
}
