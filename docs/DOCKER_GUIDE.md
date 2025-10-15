# Docker 使用指南

## 🐳 快速启动

### 开发环境（最小化配置）

```bash
# 启动 PostgreSQL 和 Redis
docker-compose -f docker-compose.dev.yml up -d

# 查看服务状态
docker-compose -f docker-compose.dev.yml ps

# 查看日志
docker-compose -f docker-compose.dev.yml logs -f

# 停止服务
docker-compose -f docker-compose.dev.yml down

# 停止并删除数据
docker-compose -f docker-compose.dev.yml down -v
```

### 完整环境（所有服务）

```bash
# 启动所有服务
docker-compose up -d

# 只启动特定服务
docker-compose up -d postgres redis

# 重启服务
docker-compose restart postgres

# 停止服务
docker-compose stop

# 停止并删除容器
docker-compose down

# 停止并删除容器和数据卷
docker-compose down -v
```

## 📊 服务配置

### PostgreSQL
- **容器名**: creatoria_postgres
- **端口**: 5432
- **用户名**: postgres
- **密码**: postgres
- **数据库**: creatoria
- **连接字符串**: `postgresql://postgres:postgres@localhost:5432/creatoria`

### MySQL
- **容器名**: creatoria_mysql
- **端口**: 3306
- **Root 密码**: root
- **用户名**: creatoria
- **密码**: creatoria
- **数据库**: creatoria
- **连接字符串**: `mysql://creatoria:creatoria@localhost:3306/creatoria`

### MongoDB
- **容器名**: creatoria_mongodb
- **端口**: 27017
- **管理员用户**: admin
- **管理员密码**: admin
- **数据库**: creatoria
- **连接字符串**: `mongodb://admin:admin@localhost:27017/creatoria?authSource=admin`

### Redis
- **容器名**: creatoria_redis
- **端口**: 6379
- **密码**: redis_password（完整环境）/ 无密码（开发环境）
- **连接字符串**: `redis://:redis_password@localhost:6379`

### MinIO（对象存储）
- **容器名**: creatoria_minio
- **API 端口**: 9000
- **控制台端口**: 9001
- **访问地址**: http://localhost:9001
- **用户名**: minioadmin
- **密码**: minioadmin

### RabbitMQ（消息队列）
- **容器名**: creatoria_rabbitmq
- **AMQP 端口**: 5672
- **管理界面端口**: 15672
- **管理界面**: http://localhost:15672
- **用户名**: admin
- **密码**: admin

## 🔧 管理工具

### Adminer（数据库管理）
- **地址**: http://localhost:8080
- **支持**: PostgreSQL, MySQL
- **使用方法**:
  1. 访问 http://localhost:8080
  2. 选择数据库类型
  3. 输入连接信息
  4. 登录管理

### RedisInsight（Redis 管理）
- **地址**: http://localhost:8001
- **使用方法**:
  1. 访问 http://localhost:8001
  2. 添加 Redis 数据库
  3. Host: redis 或 localhost
  4. Port: 6379
  5. Password: redis_password（如果有）

## 🎯 常用命令

### 数据库操作

```bash
# 进入 PostgreSQL 容器
docker exec -it creatoria_postgres psql -U postgres -d creatoria

# 进入 MySQL 容器
docker exec -it creatoria_mysql mysql -u root -p

# 进入 MongoDB 容器
docker exec -it creatoria_mongodb mongosh -u admin -p admin

# 进入 Redis 容器
docker exec -it creatoria_redis redis-cli -a redis_password

# 备份 PostgreSQL
docker exec creatoria_postgres pg_dump -U postgres creatoria > backup.sql

# 恢复 PostgreSQL
docker exec -i creatoria_postgres psql -U postgres creatoria < backup.sql

# 备份 MySQL
docker exec creatoria_mysql mysqldump -u root -p creatoria > backup.sql

# 恢复 MySQL
docker exec -i creatoria_mysql mysql -u root -p creatoria < backup.sql
```

### 日志查看

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs postgres

# 实时查看日志
docker-compose logs -f

# 查看最近 100 行日志
docker-compose logs --tail=100
```

### 资源管理

```bash
# 查看容器资源使用情况
docker stats

# 查看磁盘使用情况
docker system df

# 清理未使用的资源
docker system prune -a

# 清理所有停止的容器
docker container prune

# 清理未使用的镜像
docker image prune -a

# 清理未使用的卷
docker volume prune
```

## 🚀 生产部署

### 构建应用镜像

```bash
# 构建镜像
docker build -t creatoria-app:latest .

# 运行应用容器
docker run -d \
  --name creatoria-app \
  -p 3000:3000 \
  --env-file .env \
  --network creatoria_network \
  creatoria-app:latest

# 使用 docker-compose 运行应用
docker-compose -f docker-compose.prod.yml up -d
```

### 生产环境 docker-compose.prod.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: creatoria_app
    restart: always
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      REDIS_HOST: redis
    depends_on:
      - postgres
      - redis
    networks:
      - creatoria_network

  postgres:
    image: postgres:15-alpine
    container_name: creatoria_postgres
    restart: always
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_DATABASE}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - creatoria_network

  redis:
    image: redis:7-alpine
    container_name: creatoria_redis
    restart: always
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - creatoria_network

volumes:
  postgres_data:
  redis_data:

networks:
  creatoria_network:
```

## 🔒 安全建议

### 1. 使用 .env 文件管理敏感信息

```bash
# .env
DB_USERNAME=secure_user
DB_PASSWORD=secure_password
REDIS_PASSWORD=secure_redis_password
```

### 2. 限制端口暴露

生产环境中，只暴露必要的端口：

```yaml
services:
  postgres:
    # 不暴露端口到宿主机
    # ports:
    #   - "5432:5432"
    expose:
      - "5432"
```

### 3. 使用自定义网络

```yaml
networks:
  creatoria_network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

### 4. 设置资源限制

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### 5. 使用 Docker Secrets

```bash
# 创建 secret
echo "my_password" | docker secret create db_password -

# 在 docker-compose 中使用
services:
  postgres:
    secrets:
      - db_password
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password

secrets:
  db_password:
    external: true
```

## 🐛 故障排查

### 容器无法启动

```bash
# 查看容器日志
docker logs creatoria_postgres

# 检查容器状态
docker inspect creatoria_postgres

# 进入容器调试
docker exec -it creatoria_postgres sh
```

### 连接问题

```bash
# 测试网络连通性
docker exec creatoria_app ping postgres

# 查看网络配置
docker network inspect creatoria_network

# 检查端口监听
docker exec creatoria_postgres netstat -tlnp
```

### 性能问题

```bash
# 查看资源使用
docker stats creatoria_postgres

# 查看进程
docker top creatoria_postgres

# 查看日志大小
docker exec creatoria_postgres du -sh /var/log/
```

### 数据恢复

```bash
# 从卷恢复数据
docker run --rm \
  -v creatoria_postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres_backup.tar.gz /data

# 恢复到新卷
docker run --rm \
  -v creatoria_postgres_data_new:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/postgres_backup.tar.gz -C /
```

## 📚 参考资源

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Redis Docker Hub](https://hub.docker.com/_/redis)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)