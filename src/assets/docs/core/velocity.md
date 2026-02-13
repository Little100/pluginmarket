# Velocity

## 概述

Velocity 是由 PaperMC 团队开发的新一代 Minecraft 代理端（Proxy）。它用于连接多个后端 Minecraft 服务器，使玩家可以在不同服务器之间无缝切换，是构建群组服（BungeeCord 网络）的核心组件。

Velocity 是目前最推荐的代理端选择，已成为 Waterfall（BungeeCord 的分支）的完整替代品。PaperMC 团队已停止维护 Waterfall，并建议所有用户迁移到 Velocity。

## 特点

### PaperMC 团队开发维护

Velocity 由 PaperMC 团队（Paper、Folia 的开发者）开发和维护，拥有活跃的开发社区和持续的更新支持。

### 高性能，低延迟

Velocity 从底层重新设计，采用高效的网络处理架构，相比 BungeeCord 具有更低的延迟和更高的吞吐量。在高并发场景下表现尤为出色。

### 现代化架构

- 使用现代 Java 特性和最佳实践
- 代码结构清晰，易于维护
- 支持最新的 Minecraft 协议版本

### 内置 Modern Forwarding

Velocity 提供了 modern forwarding 机制，这是一种比 BungeeCord 的 IP forwarding 更安全的玩家信息转发方式：

- 使用密钥验证，防止伪造连接
- 后端服务器可以验证连接确实来自 Velocity
- 有效防止玩家绕过代理直接连接后端服务器

### 支持 Velocity 插件 API

Velocity 拥有自己的插件 API，提供：

- 事件驱动的插件系统
- 完善的命令注册机制
- 丰富的 API 接口

### 兼容 BungeeCord 插件

通过安装兼容插件（如 Snap），Velocity 可以运行部分 BungeeCord 插件，方便从 BungeeCord 迁移。

## 与 BungeeCord 的对比

| 特性 | Velocity | BungeeCord |
|------|----------|------------|
| 开发团队 | PaperMC | SpigotMC |
| 性能 | 更高 | 一般 |
| 安全性 | modern forwarding（更安全） | IP forwarding（较弱） |
| 维护状态 | 活跃开发 | 维护模式 |
| 插件生态 | 原生 API + 兼容层 | 成熟但较旧 |
| 配置格式 | TOML | YAML |
| 推荐程度 | 强烈推荐 | 不推荐新项目使用 |

## 支持版本

Velocity 支持 Minecraft 1.7.2 至最新版本的客户端连接。后端服务器需要运行支持 Velocity 的服务端核心，如：

- Paper（推荐）
- Folia
- Purpur
- 其他 Paper 分支

## 下载方式

### 官方下载

访问 PaperMC 官方下载页面获取最新版本：

**下载地址**：https://papermc.io/downloads/velocity

当前最新版本为 Velocity 3.5.0-SNAPSHOT，建议下载最新构建以获得最佳兼容性和安全修复。

### 其他资源

- **官方文档**：https://docs.papermc.io/velocity
- **GitHub 仓库**：https://github.com/PaperMC/Velocity
- **插件下载**：https://hangar.papermc.io（PaperMC 官方插件库）

## 安装和配置步骤

### 1. 下载 Velocity

从官网下载最新的 velocity-xxx.jar 文件。

### 2. 首次启动

创建一个专用文件夹，将 jar 文件放入其中，然后运行：

```bash
java -Xms512M -Xmx512M -jar velocity-xxx.jar
```

首次启动会生成配置文件和必要的目录结构。

### 3. velocity.toml 关键配置

编辑 `velocity.toml` 文件，以下是关键配置项：

