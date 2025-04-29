// generate-hash.js
const bcrypt = require('bcrypt'); // 使用 require 因为这是个简单脚本
const saltRounds = 10; // 这是加密的复杂度，10 通常足够了
const plainPassword = 'password123'; // 这是我们模拟的正确密码

bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
  if (err) {
    console.error('生成哈希时出错:', err);
    return;
  }
  console.log('密码 "password123" 的哈希值是:');
  console.log(hash); // 这就是你要复制的哈希值
  console.log('\n请复制上面那一行以 $2b$ 开头的完整哈希值。');
});