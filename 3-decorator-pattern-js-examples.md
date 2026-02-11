# Decorator Pattern in JavaScript/TypeScript - Detailed Examples

## Overview

The Decorator Pattern allows you to add behavior to objects dynamically without modifying their classes. In JavaScript/TypeScript, this pattern appears in several common frameworks and patterns.

---

## 1. Express.js Middleware

### How it Works

Express middleware functions are decorators that wrap HTTP request/response handlers. Each middleware decorates the request/response objects with additional functionality.

### Example: Building Custom Middleware Decorators

```typescript
import express, { Request, Response, NextFunction } from "express";

// Base handler interface (like Beverage)
interface RequestHandler {
  (req: Request, res: Response, next: NextFunction): void;
}

// Logger Decorator - adds logging functionality
function withLogger(handler: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    handler(req, res, next);
  };
}

// Authentication Decorator - adds auth check
function withAuth(handler: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Add user info to request (decorating the request)
    (req as any).user = { id: 1, name: "John" };
    handler(req, res, next);
  };
}

// Rate Limiting Decorator - adds rate limiting
function withRateLimit(handler: RequestHandler): RequestHandler {
  const requests = new Map<string, number[]>();
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const now = Date.now();
    const windowMs = 60000; // 1 minute

    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const timestamps = requests.get(ip)!;
    const recentRequests = timestamps.filter((time) => now - time < windowMs);

    if (recentRequests.length >= 10) {
      return res.status(429).json({ error: "Too many requests" });
    }

    recentRequests.push(now);
    requests.set(ip, recentRequests);
    handler(req, res, next);
  };
}

// Base route handler (like Espresso or DarkRoast)
function getUserHandler(req: Request, res: Response): void {
  res.json({
    message: "User data",
    user: (req as any).user,
  });
}

// Decorating the handler with multiple decorators
const app = express();
app.get("/user", withLogger(withAuth(withRateLimit(getUserHandler))));

// Express's built-in middleware (also decorators)
app.use(express.json()); // Decorates req with parsed body
app.use(express.urlencoded({ extended: true })); // Decorates req with parsed URL-encoded data
```

### Real Express Example

```typescript
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

// Each middleware decorates the request/response pipeline
app.use(helmet()); // Adds security headers
app.use(cors()); // Adds CORS headers
app.use(morgan("dev")); // Adds request logging
app.use(express.json()); // Adds parsed body to req.body

app.get("/api/data", (req, res) => {
  // This handler benefits from all the decorators above
  res.json({ data: "protected data" });
});
```

---

## 2. React Higher-Order Components (HOCs)

### How it Works

HOCs are functions that take a component and return a new component with additional functionality. This is the decorator pattern applied to React components.

### Example: Building HOC Decorators

```typescript
import React, { ComponentType, useEffect, useState } from 'react';

// Base component interface (like Beverage)
interface BaseComponentProps {
  [key: string]: any;
}

// Authentication HOC Decorator
function withAuth<P extends BaseComponentProps>(
  WrappedComponent: ComponentType<P>
): ComponentType<P & { isAuthenticated: boolean }> {
  return (props: P) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Check authentication
      const checkAuth = async () => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        setLoading(false);
      };
      checkAuth();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) return <div>Please log in</div>;

    return <WrappedComponent {...props} isAuthenticated={isAuthenticated} />;
  };
}

// Logging HOC Decorator
function withLogger<P extends BaseComponentProps>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> {
  return (props: P) => {
    useEffect(() => {
      console.log(`Component ${WrappedComponent.name} mounted`);
      return () => {
        console.log(`Component ${WrappedComponent.name} unmounted`);
      };
    }, []);

    return <WrappedComponent {...props} />;
  };
}

// Error Boundary HOC Decorator
function withErrorBoundary<P extends BaseComponentProps>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> {
  return class extends React.Component<P, { hasError: boolean }> {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return <div>Something went wrong</div>;
      }
      return <WrappedComponent {...this.props} />;
    }
  };
}

// Base component (like Espresso)
interface UserProfileProps {
  userId: number;
  isAuthenticated?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, isAuthenticated }) => {
  return (
    <div>
      <h1>User Profile {userId}</h1>
      <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
    </div>
  );
};

// Decorating the component with multiple HOCs
const EnhancedUserProfile = withErrorBoundary(
  withLogger(
    withAuth(UserProfile)
  )
);

// Usage
function App() {
  return <EnhancedUserProfile userId={123} />;
}
```

### Real React Library Examples

```typescript
// react-redux connect() is a HOC decorator
import { connect } from "react-redux";

const mapStateToProps = (state: any) => ({ user: state.user });
const mapDispatchToProps = { logout: () => ({ type: "LOGOUT" }) };

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserProfile);

// react-router withRouter() decorates with router props
import { withRouter } from "react-router-dom";
const RoutedComponent = withRouter(UserProfile);
```

---

## 3. React Hooks (Custom Hooks as Decorators)

### How it Works

Custom hooks can be thought of as decorators that add behavior to functional components. They encapsulate logic that can be reused across components.

### Example: Building Hook-Based Decorators

