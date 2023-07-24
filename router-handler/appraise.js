const query = require('../mysql/index');

// 评论文章
exports.comments = async (req, res) => {
    const { evaluatorsID, essayID, articleauthorID, comments, evaluators } = req.body;
    const { authorization } = req.headers;
    const now = new Date().toLocaleString();
    const sqlStr1 = 'select * from userdata where id = ? and token = ? and destroyed = 0';
    const sqlStr2 = 'select * from actionarticles where id = ? and privacy = 0';
    const sqlStr3 = 'insert into commentsdata set ?';
    const sqlStr4 = 'select count(*) as count from commentsdata where essayID = ? and deletecomments = 0';
    const sqlStr5 = 'update actionarticles set comments = ? where id = ?';
    try {
        const comments1 = await query(sqlStr1, [evaluatorsID, authorization]);
        if (comments1.length === 0) { return res.send({ status: 0, message: '用户验证不通过！' }) };
        const comments2 = await query(sqlStr2, [essayID]);
        if (comments2.length === 0) { return res.send({ status: 0, message: '找不到该文章！' }) };
        const comments3 = await query(sqlStr3, { evaluators: evaluators, evaluatorsID: evaluatorsID, essayID: essayID, articleauthorID: articleauthorID, comments: comments, commentstime: now })
        if (comments3.affectedRows === 0) { return res.send({ status: 0, message: '发布评论失败！' }) };
        const comments4 = await query(sqlStr4, [essayID]);
        await query(sqlStr5, [comments4[0].count, essayID]);
        res.send({ status: 200, message: '发布评论成功！' });
    } catch (err) { res.status(500).send({ status: 0, message: err.message }); }
}

// 点赞文章
exports.like = async (req, res) => {
    const { evaluatorsID, essayID, articleauthorID, likes } = req.body;
    const { authorization } = req.headers
    const now = new Date().toLocaleString();
    const sqlStr1 = 'select * from userdata where id = ? and token = ? and destroyed = 0';
    const sqlStr2 = 'select * from actionarticles where id = ? and privacy = 0';
    const sqlStr3 = 'select * from likesdata where evaluatorsID = ? and essayID = ? and articleauthorID = ?';
    const sqlStr4 = 'select count(*) as count from likesdata where essayID = ? and likes = 1';
    const sqlStr5 = 'update actionarticles set likes = ? where id = ?';
    const sqlStr6 = 'select count(*) as count from likesdata where articleauthorID = ? and likes = 1';
    const sqlStr7 = 'update userdata set beliked = ? where id = ?';
    const sqlStrA = 'insert into likesdata set ?';
    const sqlStrB = 'update likesdata set likes = ?, likestime = ? where evaluatorsID = ? and essayID = ? and articleauthorID = ?';
    try {
        const likesdata1 = await query(sqlStr1, [evaluatorsID, authorization]);
        if (likesdata1.length === 0) { return res.send({ status: 0, message: '用户验证不通过！' }) };
        const likesdata2 = await query(sqlStr2, [essayID]);
        if (likesdata2.length === 0) { return res.send({ status: 0, message: '找不到该文章！' }) };
        const likesdata3 = await query(sqlStr3, [evaluatorsID, essayID, articleauthorID]);
        if (likesdata3.length === 0) { var likesdata = await query(sqlStrA, { evaluatorsID: evaluatorsID, essayID: essayID, articleauthorID: articleauthorID, likes: 1, likestime: now }); }
        else { var likesdata = await query(sqlStrB, [likes, now, evaluatorsID, essayID, articleauthorID]); }
        if (likesdata.affectedRows === 0) { return res.send({ status: 0, message: '点赞失败！' }) }
        const likesdata4 = await query(sqlStr4, [essayID]);
        await query(sqlStr5, [likesdata4[0].count, essayID]);
        const likesdata6 = await query(sqlStr6, [articleauthorID]);
        await query(sqlStr7, [likesdata6[0].count, articleauthorID]);
        res.send({ status: 200, message: '点赞成功！' });
    } catch (err) { res.status(500).send({ status: 0, message: err.message }); }
}

