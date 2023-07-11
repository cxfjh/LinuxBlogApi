// 过滤敏感词
const fs = require('fs');
let harmonious = '';
const legitimate = () => {
    try {
        const data = fs.readFileSync('./public/SensitiveWords.text', 'utf8');
        return harmonious = data.split('\r\n')
    } catch (err) { console.error(err); }
}
legitimate();

module.exports = {
    harmonious,
}