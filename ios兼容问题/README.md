# Hello World API

一个使用Node.js创建的简单Hello World接口服务器。

## 功能特性

- ✅ Hello World GET接口
- ✅ Hello World POST接口（支持接收数据）
- ✅ 服务器状态检查接口
- ✅ CORS跨域支持
- ✅ JSON响应格式
- ✅ 错误处理和404页面

## 快速启动

1. 启动服务器：
```bash
npm start
# 或者
node index.js
```

2. 服务器将在 http://localhost:3000 启动

## API接口

### 1. Hello World (GET)
```
GET http://localhost:3000/hello
```

响应示例：
```json
{
  "message": "Hello World!",
  "timestamp": "2025-08-22T10:30:00.000Z",
  "method": "GET",
  "path": "/hello"
}
```

### 2. Hello World (POST)
```
POST http://localhost:3000/hello
Content-Type: application/json

{
  "name": "张三",
  "message": "测试数据"
}
```

响应示例：
```json
{
  "message": "Hello World!",
  "timestamp": "2025-08-22T10:30:00.000Z",
  "method": "POST",
  "path": "/hello",
  "receivedData": {
    "name": "张三",
    "message": "测试数据"
  }
}
```

### 3. 服务器状态检查
```
GET http://localhost:3000/api/status
```

响应示例：
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2025-08-22T10:30:00.000Z",
  "uptime": 120.5
}
```

## 测试方法

### 使用curl测试
```bash
# GET请求
curl http://localhost:3000/hello

# POST请求
curl -X POST http://localhost:3000/hello \
  -H "Content-Type: application/json" \
  -d '{"name":"测试用户","message":"Hello from curl"}'

# 状态检查
curl http://localhost:3000/api/status
```

### 使用浏览器测试
直接在浏览器中访问：
- http://localhost:3000/hello
- http://localhost:3000/api/status

## 停止服务器

在终端中按 `Ctrl + C` 可以优雅地停止服务器。