// 收藏文章
exports.collection = async (req, res) => {
    const { evaluatorsID, essayID, articleauthorID, collection } = req.body;
    const { authorization } = req.headers
    const now = new Date().toLocaleString();
    const sqlStr1 = 'select * from userdata where id = ? and token = ? and destroyed = 0';
    const sqlStr2 = 'select * from actionarticles where id = ? and privacy = 0';
    const sqlStr3 = 'select * from collectiondata where evaluatorsID = ? and essayID = ? and articleauthorID = ?';
    const sqlStr4 = 'select count(*) as count from collectiondata where essayID = ? and collection = 1';
    const sqlStr5 = 'update actionarticles set collection = ? where id = ?';
    const sqlStrA = 'insert into collectiondata set ?';
    const sqlStrB = 'update collectiondata set collection = ?, collectiontime = ? where evaluatorsID = ? and essayID = ? and articleauthorID = ?';
    try {
        const collectiondata1 = await query(sqlStr1, [evaluatorsID, authorization]);
        if (collectiondata1.length === 0) { return res.send({ status: 0, message: '用户验证不通过！' }) };
        const collectiondata2 = await query(sqlStr2, [essayID]);
        if (collectiondata2.length === 0) { return res.send({ status: 0, message: '找不到该文章！' }) };
        const collectiondata3 = await query(sqlStr3, [evaluatorsID, essayID, articleauthorID]);
        if (collectiondata3.length === 0) { var collectiondata = await query(sqlStrA, { evaluatorsID: evaluatorsID, essayID: essayID, articleauthorID: articleauthorID, collection: 1, collectiontime: now }); }
        else { var collectiondata = await query(sqlStrB, [collection, now, evaluatorsID, essayID, articleauthorID]); }
        if (collectiondata.affectedRows === 0) { return res.send({ status: 0, message: '收藏失败！' }) }
        const collectiondata4 = await query(sqlStr4, [essayID]);
        await query(sqlStr5, [collectiondata4[0].count, essayID]);
        res.send({ status: 200, message: '收藏成功！' });
    } catch (err) { res.status(500).send({ status: 0, message: err.message }); }
}

// 关注作者
exports.concern = async (req, res) => {
    const { evaluatorsID, articleauthorID, concern } = req.body;
    const { authorization } = req.headers
    const now = new Date().toLocaleString();
    const sqlStr1 = 'select * from userdata where id = ? and token = ? and destroyed = 0';
    const sqlStr2 = 'select * from userdata where id = ? and destroyed = 0';
    const sqlStr3 = 'select * from concerndata where evaluatorsID = ? and articleauthorID = ?';
    const sqlStr4 = 'select count(*) as count from concerndata where articleauthorID = ? and concern = 1';
    const sqlStr5 = 'update userdata set fan = ? where id = ?';
    const sqlStr6 = 'select count(*) as count from concerndata where evaluatorsID = ? and concern = 1';
    const sqlStr7 = 'update userdata set concern = ? where id = ?';
    const sqlStrA = 'insert into concerndata set ?';
    const sqlStrB = 'update concerndata set concern = ?, concerntime = ? where evaluatorsID = ? and articleauthorID = ?';
    try {
        if (evaluatorsID === articleauthorID) { return res.send({ status: 0, message: '不能关注自己！' }); }
        const concerndata1 = await query(sqlStr1, [evaluatorsID, authorization]);
        if (concerndata1.length === 0) { return res.send({ status: 0, message: '用户验证不通过！' }) };
        const concerndata2 = await query(sqlStr2, [articleauthorID]);
        if (concerndata2.length === 0) { return res.send({ status: 0, message: '找不到该作者！' }) };
        const concerndata3 = await query(sqlStr3, [evaluatorsID, articleauthorID]);
        if (concerndata3.length === 0) { var concerndata = await query(sqlStrA, { evaluatorsID: evaluatorsID, articleauthorID: articleauthorID, concern: 1, concerntime: now }); }
        else { var concerndata = await query(sqlStrB, [concern, now, evaluatorsID, articleauthorID]); }
        if (concerndata.affectedRows === 0) { return res.send({ status: 0, message: '关注失败！' }) }
        const concerndata4 = await query(sqlStr4, [articleauthorID]);
        await query(sqlStr5, [concerndata4[0].count, articleauthorID]);
        const concerndata5 = await query(sqlStr6, [evaluatorsID]);
        await query(sqlStr7, [concerndata5[0].count, evaluatorsID]);
        res.send({ status: 200, message: '关注成功！' });
    } catch (err) { res.status(500).send({ status: 0, message: err.message }); }
}

// 判断是否关注，评论，收藏，点赞
exports.judgment = async (req, res) => {
    const { evaluatorsID, essayID, authorID } = req.query;
    const { authorization } = req.headers;
    const sqlStr1 = 'select * from userdata where id = ? and token = ? and destroyed = 0';
    const sqlStr2 = 'select * from actionarticles where id = ? and authorID = ? and privacy = 0';
    const sqlStr3 = 'select coalesce( (select likes from likesdata where evaluatorsID = ? and essayID = ?), 0) as likes, coalesce((select concern from concerndata where evaluatorsID = ? and articleauthorID = ?), 0) as concern, coalesce((select collection from collectiondata where evaluatorsID = ? and essayID = ?), 0) as collection';
    try {
        const appraise1 = await query(sqlStr1, [evaluatorsID, authorization]);
        if (appraise1.length === 0) { return res.send({ status: 0, message: '用户验证不通过！' }) };
        const appraise2 = await query(sqlStr2, [essayID, authorID]);
        if (appraise2.length === 0) { return res.send({ status: 0, message: '找不到该文章！' }) };
        const appraise3 = await query(sqlStr3, [evaluatorsID, essayID, evaluatorsID, authorID, evaluatorsID, essayID]);
        res.send({ status: 200, message: appraise3 });
    } catch (err) { res.status(500).send({ status: 0, message: err.message }); }
}