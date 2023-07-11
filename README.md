# 使用教程

## 准备工作

- Windows系统
- 已经安装配置好的MySQL客户端

## 操作步骤

1. 打开终端，初始化项目。

   ```bash
   npm install
   ```

2. 修改项目中的mysql目录下的两个文件create.js和index.js，修改的内容必须一致。

   ```javascript
   const MySqlHost = '数据库连接地址';
   const MySqlPassword = '数据库密码';
   const MySqlUser = '数据库账户名';
   const MySqlDatabase = '数据库表名';
   ```

3. 切换目录，创建数据库。

   ```bash
   cd mysql
   node create.js
   ```

4. 修改项目中的public目录下的mailbox.js文件。

   ```javascript
   const QQMail = 'QQ邮箱';
   const QQmailCode = '邮箱授权码';
   ```

5. 启动服务器，如果终端输出“启动服务器成功！”这句话表示启动成功，否则失败。

   ```bash
   cd ..
   node index.js
   ```

## 开源协议

GPL