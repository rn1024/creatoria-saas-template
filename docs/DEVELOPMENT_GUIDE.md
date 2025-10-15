# 开发指南

## 🚀 快速开始

### 1. 环境准备

#### 系统要求
- Node.js >= 18.0.0
- npm >= 9.0.0 或 yarn >= 1.22.0
- Git

#### 数据库（使用 Docker）
```bash
# 启动所需服务
docker-compose up -d

# 或单独启动特定数据库
docker-compose up -d postgres
docker-compose up -d mysql
docker-compose up -d redis
```

### 2. 项目初始化

```bash
# 安装依赖
npm install

# 复制环境变量文件
cp .env.example .env

# 编辑 .env 文件，配置数据库连接
vim .env
```

### 3. 数据库设置

```bash
# 运行数据库迁移
npm run migration:run

# 运行种子数据（可选）
npm run seed:run
```

### 4. 启动项目

```bash
# 开发模式
npm run start:dev

# 生产模式
npm run start:prod

# 调试模式
npm run start:debug
```

项目将运行在 `http://localhost:3000`

### 5. API 文档

Swagger 文档地址：`http://localhost:3000/api-docs`

## 📦 模块管理

### 添加业务模块

```bash
# 添加系统管理模块
saas add system

# 添加 CRM 模块
saas add crm

# 添加多个模块
saas add system --yes
saas add crm --yes
saas add erp --yes
```

### 查看已安装模块

```bash
saas list
```

### 移除模块

```bash
# 移除模块（保留数据）
saas remove crm --keep-data

# 移除模块（删除数据）
saas remove crm
```

## 🛠️ 开发任务

### 创建新的 API 端点

1. **创建 DTO**
```typescript
// src/modules/user/dto/create-user.dto.ts
import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'john_doe' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ description: '邮箱', example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '密码', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}
```

2. **创建服务方法**
```typescript
// src/modules/user/user.service.ts
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }
}
```

3. **创建控制器端点**
```typescript
// src/modules/user/user.controller.ts
@Controller('users')
@ApiTags('用户管理')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }
}
```

### 创建新的实体

```typescript
// src/modules/product/entities/product.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 数据库迁移

```bash
# 生成迁移文件
npm run migration:generate -- -n CreateProductTable

# 运行迁移
npm run migration:run

# 回滚迁移
npm run migration:revert
```

### 添加缓存

```typescript
// src/modules/product/product.service.ts
@Injectable()
export class ProductService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    const cacheKey = 'products_all';
    
    // 尝试从缓存获取
    const cached = await this.cacheManager.get<ProductEntity[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // 从数据库获取
    const products = await this.productRepository.find();
    
    // 缓存 5 分钟
    await this.cacheManager.set(cacheKey, products, 300);
    
    return products;
  }

  async clearCache(): Promise<void> {
    await this.cacheManager.reset();
  }
}
```

### 添加队列任务

```typescript
// src/modules/email/email.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('email')
export class EmailProcessor {
  @Process('send')
  async handleSend(job: Job) {
    console.log('Sending email...');
    const { to, subject, body } = job.data;
    
    // 发送邮件逻辑
    await this.sendEmail(to, subject, body);
    
    return { success: true };
  }

  private async sendEmail(to: string, subject: string, body: string) {
    // 实现邮件发送
  }
}

// src/modules/email/email.service.ts
@Injectable()
export class EmailService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  async sendWelcomeEmail(user: User) {
    await this.emailQueue.add('send', {
      to: user.email,
      subject: 'Welcome!',
      body: `Hello ${user.name}, welcome to our platform!`,
    });
  }
}
```

### WebSocket 实现

```typescript
// src/modules/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ): void {
    // 广播消息给所有客户端
    this.server.emit('message', {
      user: client.id,
      message,
      timestamp: new Date(),
    });
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
```

## 🧪 测试

### 运行测试

```bash
# 单元测试
npm run test

# 监视模式
npm run test:watch

# 测试覆盖率
npm run test:cov

# e2e 测试
npm run test:e2e
```

### 编写单元测试

```typescript
// src/modules/user/user.service.spec.ts
describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        username: 'test',
        email: 'test@example.com',
        password: 'password',
      };

      const user = { id: '1', ...createUserDto };

      jest.spyOn(repository, 'create').mockReturnValue(user as any);
      jest.spyOn(repository, 'save').mockResolvedValue(user as any);

      const result = await service.create(createUserDto);

      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });
});
```

## 📊 监控与日志

### 日志级别

```typescript
// src/main.ts
import { Logger } from '@nestjs/common';

const app = await NestFactory.create(AppModule, {
  logger: ['error', 'warn', 'log', 'debug', 'verbose'],
});

// 在服务中使用
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  async create(dto: CreateUserDto) {
    this.logger.log(`Creating user: ${dto.username}`);
    // ...
    this.logger.debug(`User created with ID: ${user.id}`);
  }
}
```

### 请求日志

```typescript
// src/common/middleware/logger.middleware.ts
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}
```

## 🔒 安全最佳实践

### 1. 环境变量管理
- 永远不要提交 `.env` 文件
- 使用 `.env.example` 作为模板
- 敏感信息使用环境变量

### 2. 密码加密
```typescript
import * as bcrypt from 'bcrypt';

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
```

### 3. 速率限制
```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
})
export class AppModule {}
```

### 4. CORS 配置
```typescript
// src/main.ts
app.enableCors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true,
});
```

### 5. Helmet 安全头
```typescript
import helmet from 'helmet';

app.use(helmet());
```

## 🚢 部署

### Docker 部署

```bash
# 构建镜像
docker build -t my-app .

# 运行容器
docker run -p 3000:3000 --env-file .env my-app
```

### PM2 部署

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start dist/main.js --name my-app

# 查看日志
pm2 logs my-app

# 重启应用
pm2 restart my-app

# 停止应用
pm2 stop my-app
```

### 环境变量配置

生产环境建议使用：
- AWS Secrets Manager
- Azure Key Vault
- HashiCorp Vault
- Kubernetes Secrets

## 🐛 调试技巧

### VS Code 调试配置

`.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Nest Framework",
      "runtimeExecutable": "npm",
      "runtimeArgs": [
        "run",
        "start:debug"
      ],
      "console": "integratedTerminal",
      "restart": true,
      "protocol": "inspector",
      "autoAttachChildProcesses": true
    }
  ]
}
```

### 常见问题排查

1. **数据库连接失败**
   - 检查 `.env` 配置
   - 确认数据库服务运行中
   - 检查防火墙设置

2. **模块导入错误**
   - 检查模块是否正确注册
   - 确认依赖注入正确

3. **性能问题**
   - 使用 `clinic` 进行性能分析
   - 检查数据库查询优化
   - 启用缓存

## 📚 推荐阅读

- [NestJS 官方文档](https://docs.nestjs.com)
- [TypeORM 文档](https://typeorm.io)
- [Docker 最佳实践](https://docs.docker.com/develop/dev-best-practices/)
- [Node.js 最佳实践](https://github.com/goldbergyoni/nodebestpractices)