```toml
# 绑定地址和端口（玩家连接的地址）
bind = "0.0.0.0:25577"

# 服务器显示的 MOTD
motd = "<#09add3>A Velocity Server"

# 最大玩家数
show-max-players = 500

# 在线模式（正版验证）
online-mode = true

# 玩家信息转发模式（强烈推荐使用 modern）
player-info-forwarding-mode = "modern"

# 后端服务器列表
[servers]
lobby = "127.0.0.1:30066"
survival = "127.0.0.1:30067"
creative = "127.0.0.1:30068"

# 玩家首次连接时进入的服务器
try = ["lobby"]

# 强制默认服务器（玩家每次连接都进入此服务器）
[forced-hosts]
"lobby.example.com" = ["lobby"]
"survival.example.com" = ["survival"]
```

### 4. 配置 Modern Forwarding

Modern forwarding 需要在 Velocity 和后端服务器之间共享一个密钥。

**Velocity 端**：

首次启动后会自动生成 `forwarding.secret` 文件，其中包含随机生成的密钥。

**后端服务器端（Paper）**：

1. 将 `server.properties` 中的 `online-mode` 设置为 `false`：

```properties
online-mode=false
```

2. 编辑 `config/paper-global.yml`，配置 Velocity 支持：

```yaml
proxies:
  velocity:
    enabled: true
    online-mode: true
    secret: "从 forwarding.secret 文件复制的密钥"
```

3. 重启后端服务器使配置生效。

### 5. 启动顺序

1. 先启动所有后端服务器
2. 确认后端服务器正常运行
3. 启动 Velocity 代理端
4. 玩家通过 Velocity 的地址和端口连接

## 群组服架构

典型的 Velocity 群组服架构如下：

```
                    ┌─────────────┐
                    │   玩家客户端  │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Velocity   │
                    │  (代理端)    │
                    │ :25577      │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │   大厅服     │  │   生存服     │  │   小游戏服   │
   │  (Paper)    │  │  (Paper)    │  │  (Paper)    │
   │  :30066     │  │  :30067     │  │  :30068     │
   └─────────────┘  └─────────────┘  └─────────────┘
```

**架构说明**：

- 玩家只需连接 Velocity 的地址（如 25577 端口）
- Velocity 负责将玩家路由到不同的后端服务器
- 后端服务器之间相互独立，可以运行不同的游戏模式
- 玩家可以通过命令或传送门在服务器之间切换

## 常见问题

### 玩家连接后立即断开

**可能原因**：
- Modern forwarding 配置不正确
- 后端服务器的 `online-mode` 未设置为 `false`
- `forwarding.secret` 密钥不匹配

**解决方法**：
检查 Velocity 的 `forwarding.secret` 和后端服务器 `paper-global.yml` 中的 `secret` 是否一致。

### 玩家 UUID 或皮肤不正确

**可能原因**：
- 未正确配置 modern forwarding
- 后端服务器未启用 Velocity 支持

**解决方法**：
确保 `paper-global.yml` 中 `proxies.velocity.enabled` 和 `proxies.velocity.online-mode` 都设置为 `true`。

### 无法连接到后端服务器

**可能原因**：
- 后端服务器未启动
- `velocity.toml` 中的服务器地址或端口配置错误
- 防火墙阻止了连接

**解决方法**：
1. 确认后端服务器正在运行
2. 检查 `velocity.toml` 中的地址和端口是否正确
3. 如果 Velocity 和后端服务器在同一台机器上，使用 `127.0.0.1`

### BungeeCord 插件无法使用

**原因**：
Velocity 使用自己的插件 API，与 BungeeCord 插件不兼容。

**解决方法**：
- 寻找该插件的 Velocity 版本
- 使用功能相似的 Velocity 原生插件
- 安装 Snap 等兼容层插件（部分插件可能仍无法工作）

### 如何实现跨服传送

**方法**：
1. 安装跨服传送插件（如 VelocityUtils）
2. 使用 Velocity 的内置命令 `/server <服务器名>`
3. 通过插件 API 编写自定义传送逻辑

### 如何同步玩家数据

**方法**：
- 使用支持多服务器的插件（如 LuckPerms 的网络同步功能）
- 配置共享数据库（MySQL/MariaDB）
- 使用 Redis 进行实时数据同步
