// MongoDB 初始化脚本
db = db.getSiblingDB('creatoria');

// 创建用户
db.createUser({
  user: 'creatoria',
  pwd: 'creatoria',
  roles: [
    {
      role: 'readWrite',
      db: 'creatoria'
    }
  ]
});

// 创建集合
db.createCollection('users');
db.createCollection('logs');

// 创建索引
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.logs.createIndex({ createdAt: -1 });

// 插入示例数据（可选）
db.users.insertOne({
  username: 'admin',
  email: 'admin@creatoria.com',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
});

print('MongoDB initialization completed');