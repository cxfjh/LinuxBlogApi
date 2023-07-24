const mysql = require('mysql');
const util = require('util');

const MySqlHost = '数据库连接地址';
const MySqlPassword = '数据库密码';
const MySqlUser = '数据库账户名';
const MySqlDatabase = '数据库表名';

const db = mysql.createPool({
    host: MySqlHost,
    user: MySqlUser,
    password: MySqlPassword,
    database: MySqlDatabase,
    connectionLimit: 100,
});
const query = util.promisify(db.query).bind(db);

module.exports = query
