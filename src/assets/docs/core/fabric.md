# Fabric 服务端

## 概述

Fabric 是一个轻量级的 Minecraft 模组加载器，以快速更新和高性能著称。它采用模块化设计，核心加载器体积极小，启动速度快，是目前更新速度最快的模组加载器之一。Fabric 通常在 Minecraft 新版本发布后数小时内就能提供支持，深受追求最新版本体验的玩家和模组开发者喜爱。

## 特点

### 优势

- **极其轻量**：核心加载器体积小，启动速度快，资源占用低
- **更新速度快**：通常是最先支持新 Minecraft 版本的模组加载器
- **Mixin 技术**：采用 Mixin 字节码注入技术，模组之间兼容性好，冲突少
- **模块化设计**：核心功能与 API 分离，按需加载
- **性能优化生态**：拥有大量优秀的性能优化模组（如 Sodium、Lithium、Starlight）
- **开发友好**：模组开发门槛相对较低，文档完善

### 注意事项

- **需要 Fabric API**：大部分 Fabric 模组需要 Fabric API 作为前置依赖，需单独下载安装
- **纯模组端**：不支持 Bukkit/Spigot/Paper 插件，仅支持 Fabric 模组
- **模组数量**：虽然增长迅速，但总量仍少于 Forge

## 与 Forge 的区别

| 对比项 | Fabric | Forge |
|--------|--------|-------|
| 设计理念 | 轻量、模块化 | 功能完整、一体化 |
| 启动速度 | 快 | 较慢 |
| 版本更新 | 极快（通常数小时） | 较慢（通常数天到数周） |
| 模组数量 | 较少但增长快 | 多，生态成熟 |
| API 依赖 | 需单独安装 Fabric API | 内置 |
| 技术实现 | Mixin 注入 | 事件系统 + ASM |
| 学习曲线 | 较平缓 | 较陡峭 |
| 大型模组 | 较少 | 较多（如工业、魔法类） |

## 支持版本

Fabric 支持 Minecraft 1.14 及以上的所有版本，包括快照版本。

当前推荐版本：
- **Minecraft**：1.21.11（最新稳定版）
- **Fabric Loader**：0.18.4
- **Fabric Installer**：1.1.1

> Fabric 对新版本的支持速度极快，通常在 Minecraft 更新后数小时内即可使用。

## 下载方式

### 官方网站

- **官网**：https://fabricmc.net/
- **服务端下载页**：https://fabricmc.net/use/server

### Fabric API 下载

Fabric API 是大部分 Fabric 模组的必需前置，需要单独下载：

- **Modrinth**：https://modrinth.com/mod/fabric-api
- **CurseForge**：https://www.curseforge.com/minecraft/mc-mods/fabric-api

> 下载时请确保 Fabric API 版本与 Minecraft 版本匹配。

## 安装步骤

### Windows 系统

#### 方法一：使用可执行服务端（推荐）

1. 访问 https://fabricmc.net/use/server
2. 选择所需的 Minecraft 版本、Fabric Loader 版本和 Installer 版本
3. 点击 **Executable Server (.jar)** 下载服务端 JAR 文件
4. 创建一个新文件夹作为服务器目录
5. 将下载的 JAR 文件放入该文件夹
6. 双击运行 JAR 文件，或使用命令行：
   ```batch
   java -Xmx4G -jar fabric-server-mc.1.21.11-loader.0.18.4-launcher.1.1.1.jar nogui
   ```
7. 首次运行会生成 `eula.txt`，打开并将 `eula=false` 改为 `eula=true`
8. 从 Modrinth 或 CurseForge 下载对应版本的 Fabric API
9. 将 Fabric API 的 JAR 文件放入 `mods` 文件夹
10. 再次运行服务端

#### 方法二：使用安装器

1. 下载 Fabric 安装器：https://fabricmc.net/use/installer
2. 运行安装器，选择 **Server** 标签
3. 选择 Minecraft 版本和安装位置
4. 点击 **Install** 完成安装
5. 按照方法一的步骤 7-10 继续配置

### Linux 系统

