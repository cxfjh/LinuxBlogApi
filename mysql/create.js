const mysql = require('mysql');

const MySqlHost = '数据库连接地址';
const MySqlPassword = '数据库密码';
const MySqlUser = '数据库账户名';
const MySqlDatabase = '数据库表名';

const db = mysql.createPool({
    host: MySqlHost,
    user: MySqlUser,
    password: MySqlPassword
});

db.query(`create database ${MySqlDatabase}`, (err, result) => {
    if (err) throw err
    console.log('创建数据库成功！')
})

const create = (name, data) => {
    const db = mysql.createPool({
        host: 'localhost',
        user: MySqlUser,
        password: MySqlPassword,
        database: MySqlDatabase,
    });
    const sql = `create table ${name} (${data})`;
    db.query(sql, (error, results) => {
        if (error) { return console.error('Failed to create table:', error); }
        console.log(`创建数据库表${name}成功!`)
    });
}

const userdata = [
    'id int primary key auto_increment unique',
    'username varchar(255) not null unique',
    'password varchar(255) not null',
    'email varchar(255) not null unique',
    'avatar text',
    'token text',
    'essay varchar(255) not null default 0',
    'fan varchar(255) not null default 0',
    'concern varchar(255) not null default 0',
    'beliked varchar(255) not null default 0',
    'registrationTime varchar(255) not null default 0',
    'logonTime varchar(255) not null default 0',
    'reviseTime varchar(255) not null default 0',
    'line varchar(1) not null default 0',
    'offlineTime varchar(255) not null default 0',
    'destroyed varchar(1) not null default 0',
    'destructionTime varchar(255) not null default 0'
]

const likesdata = [
    'id int primary key auto_increment unique',
    'evaluatorsID varchar(255) not null',
    'essayID varchar(255) not null',
    'articleauthorID varchar(255) not null',
    'likes varchar(1) not null default 0',
    'likestime varchar(255) not null default 0'
]

const concerndata = [
    'id int primary key auto_increment unique',
    'evaluatorsID varchar(255) not null',
    'articleauthorID varchar(255) not null',
    'concern varchar(1) not null default 0',
    'concerntime varchar(255) not null default 0'
]

const commentsdata = [
    'id int primary key auto_increment unique',
    'evaluatorsID varchar(255) not null',
    'evaluators varchar(255) not null',
    'essayID varchar(255) not null',
    'articleauthorID varchar(255) not null',
    'comments text not null',
    'commentstime varchar(255) not null default 0',
    'deletecomments varchar(1) not null default 0',
    'deletecommentstime varchar(255) not null default 0'
]

const collectiondata = [
    'id int primary key auto_increment unique',
    'evaluatorsID varchar(255) not null',
    'essayID varchar(255) not null',
    'articleauthorID varchar(255) not null',
    'collection varchar(1) not null default 0',
    'collectiontime varchar(255) not null default 0'
]

const captchadata = [
    'id int primary key auto_increment unique',
    'captchaUser varchar(255)',
    'captchaPassword varchar(255)',
    'captchaEmail varchar(255) not null',
    'captcha varchar(255) not null',
    'times varchar(255) not null'
]

const actionarticles = [
    'id int primary key auto_increment unique',
    'author varchar(255) not null',
    'authorID varchar(255) not null',
    'title varchar(255) not null',
    'content text not null',
    'image text',
    'privacy varchar(255) not null default 0',
    'releasetime varchar(255) not null',
    'likes varchar(255) not null default 0',
    'collection varchar(255) not null default 0',
    'comments varchar(255) not null default 0',
    'revisetime varchar(255) not null default 0',
]

setTimeout(() => {
    const gather = {
        userdata: userdata,
        likesdata: likesdata,
        concerndata: concerndata,
        commentsdata: commentsdata,
        collectiondata: collectiondata,
        captchadata: captchadata,
        actionarticles: actionarticles
    };
    for (let i = 0; i < Object.keys(gather).length; i++) { create(Object.keys(gather)[i], gather[Object.keys(gather)[i]]); };
}, 1000)

