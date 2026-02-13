# BungeeCord / Waterfall

## 概述

BungeeCord 是一款 Minecraft 代理端（Proxy）软件，用于将多个独立的 Minecraft 服务器连接成一个群组网络。玩家只需连接到代理端，即可在多个子服务器之间自由切换，无需断开重连。这种架构通常被称为"群组服"或"网络服"。

## 代理端的作用

代理端在群组服架构中扮演着核心角色：

- **统一入口**：玩家只需记住一个服务器地址，通过代理端连接后可访问所有子服务器
- **服务器切换**：玩家可以在不同子服务器（如大厅、生存、小游戏等）之间无缝切换
- **负载均衡**：可以将玩家分散到多个子服务器，避免单一服务器压力过大
- **统一管理**：可以在代理端层面实现全局封禁、权限管理、聊天系统等功能
- **正版验证**：由代理端统一处理玩家的正版验证，子服务器无需重复验证

## BungeeCord

### 简介

BungeeCord 由 SpigotMC 团队开发，是 Minecraft 最早也是最广泛使用的代理端软件。它定义了 BungeeCord 插件 API，许多代理端插件都基于此 API 开发。

### 特点

- SpigotMC 团队开发和维护
- 最早的 Minecraft 代理端解决方案
- 拥有成熟的插件生态系统
- 使用 BungeeCord 插件 API
- 持续更新，支持最新 Minecraft 版本

### 下载

官方下载地址：https://ci.md-5.net/job/BungeeCord/

从 Jenkins CI 页面下载最新的 `BungeeCord.jar` 文件。

## Waterfall

### 简介

Waterfall 是 PaperMC 团队基于 BungeeCord 开发的分支版本，提供了更好的性能和稳定性优化。

### 重要提示

> ⚠️ **Waterfall 已停止维护**
> 
> PaperMC 团队已宣布 Waterfall 进入生命周期结束（EOL）状态，不再进行功能更新和安全维护。官方强烈建议迁移到 Velocity。
> 
> 如果您正在搭建新的群组服，请直接选择 Velocity 而非 Waterfall。

### 特点

- 基于 BungeeCord 的改进版本
- 更好的性能优化
- 更稳定的连接处理
- 完全兼容 BungeeCord 插件
- **已停止维护，不推荐新项目使用**

### 下载

存档下载地址：https://papermc.io/downloads/waterfall

最后支持的版本为 Minecraft 1.21，后续版本将不再更新。

## 支持版本

| 软件 | 支持的 Minecraft 版本 | 维护状态 |
|------|----------------------|----------|
| BungeeCord | 1.8 - 最新版本 | 活跃维护 |
| Waterfall | 1.8 - 1.21 | 已停止维护 |

## 安装和配置

### 1. 下载代理端

根据需要下载 BungeeCord 或 Waterfall 的 jar 文件。

### 2. 首次启动

```bash
java -Xms512M -Xmx512M -jar BungeeCord.jar
```

首次启动会生成配置文件，随后服务端会自动关闭。

### 3. 配置 config.yml

编辑 `config.yml` 文件，配置关键参数：

```yaml
# 玩家连接数限制
player_limit: -1

# 服务器列表
servers:
  lobby:
    motd: '&1大厅服务器'
    address: localhost:25566
    restricted: false
  survival:
    motd: '&2生存服务器'
    address: localhost:25567
    restricted: false

# 监听配置
listeners:
- query_port: 25577
  motd: '&b我的群组服'
  # 玩家默认进入的服务器
  priorities:
  - lobby
  bind_local_address: true
  host: 0.0.0.0:25565
  max_players: 100
  tab_size: 60
  force_default_server: false

# IP 转发模式（重要）
ip_forward: true

# 在线模式（正版验证）
online_mode: true
```

### 4. 配置子服务器

每个子服务器都需要进行以下配置：

**spigot.yml**（Spigot/Paper 服务端）：
```yaml
settings:
  bungeecord: true
```

**server.properties**：
```properties
# 关闭子服务器的正版验证（由代理端负责）
online-mode=false

# 修改端口，避免与代理端冲突
server-port=25566
```

> ⚠️ **安全警告**
> 
> 将子服务器的 `online-mode` 设为 `false` 后，必须确保子服务器只能被代理端访问，不能直接暴露在公网。否则任何人都可以使用任意用户名连接。建议通过防火墙限制子服务器端口只允许本机或代理端 IP 访问。

### 5. 启动顺序

1. 先启动所有子服务器
2. 确认子服务器正常运行后，启动代理端

## 群组服架构

典型的群组服架构如下：

```
                    ┌─────────────────┐
                    │     玩家        │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   代理端        │
                    │  (BungeeCord)   │
                    │   端口: 25565   │
                    └────────┬────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │   大厅服    │   │   生存服    │   │  小游戏服   │
    │ 端口: 25566 │   │ 端口: 25567 │   │ 端口: 25568 │
    └─────────────┘   └─────────────┘   └─────────────┘
```

- 玩家连接代理端的 25565 端口
- 代理端根据配置将玩家转发到对应的子服务器
- 子服务器之间通过代理端进行玩家转移
- 子服务器端口不对外开放，只允许代理端访问

## 为什么推荐 Velocity

虽然 BungeeCord 仍在维护，但 PaperMC 团队开发的 Velocity 是更现代的选择：

| 对比项 | BungeeCord | Velocity |
|--------|------------|----------|
| 性能 | 一般 | 更高 |
| 安全性 | 基础 | 更强（modern 转发模式） |
| 插件 API | 较旧 | 现代化设计 |
| 维护状态 | 活跃 | 活跃 |
| 插件兼容性 | 原生支持 | 需要兼容层或原生插件 |

**推荐使用 Velocity 的理由**：

1. **更好的性能**：Velocity 采用更高效的架构设计，能够处理更多并发连接
2. **更强的安全性**：modern 转发模式提供加密的玩家信息传输，防止伪造
3. **现代化 API**：插件开发更加便捷，支持异步操作
4. **活跃的开发**：PaperMC 团队持续投入开发资源

如果您正在搭建新的群组服，建议直接选择 Velocity。如果已有基于 BungeeCord 的服务器，可以考虑逐步迁移。

## 常见问题

### 玩家无法连接代理端

- 检查代理端是否正常启动
- 确认防火墙已开放代理端端口（默认 25565）
- 检查 `config.yml` 中的 `host` 配置是否正确

### 玩家无法切换服务器

- 确认目标子服务器已启动且正常运行
- 检查 `config.yml` 中子服务器的地址和端口配置
- 查看代理端控制台是否有错误信息

### 玩家 UUID 不一致

- 确保代理端的 `ip_forward` 设置为 `true`
- 确保子服务器的 `spigot.yml` 中 `bungeecord` 设置为 `true`
- 确保子服务器的 `online-mode` 设置为 `false`

### 插件无法获取玩家真实 IP

- 这是 IP 转发配置问题
- 检查 `ip_forward` 和 `bungeecord` 配置是否正确
- 部分插件可能需要额外配置才能正确获取 IP

### BungeeCord 插件和 Bukkit 插件的区别

- BungeeCord 插件运行在代理端，用于处理跨服务器功能
- Bukkit/Spigot/Paper 插件运行在子服务器，用于处理游戏内功能
- 两者使用不同的 API，不能混用
- 部分功能需要同时安装代理端插件和子服务器插件配合使用

### 如何实现跨服聊天

需要安装支持跨服功能的聊天插件，通常包含：
- 代理端插件：负责消息转发
- 子服务器插件：负责消息收发

常见的跨服聊天插件有 BungeeChat、LuckPerms（权限前缀）等。
