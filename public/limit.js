// 限制用户访问频率
const ipMap = new Map();
const limitFrequency = (req, res, next) => {
    const limit = 10;
    const clientIP = req.ip;
    const now = Date.now();
    if (!ipMap.has(clientIP)) {
        ipMap.set(clientIP, [{ time: now, count: 1 }]);
        next();
        return;
    }
    const record = ipMap.get(clientIP);
    while (record.length > 0 && now - record[0].time > 60000) { record.shift(); }
    const count = record.reduce((total, item) => total + item.count, 0);
    if (count >= limit) {
        res.status(429).send("访问频率过高，请休息一下吧!");
    } else {
        record.push({ time: now, count: 1 });
        ipMap.set(clientIP, record);
        next();
    }
};

module.exports = {
    limitFrequency
}