# API 开发指南

## 📝 API 设计原则

### RESTful 规范

#### 资源命名
- 使用名词而非动词
- 使用复数形式
- 使用连字符分隔多个单词

```
✅ 正确
GET /api/users
GET /api/user-profiles
GET /api/order-items

❌ 错误
GET /api/getUsers
GET /api/user_profile
GET /api/orderItem
```

#### HTTP 方法
| 方法 | 操作 | 示例 | 说明 |
|------|------|------|------|
| GET | 查询 | GET /api/users | 获取用户列表 |
| GET | 查询 | GET /api/users/:id | 获取单个用户 |
| POST | 创建 | POST /api/users | 创建新用户 |
| PUT | 全量更新 | PUT /api/users/:id | 更新用户所有字段 |
| PATCH | 部分更新 | PATCH /api/users/:id | 更新用户部分字段 |
| DELETE | 删除 | DELETE /api/users/:id | 删除用户 |

### 请求格式

#### 查询参数
```typescript
// 分页
GET /api/users?page=1&pageSize=20

// 排序
GET /api/users?sortBy=createdAt&sortOrder=desc

// 筛选
GET /api/users?status=active&role=admin

// 搜索
GET /api/users?search=john

// 字段选择
GET /api/users?fields=id,username,email

// 关联查询
GET /api/users?include=profile,posts
```

#### 请求体
```json
POST /api/users
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "age": 30
  }
}
```

### 响应格式

#### 成功响应

**单个资源**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**资源列表**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid-1",
        "username": "user1"
      },
      {
        "id": "uuid-2",
        "username": "user2"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "pageSize": 20,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**创建成功**
```json
{
  "success": true,
  "data": {
    "id": "new-uuid",
    "username": "new_user"
  },
  "message": "用户创建成功"
}
```

#### 错误响应

**验证错误 (400)**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "验证失败",
    "details": [
      {
        "field": "email",
        "message": "邮箱格式不正确"
      },
      {
        "field": "password",
        "message": "密码至少需要6个字符"
      }
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/users"
}
```

**认证错误 (401)**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "请先登录"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/users/profile"
}
```

**权限错误 (403)**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "您没有权限执行此操作"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/admin/users"
}
```

**资源不存在 (404)**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "用户不存在"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/users/invalid-id"
}
```

**服务器错误 (500)**
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "服务器内部错误，请稍后重试"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/users"
}
```

## 🔐 认证与授权

### JWT 认证流程

#### 1. 登录获取 Token
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600,
    "user": {
      "id": "user-id",
      "username": "john_doe",
      "email": "john@example.com",
      "roles": ["user"]
    }
  }
}
```

#### 2. 使用 Token 访问受保护资源
```http
GET /api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### 3. 刷新 Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "new-access-token",
    "expiresIn": 3600
  }
}
```

### 权限控制

#### 基于角色的访问控制 (RBAC)
```typescript
// 控制器中使用
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('users')
  @Roles('admin', 'super-admin')
  async getUsers() {
    // 只有 admin 和 super-admin 可以访问
  }

  @Delete('users/:id')
  @Roles('super-admin')
  async deleteUser(@Param('id') id: string) {
    // 只有 super-admin 可以删除用户
  }
}
```

#### 基于权限的访问控制
```typescript
@Controller('posts')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PostsController {
  @Post()
  @RequirePermissions('posts.create')
  async create(@Body() dto: CreatePostDto) {
    // 需要 posts.create 权限
  }

  @Put(':id')
  @RequirePermissions('posts.update')
  async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    // 需要 posts.update 权限
  }
}
```

## 📄 Swagger 文档

### 配置 Swagger

```typescript
// src/main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Creatoria API')
  .setDescription('API documentation for Creatoria SaaS platform')
  .setVersion('1.0')
  .addBearerAuth()
  .addTag('auth', '认证相关')
  .addTag('users', '用户管理')
  .addTag('posts', '文章管理')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);
```

### 文档注解

#### 控制器文档
```typescript
@Controller('users')
@ApiTags('用户管理')
@ApiBearerAuth()
export class UserController {
  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: '每页数量' })
  @ApiResponse({ status: 200, description: '成功', type: UserListResponse })
  async findAll(@Query() query: PaginationDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户详情' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponse({ status: 200, description: '成功', type: UserResponse })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: '创建成功', type: UserResponse })
  @ApiResponse({ status: 400, description: '参数错误' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
```