```bash
# 创建服务器目录
mkdir fabric-server && cd fabric-server

# 下载 Fabric 服务端（以 1.21.11 为例）
curl -OJ https://meta.fabricmc.net/v2/versions/loader/1.21.11/0.18.4/1.1.1/server/jar

# 首次运行（会生成配置文件）
java -Xmx4G -jar fabric-server-mc.1.21.11-loader.0.18.4-launcher.1.1.1.jar nogui

# 同意 EULA
sed -i 's/eula=false/eula=true/g' eula.txt

# 创建 mods 文件夹
mkdir -p mods

# 下载 Fabric API（请替换为实际版本号）
curl -L -o mods/fabric-api.jar "https://cdn.modrinth.com/data/P7dR8mSH/versions/[版本ID]/fabric-api-[版本号].jar"

# 启动服务器
java -Xmx4G -jar fabric-server-mc.1.21.11-loader.0.18.4-launcher.1.1.1.jar nogui
```

### 启动脚本示例

**Windows (start.bat)**：
```batch
@echo off
java -Xmx4G -Xms2G -jar fabric-server-mc.1.21.11-loader.0.18.4-launcher.1.1.1.jar nogui
pause
```

**Linux (start.sh)**：
```bash
#!/bin/bash
java -Xmx4G -Xms2G -jar fabric-server-mc.1.21.11-loader.0.18.4-launcher.1.1.1.jar nogui
```

## 模组安装方法

1. **确认版本兼容**：确保模组支持当前的 Minecraft 版本和 Fabric Loader 版本
2. **检查前置依赖**：
   - 几乎所有 Fabric 模组都需要 Fabric API
   - 部分模组可能需要其他前置模组（如 Cloth Config、Mod Menu 等）
3. **下载模组**：从 Modrinth 或 CurseForge 下载模组的 JAR 文件
4. **安装模组**：将模组 JAR 文件放入服务器的 `mods` 文件夹
5. **重启服务器**：重启服务器使模组生效

### 推荐的服务端优化模组

| 模组名称 | 功能 | 下载地址 |
|----------|------|----------|
| Lithium | 游戏逻辑优化 | https://modrinth.com/mod/lithium |
| Starlight | 光照引擎优化 | https://modrinth.com/mod/starlight |
| FerriteCore | 内存占用优化 | https://modrinth.com/mod/ferrite-core |
| Krypton | 网络优化 | https://modrinth.com/mod/krypton |
| C2ME | 区块加载优化 | https://modrinth.com/mod/c2me-fabric |

## 常见问题

### 服务端无法启动

**问题**：双击 JAR 文件没有反应或闪退

**解决方案**：
1. 确认已安装 Java 21 或更高版本（Minecraft 1.20.5+ 要求）
2. 使用命令行启动以查看错误信息
3. 检查 JAR 文件是否完整下载

### 模组不生效

**问题**：安装模组后服务器没有变化

**解决方案**：
1. 确认模组放在 `mods` 文件夹中
2. 检查模组版本是否与 Minecraft 版本匹配
3. 确认已安装 Fabric API
4. 查看服务器日志中的错误信息

### Fabric API 版本不匹配

**问题**：启动时提示 Fabric API 版本错误

**解决方案**：
1. 从 Modrinth 或 CurseForge 下载与 Minecraft 版本对应的 Fabric API
2. 删除旧版本的 Fabric API
3. 确保 `mods` 文件夹中只有一个 Fabric API 文件

### 模组冲突

**问题**：安装多个模组后服务器崩溃

**解决方案**：
1. 查看崩溃日志确定冲突的模组
2. 逐个移除模组测试，找出问题模组
3. 检查模组是否有已知的不兼容问题
4. 尝试更新模组到最新版本

### 内存不足

**问题**：服务器运行缓慢或崩溃，日志显示内存相关错误

**解决方案**：
1. 增加启动参数中的内存分配（如 `-Xmx6G`）
2. 安装内存优化模组（如 FerriteCore）
3. 减少同时加载的模组数量

### 客户端连接失败

**问题**：客户端无法连接到 Fabric 服务器

**解决方案**：
1. 确保客户端安装了相同版本的 Fabric Loader
2. 确保客户端安装了服务端要求的所有模组
3. 检查服务器端口是否正确开放
4. 确认客户端和服务端的 Minecraft 版本一致