```typescript
import { useState, useEffect, useCallback } from 'react';

// Base component (like Beverage)
interface ComponentProps {
  [key: string]: any;
}

// useAuth Hook Decorator - adds authentication state
function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user data
      fetch('/api/user')
        .then(res => res.json())
        .then(data => {
          setUser(data);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback((token: string) => {
    localStorage.setItem('token', token);
    // Fetch user and update state
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return { user, loading, login, logout, isAuthenticated: !!user };
}

// useLogger Hook Decorator - adds logging
function useLogger(componentName: string) {
  useEffect(() => {
    console.log(`${componentName} mounted`);
    return () => {
      console.log(`${componentName} unmounted`);
    };
  }, [componentName]);
}

// useLocalStorage Hook Decorator - adds localStorage persistence
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

// useDebounce Hook Decorator - adds debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Base component decorated with hooks
const UserProfile: React.FC<{ userId: number }> = ({ userId }) => {
  // Using multiple hook decorators
  useLogger('UserProfile');
  const { user, loading, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return (
    <div>
      <h1>User Profile {userId}</h1>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <p>Debounced search: {debouncedSearchTerm}</p>
    </div>
  );
};
```

### Real React Hook Library Examples

```typescript
// react-query useQuery decorates components with data fetching
import { useQuery } from "@tanstack/react-query";

function UserProfile({ userId }: { userId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetch(`/api/users/${userId}`).then((res) => res.json()),
  });
  // Component now has data fetching capabilities
}

// react-hook-form useForm decorates with form state management
import { useForm } from "react-hook-form";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // Form now has validation, state management, etc.
}
```

---

## 4. TypeScript Decorators (Experimental)

### How it Works

TypeScript supports decorators (experimental feature) that can decorate classes, methods, properties, and parameters.

### Example: Class and Method Decorators

```typescript
// Enable decorators in tsconfig.json:
// {
//   "compilerOptions": {
//     "experimentalDecorators": true
//   }
// }

// Method decorator - logs method calls
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`${propertyKey} returned:`, result);
    return result;
  };

  return descriptor;
}

// Class decorator - adds timing functionality
function timing<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    startTime = Date.now();

    getElapsedTime() {
      return Date.now() - this.startTime;
    }
  };
}

// Property decorator - validates property values
function validate(min: number, max: number) {
  return function (target: any, propertyKey: string) {
    let value: number;

    const getter = () => value;
    const setter = (newVal: number) => {
      if (newVal < min || newVal > max) {
        throw new Error(`${propertyKey} must be between ${min} and ${max}`);
      }
      value = newVal;
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}

// Using decorators
@timing
class Calculator {
  @validate(0, 100)
  percentage: number = 50;

  @log
  add(a: number, b: number): number {
    return a + b;
  }

  @log
  multiply(a: number, b: number): number {
    return a * b;
  }
}

const calc = new Calculator();
calc.add(2, 3); // Logs: "Calling add with args: [2, 3]" and "add returned: 5"
calc.percentage = 75; // Validates and sets
// calc.percentage = 150; // Throws error
```

---

## 5. Function Composition (Functional Decorators)

### How it Works

In functional programming, decorators are often implemented as higher-order functions that compose behavior.

### Example: Functional Decorators

```typescript
// Base function type (like Beverage)
type Handler<T> = (input: T) => T;

// Retry decorator - adds retry logic
function withRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  maxRetries: number = 3,
): T {
  return (async (...args: any[]) => {
    let lastError: Error;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }
    throw lastError!;
  }) as T;
}

// Cache decorator - adds caching
function withCache<T extends (...args: any[]) => any>(
  fn: T,
  ttl: number = 60000,
): T {
  const cache = new Map<string, { value: any; expires: number }>();

  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached && Date.now() < cached.expires) {
      return cached.value;
    }

    const result = fn(...args);
    cache.set(key, {
      value: result,
      expires: Date.now() + ttl,
    });

    return result;
  }) as T;
}

// Timing decorator - adds performance timing
function withTiming<T extends (...args: any[]) => any>(fn: T): T {
  return ((...args: any[]) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    console.log(`${fn.name} took ${end - start}ms`);
    return result;
  }) as T;
}

// Base function (like Espresso)
async function fetchUserData(
  userId: number,
): Promise<{ id: number; name: string }> {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
}

function expensiveCalculation(n: number): number {
  let result = 0;
  for (let i = 0; i < n; i++) {
    result += i;
  }
  return result;
}

// Decorating functions
const fetchUserDataWithRetry = withRetry(fetchUserData, 3);
const cachedCalculation = withCache(expensiveCalculation, 30000);
const timedCalculation = withTiming(cachedCalculation);

// Composing multiple decorators
const enhancedFetch = withTiming(withRetry(fetchUserData, 3));
```

---

## Key Takeaways

1. **Express Middleware**: Decorates HTTP request/response pipeline
2. **React HOCs**: Decorates components with additional functionality
3. **React Hooks**: Decorates components with reusable logic
4. **TypeScript Decorators**: Decorates classes, methods, and properties
5. **Function Composition**: Decorates functions with cross-cutting concerns

All these patterns follow the same principle: **wrap an object/function/component with additional behavior without modifying the original**.