#### DTO 文档
```typescript
export class CreateUserDto {
  @ApiProperty({
    description: '用户名',
    example: 'john_doe',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @Length(3, 20)
  username: string;

  @ApiProperty({
    description: '邮箱',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '密码',
    example: 'Password123!',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: '密码必须包含大小写字母和数字',
  })
  password: string;

  @ApiPropertyOptional({
    description: '用户角色',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
```

#### 响应模型文档
```typescript
export class UserResponse {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 'john_doe' })
  username: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class PaginationMeta {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  pageSize: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}

export class UserListResponse {
  @ApiProperty({ type: [UserResponse] })
  items: UserResponse[];

  @ApiProperty({ type: PaginationMeta })
  pagination: PaginationMeta;
}
```

## 🧪 API 测试

### 使用 cURL 测试

```bash
# 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# 获取用户列表
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"

# 创建用户
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"username":"newuser","email":"new@example.com","password":"password123"}'

# 更新用户
curl -X PATCH http://localhost:3000/api/users/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"email":"updated@example.com"}'

# 删除用户
curl -X DELETE http://localhost:3000/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 使用 HTTPie 测试

```bash
# 安装 HTTPie
pip install httpie

# 登录
http POST localhost:3000/api/auth/login \
  username=admin password=password

# 获取用户列表
http GET localhost:3000/api/users \
  "Authorization: Bearer YOUR_TOKEN"

# 创建用户
http POST localhost:3000/api/users \
  "Authorization: Bearer YOUR_TOKEN" \
  username=newuser email=new@example.com password=password123
```

### Postman 集合

创建 Postman 环境变量：
```json
{
  "name": "Creatoria Dev",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api",
      "enabled": true
    },
    {
      "key": "accessToken",
      "value": "",
      "enabled": true
    }
  ]
}
```

登录请求的 Tests 脚本：
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("accessToken", response.data.accessToken);
}
```

## 📊 API 版本控制

### URL 版本控制
```typescript
// src/main.ts
app.setGlobalPrefix('api/v1');

// 或在控制器级别
@Controller('v1/users')
export class UserV1Controller {}

@Controller('v2/users')
export class UserV2Controller {}
```

### Header 版本控制
```typescript
@Controller('users')
export class UserController {
  @Get()
  @Version('1')
  findAllV1() {
    // v1 实现
  }

  @Get()
  @Version('2')
  findAllV2() {
    // v2 实现
  }
}

// 客户端请求
GET /api/users
Accept-Version: 1.0.0
```

## 🔍 API 监控

### 请求日志
```typescript
@Injectable()
export class ApiLoggerInterceptor implements NestInterceptor {
  private logger = new Logger('API');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap((response) => {
        const duration = Date.now() - now;
        this.logger.log(
          `${method} ${url} - ${duration}ms - Body: ${JSON.stringify(body)} - Response: ${JSON.stringify(response)}`,
        );
      }),
      catchError((error) => {
        const duration = Date.now() - now;
        this.logger.error(
          `${method} ${url} - ${duration}ms - Error: ${error.message}`,
        );
        throw error;
      }),
    );
  }
}
```

### 性能监控
```typescript
@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        
        // 记录慢查询
        if (duration > 1000) {
          const request = context.switchToHttp().getRequest();
          Logger.warn(
            `Slow API: ${request.method} ${request.url} took ${duration}ms`,
          );
        }
      }),
    );
  }
}
```

## 🛡️ API 安全

### 输入验证
```typescript
// 使用 class-validator
export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: '用户名只能包含字母、数字和下划线',
  })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
```

### SQL 注入防护
```typescript
// 使用参数化查询
@Injectable()
export class UserService {
  async findByUsername(username: string) {
    // ✅ 安全
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne();

    // ❌ 危险
    // return this.userRepository
    //   .createQueryBuilder('user')
    //   .where(`user.username = '${username}'`)
    //   .getOne();
  }
}
```

### XSS 防护
```typescript
import { escape } from 'html-escaper';

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'string') {
      return escape(value);
    }
    return value;
  }
}
```

### 速率限制
```typescript
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('api')
@UseGuards(ThrottlerGuard)
export class ApiController {
  @Throttle(5, 60) // 每分钟最多5次请求
  @Post('send-email')
  async sendEmail() {
    // 发送邮件
  }
}
```