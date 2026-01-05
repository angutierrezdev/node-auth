# Clean Architecture Quick Reference

## ✅ Compliance Checklist

Use this checklist to maintain clean architecture in your codebase:

### Presentation Layer Rules
- [ ] No imports from `data/` directory
- [ ] No imports from `infrastructure/datasources`
- [ ] No imports from `infrastructure/repositories`
- [ ] Only imports from `domain/` and `infrastructure/di`
- [ ] Uses `Container.get*()` for all services
- [ ] Controllers depend on repositories (via DI)
- [ ] Middleware depends on services (via constructor)

### Domain Layer Rules
- [ ] No framework-specific imports (Express, MongoDB, etc.)
- [ ] No imports from `data/`, `infrastructure/`, or `presentation/`
- [ ] Pure TypeScript/JavaScript only
- [ ] Entities are plain classes/interfaces
- [ ] Use cases contain business logic
- [ ] Repositories, Services are abstractions (abstract classes)
- [ ] DTOs validate input data
- [ ] Errors are custom domain errors

### Infrastructure Layer Rules
- [ ] Can import from `domain/` and `data/`
- [ ] Implements domain abstractions
- [ ] Container manages all instantiation
- [ ] Services provide domain abstractions
- [ ] Mappers convert between data models and entities
- [ ] Can use external frameworks/libraries

### Data Layer Rules
- [ ] Only direct database access here
- [ ] Only `infrastructure/` imports this
- [ ] No business logic in models
- [ ] No imports from domain or presentation

---

## File Location Guide

```
PRESENTATION LAYER FILES:
✅ src/presentation/server.ts
✅ src/presentation/routes.ts
✅ src/presentation/auth/controller.ts
✅ src/presentation/auth/routes.ts
✅ src/presentation/middleware/auth.middleware.ts

DOMAIN LAYER FILES:
✅ src/domain/entities/*.ts
✅ src/domain/dtos/*.ts
✅ src/domain/repositories/*.ts (abstractions only)
✅ src/domain/datasources/*.ts (abstractions only)
✅ src/domain/services/*.ts (abstractions only)
✅ src/domain/use-cases/*.ts
✅ src/domain/errors/*.ts

INFRASTRUCTURE LAYER FILES:
✅ src/infrastructure/di/container.ts
✅ src/infrastructure/repositories/*.impl.ts
✅ src/infrastructure/datasources/*.impl.ts
✅ src/infrastructure/services/*.impl.ts
✅ src/infrastructure/mappers/*.ts

DATA LAYER FILES:
✅ src/data/mongodb/models/*.ts
✅ src/data/postgresql/models/*.ts (if added)

CONFIG LAYER FILES:
✅ src/config/*.ts (configurations, adapters)
✅ src/app.ts (entry point - initializes Container)
```

---

## Import Patterns

### ❌ WRONG Imports (Will Violate Clean Architecture)

```typescript
// In Presentation Layer - DON'T DO THIS
import { UserModel } from "../../data/mongodb";  // ❌ Wrong
import { AuthMongoDatasourceImpl } from "../../infrastructure";  // ❌ Wrong
new AuthRepositoryImpl(datasource);  // ❌ Wrong
```

### ✅ CORRECT Imports

```typescript
// In Presentation Layer - DO THIS
import { Container } from "../../infrastructure";  // ✅ Correct
import { AuthRepository, UserService } from "../../domain";  // ✅ Correct

const authRepository = Container.getAuthRepository();  // ✅ Correct
const userService = Container.getUserService();  // ✅ Correct
```

---

## Adding New Features

### Step-by-step guide for adding a new feature:

#### 1. Define Domain Entities & DTOs
```typescript
// src/domain/entities/product.entity.ts
export class ProductEntity {
  constructor(public id: string, public name: string) {}
}

// src/domain/dtos/create-product.dto.ts
export class CreateProductDto { ... }
```

#### 2. Define Domain Abstractions
```typescript
// src/domain/repositories/product.repository.ts
export abstract class ProductRepository {
  abstract create(dto: CreateProductDto): Promise<ProductEntity>;
}

// src/domain/services/product.service.ts (if needed)
export abstract class ProductService {
  abstract findById(id: string): Promise<ProductEntity | null>;
}
```

#### 3. Create Use Cases
```typescript
// src/domain/use-cases/product/create-product.use-case.ts
export class CreateProduct implements UseCase<CreateProductDto, ProductEntity> {
  constructor(private readonly repository: ProductRepository) {}
  
  execute(dto: CreateProductDto): Promise<ProductEntity> {
    // Business logic here
  }
}
```

#### 4. Implement Infrastructure
```typescript
// src/infrastructure/repositories/product.repository.impl.ts
export class ProductRepositoryImpl extends ProductRepository {
  constructor(private readonly datasource: ProductDatasource) {}
  // Implementation
}

// src/infrastructure/datasources/product.datasource.impl.ts
export class ProductDatasourceImpl extends ProductDatasource {
  // MongoDB operations
}

// src/infrastructure/services/product.service.impl.ts
export class ProductServiceImpl extends ProductService {
  // Implementation
}
```

