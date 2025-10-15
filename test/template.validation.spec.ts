import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

describe('Template Validation', () => {
  const templateDir = path.join(__dirname, '..');
  
  describe('Template Structure', () => {
    it('should have all required base directories', () => {
      const requiredDirs = [
        'src',
        'src/database',
        'src/system',
        'src/system/entities',
        'src/system/services',
        'src/system/controllers',
        'src/system/dto',
        'test',
      ];

      requiredDirs.forEach(dir => {
        const fullPath = path.join(templateDir, dir);
        expect(fs.existsSync(fullPath)).toBe(true);
      });
    });

    it('should have all required configuration files', () => {
      const requiredFiles = [
        'package.json',
        'tsconfig.json',
        'tsconfig.build.json',
        'nest-cli.json',
        '.env.example',
        '.gitignore',
        '.eslintrc.js',
        '.prettierrc',
      ];

      requiredFiles.forEach(file => {
        const fullPath = path.join(templateDir, file);
        expect(fs.existsSync(fullPath)).toBe(true);
      });
    });

    it('should have valid package.json with Creatoria metadata', () => {
      const packageJsonPath = path.join(templateDir, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

      expect(packageJson).toHaveProperty('creatoria');
      expect(packageJson.creatoria).toHaveProperty('version');
      expect(packageJson.creatoria).toHaveProperty('template');
      expect(packageJson.creatoria).toHaveProperty('modules');
      expect(Array.isArray(packageJson.creatoria.modules)).toBe(true);
    });
  });

  describe('Handlebars Templates', () => {
    it('should compile all .hbs templates without errors', () => {
      const findHbsFiles = (dir: string): string[] => {
        const files: string[] = [];
        const items = fs.readdirSync(dir);

        items.forEach(item => {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            files.push(...findHbsFiles(fullPath));
          } else if (item.endsWith('.hbs')) {
            files.push(fullPath);
          }
        });

        return files;
      };

      const hbsFiles = findHbsFiles(templateDir);
      
      hbsFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        expect(() => Handlebars.compile(content)).not.toThrow();
      });
    });

    it('should have correct placeholders in templates', () => {
      const expectedPlaceholders = [
        '{{projectName}}',
        '{{projectDescription}}',
        '{{authorName}}',
        '{{authorEmail}}',
        '{{createdAt}}',
      ];

      const checkPlaceholders = (filePath: string) => {
        if (filePath.endsWith('.hbs')) {
          const content = fs.readFileSync(filePath, 'utf-8');
          const template = Handlebars.compile(content);
          
          const testData = {
            projectName: 'test-project',
            projectDescription: 'Test Description',
            authorName: 'Test Author',
            authorEmail: 'test@example.com',
            createdAt: new Date().toISOString(),
          };

          const result = template(testData);
          
          // Check that placeholders are replaced
          expectedPlaceholders.forEach(placeholder => {
            if (content.includes(placeholder)) {
              expect(result).not.toContain(placeholder);
            }
          });
        }
      };

      const packageJsonPath = path.join(templateDir, 'package.json');
      if (fs.existsSync(packageJsonPath + '.hbs')) {
        checkPlaceholders(packageJsonPath + '.hbs');
      }
    });
  });

  describe('Database Configuration', () => {
    it('should have database module with autoLoadEntities', () => {
      const dbModulePath = path.join(templateDir, 'src/database/database.module.ts');
      
      if (fs.existsSync(dbModulePath)) {
        const content = fs.readFileSync(dbModulePath, 'utf-8');
        expect(content).toContain('autoLoadEntities');
        expect(content).toContain('TypeOrmModule.forRootAsync');
      } else if (fs.existsSync(dbModulePath + '.hbs')) {
        const content = fs.readFileSync(dbModulePath + '.hbs', 'utf-8');
        expect(content).toContain('autoLoadEntities');
        expect(content).toContain('TypeOrmModule.forRootAsync');
      }
    });

    it('should have proper environment variables in .env.example', () => {
      const envPath = path.join(templateDir, '.env.example');
      const content = fs.readFileSync(envPath, 'utf-8');

      const requiredVars = [
        'DB_HOST',
        'DB_PORT',
        'DB_USERNAME',
        'DB_PASSWORD',
        'DB_DATABASE',
        'JWT_SECRET',
        'JWT_EXPIRES_IN',
        'APP_PORT',
      ];

      requiredVars.forEach(varName => {
        expect(content).toContain(varName);
      });
    });
  });

  describe('System Module', () => {
    it('should have complete user entity', () => {
      const userEntityPath = path.join(templateDir, 'src/system/entities/user.entity.ts');
      
      if (fs.existsSync(userEntityPath)) {
        const content = fs.readFileSync(userEntityPath, 'utf-8');
        
        // Check for required decorators and fields
        expect(content).toContain('@Entity');
        expect(content).toContain('@PrimaryGeneratedColumn');
        expect(content).toContain('username');
        expect(content).toContain('email');
        expect(content).toContain('password');
        expect(content).toContain('@CreateDateColumn');
        expect(content).toContain('@UpdateDateColumn');
      }
    });

    it('should have user service with CRUD operations', () => {
      const userServicePath = path.join(templateDir, 'src/system/services/user.service.ts');
      
      if (fs.existsSync(userServicePath)) {
        const content = fs.readFileSync(userServicePath, 'utf-8');
        
        // Check for CRUD methods
        expect(content).toContain('create');
        expect(content).toContain('findAll');
        expect(content).toContain('findOne');
        expect(content).toContain('update');
        expect(content).toContain('remove');
        expect(content).toContain('Repository');
      }
    });

    it('should have user controller with proper endpoints', () => {
      const userControllerPath = path.join(templateDir, 'src/system/controllers/user.controller.ts');
      
      if (fs.existsSync(userControllerPath)) {
        const content = fs.readFileSync(userControllerPath, 'utf-8');
        
        // Check for REST endpoints
        expect(content).toContain('@Controller');
        expect(content).toContain('@Get');
        expect(content).toContain('@Post');
        expect(content).toContain('@Put');
        expect(content).toContain('@Delete');
        expect(content).toContain('@Param');
        expect(content).toContain('@Body');
      }
    });

    it('should have DTOs with validation', () => {
      const createDtoPath = path.join(templateDir, 'src/system/dto/create-user.dto.ts');
      const updateDtoPath = path.join(templateDir, 'src/system/dto/update-user.dto.ts');
      
      if (fs.existsSync(createDtoPath)) {
        const content = fs.readFileSync(createDtoPath, 'utf-8');
        expect(content).toContain('class-validator');
        expect(content).toContain('@IsString');
        expect(content).toContain('@IsEmail');
      }

      if (fs.existsSync(updateDtoPath)) {
        const content = fs.readFileSync(updateDtoPath, 'utf-8');
        expect(content).toContain('PartialType');
      }
    });
  });

  describe('Build Configuration', () => {
    it('should have valid TypeScript configuration', () => {
      const tsconfigPath = path.join(templateDir, 'tsconfig.json');
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

      expect(tsconfig.compilerOptions).toBeDefined();
      expect(tsconfig.compilerOptions.module).toBe('commonjs');
      expect(tsconfig.compilerOptions.target).toBeDefined();
      expect(tsconfig.compilerOptions.experimentalDecorators).toBe(true);
      expect(tsconfig.compilerOptions.emitDecoratorMetadata).toBe(true);
    });

    it('should have NestJS CLI configuration', () => {
      const nestCliPath = path.join(templateDir, 'nest-cli.json');
      const nestCli = JSON.parse(fs.readFileSync(nestCliPath, 'utf-8'));

      expect(nestCli.type).toBe('application');
      expect(nestCli.sourceRoot).toBe('src');
      expect(nestCli.compilerOptions).toBeDefined();
    });

    it('should have test configuration', () => {
      const packageJsonPath = path.join(templateDir, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

      expect(packageJson.jest).toBeDefined();
      expect(packageJson.jest.moduleFileExtensions).toContain('ts');
      expect(packageJson.jest.transform).toBeDefined();
      expect(packageJson.jest.testEnvironment).toBe('node');
    });
  });

  describe('Dependencies', () => {
    it('should have all required NestJS dependencies', () => {
      const packageJsonPath = path.join(templateDir, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

      const requiredDeps = [
        '@nestjs/common',
        '@nestjs/core',
        '@nestjs/platform-express',
        '@nestjs/config',
        '@nestjs/typeorm',
        'typeorm',
        'pg',
        'class-validator',
        'class-transformer',
      ];

      requiredDeps.forEach(dep => {
        expect(packageJson.dependencies).toHaveProperty(dep);
      });
    });

    it('should have compatible dependency versions', () => {
      const packageJsonPath = path.join(templateDir, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

      // Check NestJS version compatibility
      const nestVersion = packageJson.dependencies['@nestjs/core'];
      const majorVersion = parseInt(nestVersion.replace(/[\^~]/, '').split('.')[0]);
      
      expect(majorVersion).toBeGreaterThanOrEqual(10);
      
      // All NestJS packages should have same major version
      Object.keys(packageJson.dependencies).forEach(dep => {
        if (dep.startsWith('@nestjs/')) {
          const depVersion = packageJson.dependencies[dep];
          const depMajor = parseInt(depVersion.replace(/[\^~]/, '').split('.')[0]);
          expect(depMajor).toBe(majorVersion);
        }
      });
    });
  });
});