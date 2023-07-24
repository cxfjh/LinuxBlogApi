const query = require('../mysql/index');

// 获取全部或单个公共文章
exports.public = async (req, res) => {
    let { essayID, attribute, indexA, indexB } = req.query;
    switch (attribute) {
        case '1': attribute = 'likes'; break;
        case '2': attribute = 'comments'; break;
        default: attribute = 'id';
    }
    let sqlStr = `select * from actionarticles where privacy = 0 order by cast(${attribute} as unsigned) desc, ${attribute} desc limit ${indexA},${indexB}`;
    if (essayID != null) { sqlStr = `select * from actionarticles where privacy = 0 and id = ${essayID} order by id desc limit ${indexA},${indexB}` }
    try {
        const share = await query(sqlStr);
        res.send({ status: 200, message: share });
    } catch (err) { res.status(500).send({ status: 0, message: err.message }); }
}

// 搜索公共文章或用户
exports.search = async (req, res) => {
    const { keyword, classify } = req.query;
    let sqlStr = `select * from actionarticles where privacy = 0 and author like '%${keyword}%'`;
    if (classify == 0) { sqlStr = `select * from actionarticles where privacy = 0 and author like '%${keyword}%' or title like '%${keyword}%' or content like '%${keyword}%'`; }
    try {
        const share = await query(sqlStr);
        res.send({ status: 200, message: share });
    } catch (err) { res.status(500).send({ status: 0, message: err.message }); }
}

// 获取公共文章详细评论
exports.detailed = async (req, res) => {
    const { essayID } = req.query;
    const sqlStr = 'select id, evaluatorsID, evaluators, comments, commentstime from commentsdata where deletecomments = 0 and essayID = ? order by str_to_date (commentstime, "%Y/%m/%d %H:%i:%s") desc';
    try {
        const share = await query(sqlStr, [essayID]);
        res.send({ status: 200, message: share });
    } catch (err) { res.status(500).send({ status: 0, message: err.message }); }
}