#### 5. Register in Container
```typescript
// src/infrastructure/di/container.ts
static productRepository: ProductRepository;
static productService: ProductService;

static initialize(): void {
  // ... existing code
  const productDatasource = new ProductDatasourceImpl();
  this.productRepository = new ProductRepositoryImpl(productDatasource);
  this.productService = new ProductServiceImpl();
}

static getProductRepository(): ProductRepository { ... }
static getProductService(): ProductService { ... }
```

#### 6. Create Presentation Layer
```typescript
// src/presentation/product/controller.ts
export class ProductController {
  constructor(private readonly repository: ProductRepository) {}
  
  create = (req: Request, res: Response) => {
    const { error, dto } = CreateProductDto.create(req.body);
    if (error) return res.status(400).json({ error });
    
    new CreateProduct(this.repository)
      .execute(dto!)
      .then(product => res.status(201).json(product))
      .catch(error => /* handle error */);
  };
}

// src/presentation/product/routes.ts
export class ProductRoutes {
  static get routes(): Router {
    const repository = Container.getProductRepository();
    const controller = new ProductController(repository);
    
    const router = Router();
    router.post("/", controller.create);
    return router;
  }
}
```

---

## Testing with Clean Architecture

### ✅ Easy to Test

```typescript
// Mock the abstraction
class MockUserService extends UserService {
  async findById(id: string): Promise<UserEntity | null> {
    return new UserEntity("1", "Test User", "test@test.com", "hash", ["user"]);
  }
}

// Inject the mock
const mockUserService = new MockUserService();
const authMiddleware = new AuthMiddleware(mockUserService);

// Test
const req = {} as Request;
const res = {} as Response;
await authMiddleware.validateJWT(req, res, () => {});
// Assert...
```

### Without Clean Architecture
```typescript
// Can't test - UserModel is hardcoded
// Can't mock - it's a static import
// Must use real MongoDB database in tests
```

---

## Container Initialization

### When to Initialize

```typescript
// src/app.ts - Only place Container.initialize() is called

async function main() {
  await MongoDatabase.connect({...});
  
  Container.initialize();  // ⭐ Initialize once at startup
  
  new Server({...}).start();
}
```

### What Happens

```
1. Container.initialize() called
   │
   ├─ new AuthMongoDatasourceImpl()
   ├─ new AuthRepositoryImpl(datasource)
   ├─ new UserServiceImpl()
   └─ Stores as singletons
   
2. First request arrives
   │
   └─ Container.getAuthRepository()  // Returns singleton
   
3. All subsequent requests
   │
   └─ Container.get*()  // Reuses same singletons
```

---

## Common Mistakes to Avoid

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| `import { UserModel }` in presentation | `import { UserService }` from domain |
| `new AuthRepositoryImpl()` in routes | `Container.getAuthRepository()` |
| `UserModel.findById()` in middleware | `userService.findById()` |
| Static middleware methods | Instance methods with DI |
| Direct datasource imports in controller | Repository from Container |
| Business logic in controllers | Use Cases with business logic |
| No abstraction for services | Abstract classes in domain |

---

## Validation Commands

Run these to ensure compliance:

```bash
# Check for data layer imports in presentation
grep -r "from.*data/" src/presentation/
# Should return: (no matches)

# Check for infrastructure direct imports in presentation
grep -r "from.*infrastructure" src/presentation/
# Should only show: "from ...infrastructure/di"

# Check for new keyword in presentation auth
grep -r "new Auth" src/presentation/
# Should return: (no matches)

# Verify TypeScript compilation
npm run build
# Should return: (no errors)

# Test the server starts
npm run dev
# Should return: "Server started on port 3100"
```

---

## Documentation Files

- **ARCHITECTURE_GUIDE.md** - Detailed architecture reference
- **ARCHITECTURE_DIAGRAMS.md** - Visual diagrams and flows
- **CLEAN_ARCHITECTURE_AUDIT.md** - Initial audit findings
- **REFACTORING_SUMMARY.md** - Summary of changes made
- **CLEAN_ARCHITECTURE_QUICK_REFERENCE.md** - This file

---

## Key Principles

1. **Dependency Rule**: Dependencies only point inward
2. **Independence**: Domain layer is independent of frameworks
3. **Testability**: Every layer can be tested in isolation
4. **Maintainability**: Changes are localized to specific layers
5. **Flexibility**: Easy to swap implementations (MongoDB → PostgreSQL)

---

## Getting Help

If you're unsure about architecture:

1. Check if code follows the **Dependency Rule**
2. Verify **no framework imports in domain**
3. Ensure **all instantiation in infrastructure**
4. Use **Container.get*** in presentation
5. **Inject dependencies** through constructors
6. Keep **domain pure** and **focused**

When adding features, follow the **6-step guide** above.

---

**Status**: ✅ Production Ready
**Compliance**: 100% 
**Last Updated**: December 9, 2025
