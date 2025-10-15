# Creatoria SaaS 项目规范

## 📋 目录结构规范

```
project-root/
├── src/                      # 源代码目录
│   ├── common/              # 公共模块
│   │   ├── decorators/      # 自定义装饰器
│   │   ├── filters/         # 异常过滤器
│   │   ├── guards/          # 守卫
│   │   ├── interceptors/    # 拦截器
│   │   ├── pipes/           # 管道
│   │   └── utils/           # 工具函数
│   ├── config/              # 配置文件
│   ├── modules/             # 业务模块（内置）
│   ├── database/            # 数据库相关
│   │   ├── migrations/      # 数据库迁移
│   │   └── seeds/           # 种子数据
│   ├── app.module.ts        # 根模块
│   └── main.ts              # 应用入口
├── modules/                 # 动态加载的业务模块
├── test/                    # 测试文件
├── docs/                    # 项目文档
├── docker/                  # Docker 配置
└── scripts/                 # 脚本文件
```

## 🔧 编码规范

### 1. 命名规范

#### 文件命名
- **模块文件**: `*.module.ts`
- **控制器**: `*.controller.ts`
- **服务**: `*.service.ts`
- **实体**: `*.entity.ts`
- **DTO**: `*.dto.ts`
- **接口**: `*.interface.ts`
- **枚举**: `*.enum.ts`
- **常量**: `*.constants.ts`

#### 类命名
```typescript
// 模块
export class UserModule {}

// 控制器
export class UserController {}

// 服务
export class UserService {}

// 实体
export class UserEntity {}

// DTO
export class CreateUserDto {}
export class UpdateUserDto {}

// 枚举
export enum UserRole {}
```

#### 变量命名
```typescript
// 常量：全大写，下划线分隔
const MAX_RETRY_COUNT = 3;

// 变量：camelCase
const userCount = 10;

// 私有属性：前缀下划线
private _status: string;

// 布尔值：is/has/can 前缀
const isActive = true;
const hasPermission = false;
const canEdit = true;
```

### 2. TypeScript 规范

#### 类型定义
```typescript
// 始终使用明确的类型
function getUserById(id: number): Promise<User> {
  // ...
}

// 使用接口定义对象结构
interface UserConfig {
  name: string;
  age: number;
  email?: string; // 可选属性
}

// 避免使用 any
// ❌ 错误
function process(data: any) {}

// ✅ 正确
function process(data: unknown) {}
// 或使用具体类型
function process(data: UserData) {}
```

#### 异步处理
```typescript
// 始终使用 async/await
// ✅ 正确
async function fetchUser(): Promise<User> {
  try {
    const user = await userService.findOne();
    return user;
  } catch (error) {
    throw new Error('Failed to fetch user');
  }
}

// ❌ 避免回调地狱
function fetchUser(callback) {
  userService.findOne((err, user) => {
    if (err) callback(err);
    else callback(null, user);
  });
}
```

### 3. NestJS 最佳实践

#### 依赖注入
```typescript
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {}
}
```

#### 装饰器使用
```typescript
@Controller('users')
@ApiTags('用户管理')
@UseGuards(JwtAuthGuard)
export class UserController {
  @Get(':id')
  @ApiOperation({ summary: '获取用户详情' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }
}
```

#### DTO 验证
```typescript
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @ApiProperty({ description: '用户名' })
  username: string;

  @IsEmail()
  @ApiProperty({ description: '邮箱' })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '描述', required: false })
  description?: string;
}
```

### 4. 数据库规范

#### 实体定义
```typescript
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
```

#### 事务处理
```typescript
async createUserWithProfile(data: CreateUserDto): Promise<User> {
  const queryRunner = this.connection.createQueryRunner();
  
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    const user = await queryRunner.manager.save(UserEntity, data);
    const profile = await queryRunner.manager.save(ProfileEntity, {
      userId: user.id,
      ...data.profile,
    });
    
    await queryRunner.commitTransaction();
    return user;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}
```

### 5. API 规范

#### RESTful 路由
```
GET    /api/users           # 获取用户列表
GET    /api/users/:id       # 获取单个用户
POST   /api/users           # 创建用户
PUT    /api/users/:id       # 更新用户（完整更新）
PATCH  /api/users/:id       # 更新用户（部分更新）
DELETE /api/users/:id       # 删除用户
```

