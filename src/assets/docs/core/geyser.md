# Geyser

## 概述

Geyser 是一个开源的跨平台桥接工具，允许 Minecraft 基岩版（Bedrock Edition）玩家加入 Java 版服务器。基岩版包括手机（iOS/Android）、游戏主机（Xbox、PlayStation、Nintendo Switch）以及 Windows 10/11 版本。通过 Geyser，服务器管理员可以让这些平台的玩家与 Java 版玩家在同一个服务器中游玩，实现真正的跨平台联机。

## 特点

- **无需购买 Java 版**：基岩版玩家可以直接加入 Java 版服务器，无需额外购买 Java 版游戏
- **多种安装方式**：可作为独立代理端运行，也可作为插件安装到现有服务端
- **广泛的平台支持**：支持 Spigot/Paper、Velocity、BungeeCord、Fabric、NeoForge 等多种服务端
- **搭配 Floodgate**：配合 Floodgate 插件可实现基岩版玩家免 Java 版正版验证登录
- **持续更新**：项目活跃维护，定期更新以支持最新的 Minecraft 版本

## 支持版本

截至 2026 年 2 月，Geyser 最新构建版本为 Build #1072：

| 平台 | 支持版本 |
|------|----------|
| Bedrock Edition | 1.21.111 至 26.0（包括多个子版本） |
| Java Edition | 1.21.11 |

> 如果你的 Java 服务器版本不是 1.21.11，建议安装 ViaVersion 插件来处理版本兼容问题。

## 下载方式

### 官方下载

官网下载页面：https://geysermc.org/download

### 各平台版本

| 平台 | 文件名 |
|------|--------|
| Spigot/Paper | Geyser-Spigot.jar |
| Velocity | Geyser-Velocity.jar |
| BungeeCord | Geyser-BungeeCord.jar |
| Fabric | Geyser-Fabric.jar |
| NeoForge | Geyser-NeoForge.jar |
| 独立运行 | Geyser-Standalone.jar |
| ViaProxy | Geyser-ViaProxy.jar |

## 安装方式

### 作为 Paper/Spigot 插件安装

1. 从官网下载 `Geyser-Spigot.jar`
2. 将 jar 文件放入服务器的 `plugins` 文件夹
3. 重启服务器
4. 编辑 `plugins/Geyser-Spigot/config.yml` 进行配置
5. 再次重启服务器使配置生效

### 作为 Velocity 插件安装

1. 从官网下载 `Geyser-Velocity.jar`
2. 将 jar 文件放入 Velocity 代理服务器的 `plugins` 文件夹
3. 重启 Velocity 服务器
4. 编辑 `plugins/Geyser-Velocity/config.yml` 进行配置
5. 再次重启服务器使配置生效

### 独立运行模式

独立运行模式适用于无法安装插件的情况，或者需要将 Geyser 部署在单独服务器上的场景。

1. 从官网下载 `Geyser-Standalone.jar`
2. 在命令行中运行：
   ```bash
   java -jar Geyser-Standalone.jar
   ```
3. 首次运行会生成 `config.yml` 配置文件
4. 编辑配置文件，设置目标 Java 服务器地址
5. 重新运行 Geyser

## Floodgate 介绍

### 什么是 Floodgate

Floodgate 是 GeyserMC 团队开发的配套插件，用于处理基岩版玩家的身份验证问题。它允许基岩版玩家使用 Xbox Live 账号登录 Java 版服务器，而无需拥有 Java 版正版账号。

### 为什么需要 Floodgate

默认情况下，Java 版服务器要求玩家使用 Mojang/Microsoft 账号进行正版验证。基岩版玩家通常没有 Java 版账号，如果不使用 Floodgate：

- 服务器需要关闭正版验证（online-mode=false），这会带来安全风险
- 或者基岩版玩家需要额外购买 Java 版账号

使用 Floodgate 后，基岩版玩家可以通过 Xbox Live 账号验证身份，服务器可以保持正版验证开启。

### 安装方法

1. 从 https://geysermc.org/download 下载对应平台的 Floodgate 插件
2. 将 Floodgate jar 文件放入 `plugins` 文件夹（与 Geyser 相同位置）
3. 重启服务器
4. Floodgate 会自动与 Geyser 配合工作

> 基岩版玩家的用户名默认会添加前缀（如 `.` 或 `*`），以区分 Java 版玩家。可在 Floodgate 配置中修改此前缀。

## 配置要点

### 端口配置

Geyser 需要开放 UDP 端口供基岩版客户端连接：

- **默认端口**：19132（UDP）
- 这是基岩版 Minecraft 的默认服务器端口
- 确保服务器防火墙和云服务商安全组已开放此端口的 UDP 协议

配置文件中的相关设置：
```yaml
bedrock:
  address: 0.0.0.0
  port: 19132
```

### 认证模式

在 `config.yml` 中，`auth-type` 决定了玩家的验证方式：

| 模式 | 说明 |
|------|------|
| `online` | 基岩版玩家需要拥有 Java 版正版账号 |
| `offline` | 不进行验证（不推荐，存在安全风险） |
| `floodgate` | 使用 Floodgate 进行 Xbox Live 验证（推荐） |

推荐配置：
```yaml
remote:
  auth-type: floodgate
```

## 常见问题

### 基岩版玩家无法连接

1. 检查 19132 端口（UDP）是否已开放
2. 确认服务器地址和端口配置正确
3. 检查 Geyser 控制台是否有错误信息
4. 确保基岩版客户端版本在支持范围内

### 玩家连接后立即断开

1. 检查 Java 服务器是否正常运行
2. 确认 `config.yml` 中的 `remote` 配置指向正确的 Java 服务器地址和端口
3. 如果使用 Floodgate，确保 Floodgate 已正确安装

### 版本不兼容

1. 更新 Geyser 到最新版本
2. 如果 Java 服务器版本与 Geyser 支持的版本不同，安装 ViaVersion 插件
3. 确保基岩版客户端已更新到支持的版本

### 皮肤显示问题

基岩版玩家的皮肤可能无法正确显示给 Java 版玩家，这是由于两个平台皮肤系统的差异导致的。可以通过安装额外的皮肤同步插件来改善此问题。

### 某些功能无法使用

由于 Java 版和基岩版存在游戏机制差异，部分功能可能无法完美转换。GeyserMC 团队持续改进兼容性，建议保持 Geyser 更新到最新版本。

## 相关链接

- 官方网站：https://geysermc.org/
- 下载页面：https://geysermc.org/download
- 官方文档：https://geysermc.org/wiki/geyser/setup
- 支持版本：https://geysermc.org/wiki/geyser/supported-versions
- GitHub：https://github.com/GeyserMC/Geyser