#### 响应格式
```typescript
// 成功响应
{
  "success": true,
  "data": {
    // 实际数据
  },
  "message": "操作成功"
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "用户不存在"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/users/123"
}

// 分页响应
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

#### HTTP 状态码
- `200 OK` - 成功
- `201 Created` - 创建成功
- `204 No Content` - 删除成功
- `400 Bad Request` - 请求参数错误
- `401 Unauthorized` - 未认证
- `403 Forbidden` - 无权限
- `404 Not Found` - 资源不存在
- `409 Conflict` - 资源冲突
- `422 Unprocessable Entity` - 验证失败
- `500 Internal Server Error` - 服务器错误

### 6. 错误处理

#### 自定义异常
```typescript
export class BusinessException extends HttpException {
  constructor(message: string, errorCode: string, statusCode: number = 400) {
    super(
      {
        success: false,
        error: {
          code: errorCode,
          message,
        },
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}

// 使用
throw new BusinessException('用户已存在', 'USER_EXISTS', 409);
```

#### 全局异常过滤器
```typescript
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let message = 'Internal server error';
    
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    response.status(status).json({
      success: false,
      error: {
        message,
        statusCode: status,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

### 7. 日志规范

```typescript
import { Logger } from '@nestjs/common';

export class UserService {
  private readonly logger = new Logger(UserService.name);

  async createUser(data: CreateUserDto) {
    this.logger.log(`Creating user: ${data.username}`);
    
    try {
      const user = await this.userRepository.save(data);
      this.logger.log(`User created successfully: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

### 8. 测试规范

#### 单元测试
```typescript
describe('UserService', () => {
  let service: UserService;
  let repository: Repository<UserEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const expectedUser = { id: '1', username: 'test' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(expectedUser);

      const user = await service.findOne('1');
      expect(user).toEqual(expectedUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });
});
```

#### E2E 测试
```typescript
describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });
});
```

### 9. 安全规范

#### 认证与授权
```typescript
// JWT 认证
@UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile(@Request() req) {
  return req.user;
}

// 角色授权
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Delete(':id')
async delete(@Param('id') id: string) {
  return this.userService.delete(id);
}
```

#### 数据验证
```typescript
// 始终验证输入数据
app.useGlobalPipes(new ValidationPipe({
  whitelist: true, // 移除未定义的属性
  forbidNonWhitelisted: true, // 拒绝未定义的属性
  transform: true, // 自动类型转换
}));
```

#### 敏感信息处理
```typescript
// 不要在响应中返回敏感信息
export class UserEntity {
  @Column()
  @Exclude() // 使用 class-transformer 排除
  password: string;

  @Column()
  @Exclude()
  refreshToken: string;
}

// 使用拦截器处理响应
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UserController {}
```

### 10. 性能优化

#### 查询优化
```typescript
// 使用 select 只查询需要的字段
const users = await this.userRepository
  .createQueryBuilder('user')
  .select(['user.id', 'user.username', 'user.email'])
  .getMany();

// 使用分页
const [items, total] = await this.userRepository.findAndCount({
  skip: (page - 1) * pageSize,
  take: pageSize,
});

// 使用索引
@Entity()
@Index(['email', 'username'])
export class UserEntity {}
```

#### 缓存策略
```typescript
@Injectable()
export class UserService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findOne(id: string): Promise<User> {
    const cacheKey = `user_${id}`;
    
    // 尝试从缓存获取
    const cached = await this.cacheManager.get<User>(cacheKey);
    if (cached) {
      return cached;
    }

    // 从数据库获取
    const user = await this.userRepository.findOne(id);
    
    // 存入缓存
    await this.cacheManager.set(cacheKey, user, 3600); // 1小时
    
    return user;
  }
}
```

## 📝 Git 提交规范

使用约定式提交（Conventional Commits）：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型（type）
- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动
- `perf`: 性能优化
- `ci`: CI/CD 相关

### 示例
```bash
feat(user): add user registration API

- Implement user registration endpoint
- Add email verification
- Add password encryption

Closes #123
```

## 🔍 代码审查清单

- [ ] 代码符合项目编码规范
- [ ] 所有测试通过
- [ ] 新功能有对应的测试
- [ ] 文档已更新
- [ ] 没有引入安全漏洞
- [ ] 性能影响已评估
- [ ] 错误处理完善
- [ ] 日志记录适当
- [ ] 代码可读性良好
- [ ] 没有重复代码

## 📚 参考资源

- [NestJS 官方文档](https://docs.nestjs.com)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs)
- [TypeORM 官方文档](https://typeorm.io)
- [Class Validator](https://github.com/typestack/class-validator)
- [Class Transformer](https://github.com/typestack/class-transformer)