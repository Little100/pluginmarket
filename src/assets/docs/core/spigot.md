# Spigot

## 概述

Spigot 是基于 CraftBukkit 开发的 Minecraft 服务端软件，是 Bukkit 生态系统的核心组成部分。它在 CraftBukkit 的基础上进行了大量优化和改进，为服务器管理员提供了更好的性能和更多的配置选项。

Spigot 由 SpigotMC 团队维护，自 2012 年以来一直是 Minecraft 服务器社区最重要的项目之一。几乎所有的 Bukkit 插件都可以在 Spigot 上运行，这使得它成为了插件生态系统的基石。

## 特点

### 性能优化

- 在 CraftBukkit 基础上进行了多项性能改进
- 优化了实体处理、区块加载等核心功能
- 提供了丰富的配置选项用于调整服务器性能

### 插件生态

- 完全兼容 Bukkit API
- 拥有最庞大的插件资源库（SpigotMC 资源页面）
- 几乎所有 Bukkit 插件都可以直接运行

### 构建方式

- 由于版权原因，Spigot 不直接提供编译好的 JAR 文件下载
- 需要使用官方提供的 BuildTools 工具自行编译
- 这种方式确保了代码的合法性和安全性

### 社区支持

- 历史悠久，社区庞大且活跃
- 拥有完善的文档和教程
- 问题反馈和技术支持渠道丰富

## 与 Paper 的区别

虽然 Spigot 是一个优秀的服务端，但目前更推荐使用 Paper：

| 对比项 | Spigot | Paper |
|--------|--------|-------|
| 性能 | 较好 | 更优（在 Spigot 基础上进一步优化） |
| 获取方式 | 需要 BuildTools 编译 | 直接下载 JAR 文件 |
| 更新速度 | 较慢 | 更快，Bug 修复更及时 |
| API 扩展 | 标准 Bukkit/Spigot API | 额外提供 Paper API |
| 异步功能 | 有限 | 更多异步处理支持 |

**建议**：如果没有特殊需求，推荐使用 Paper。Paper 完全兼容 Spigot 插件，同时提供更好的性能和更多功能。

## 支持版本

Spigot 支持从 1.8 到最新版本的 Minecraft。当前最新支持版本为 **1.21.4**。

使用 BuildTools 可以构建以下版本：
- 最新版：使用 `--rev latest` 参数
- 指定版本：使用 `--rev 版本号` 参数（如 `--rev 1.20.4`）
- 历史版本：支持 1.8 及以上的所有主要版本

## 下载与构建

### 官方资源

- 官网：https://www.spigotmc.org/
- BuildTools Wiki：https://www.spigotmc.org/wiki/buildtools/
- BuildTools 下载：https://hub.spigotmc.org/jenkins/job/BuildTools/

### 前置要求

在使用 BuildTools 之前，需要安装以下软件：

1. **Java**：推荐 Java 17 或更高版本（根据目标 Minecraft 版本选择）
2. **Git**：用于拉取源代码

### BuildTools 使用步骤

1. 下载 BuildTools.jar
   - 访问 https://hub.spigotmc.org/jenkins/job/BuildTools/
   - 点击最新构建版本
   - 下载 `BuildTools.jar` 文件

2. 创建工作目录
   - 新建一个空文件夹用于存放 BuildTools 和编译产物
   - 将 `BuildTools.jar` 放入该文件夹

3. 运行 BuildTools
   ```bash
   # 构建最新版本
   java -jar BuildTools.jar
   
   # 构建指定版本
   java -jar BuildTools.jar --rev 1.20.4
   
   # 构建最新版本（显式指定）
   java -jar BuildTools.jar --rev latest
   ```

4. 等待编译完成
   - 首次运行需要下载依赖，耗时较长（约 10-30 分钟）
   - 编译完成后会在当前目录生成 `spigot-版本号.jar` 文件

### 常用 BuildTools 参数

| 参数 | 说明 |
|------|------|
| `--rev <版本>` | 指定要构建的 Minecraft 版本 |
| `--compile craftbukkit` | 同时编译 CraftBukkit |
| `--compile spigot` | 仅编译 Spigot（默认） |
| `--output-dir <路径>` | 指定输出目录 |
| `--nogui` | 禁用 GUI 模式（适用于服务器环境） |

## 安装步骤

### Windows

1. 确保已安装 Java 17+ 和 Git

2. 使用 BuildTools 构建 Spigot（参考上方步骤）

3. 创建服务器目录，将生成的 `spigot-版本号.jar` 复制到该目录

4. 创建启动脚本 `start.bat`：
   ```batch
   @echo off
   java -Xms2G -Xmx2G -jar spigot-1.20.4.jar nogui
   pause
   ```

5. 双击运行 `start.bat`

6. 首次运行会生成 `eula.txt`，将其中的 `eula=false` 改为 `eula=true`

7. 再次运行启动脚本，服务器即可正常启动

### Linux

1. 安装 Java 和 Git：
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install openjdk-17-jdk git
   
   # CentOS/RHEL
   sudo yum install java-17-openjdk git
   ```

2. 使用 BuildTools 构建 Spigot

3. 创建服务器目录并复制 JAR 文件：
   ```bash
   mkdir ~/minecraft-server
   cp spigot-1.20.4.jar ~/minecraft-server/
   cd ~/minecraft-server
   ```

4. 创建启动脚本 `start.sh`：
   ```bash
   #!/bin/bash
   java -Xms2G -Xmx2G -jar spigot-1.20.4.jar nogui
   ```

5. 添加执行权限并运行：
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

6. 同意 EULA：
   ```bash
   sed -i 's/eula=false/eula=true/g' eula.txt
   ```

7. 再次运行启动脚本

## CraftBukkit 简介

CraftBukkit 是 Spigot 的上游项目，也是最早实现 Bukkit API 的服务端软件。

### 与 Spigot 的关系

- CraftBukkit 是 Bukkit API 的官方实现
- Spigot 基于 CraftBukkit 开发，添加了额外的优化和功能
- 两者共享相同的插件 API，插件可以互相兼容

### 现状

- CraftBukkit 仍在维护，但更新频率较低
- 大多数服务器管理员选择使用 Spigot 或 Paper
- 如需使用 CraftBukkit，同样需要通过 BuildTools 构建：
  ```bash
  java -jar BuildTools.jar --compile craftbukkit
  ```

## 常见问题

### BuildTools 运行失败

**问题**：运行 BuildTools 时出现错误

**解决方案**：
1. 确保 Java 版本正确（推荐 Java 17+）
2. 确保 Git 已正确安装并添加到系统 PATH
3. 检查网络连接，BuildTools 需要从 GitHub 下载源代码
4. 尝试删除工作目录中的缓存文件后重新运行

### 插件不兼容

**问题**：某些插件在 Spigot 上无法正常工作

**解决方案**：
1. 检查插件是否支持当前 Spigot 版本
2. 查看服务器日志中的错误信息
3. 尝试更新插件到最新版本
4. 在插件的官方页面查找兼容性说明

### 服务器性能不佳

**问题**：服务器运行卡顿

**解决方案**：
1. 调整 `spigot.yml` 中的性能相关配置
2. 减少视距（view-distance）设置
3. 限制实体数量
4. 考虑迁移到 Paper 以获得更好的性能

### 为什么不直接提供 JAR 下载

**问题**：为什么 Spigot 需要自己编译

**解答**：由于 Minecraft 服务端代码的版权问题，SpigotMC 无法直接分发包含 Mojang 代码的编译产物。BuildTools 通过在用户本地编译的方式规避了这一法律问题。如果希望直接下载使用，可以选择 Paper，它采用了不同的分发策略。

### 如何更新 Spigot

**问题**：如何将服务器更新到新版本

**解决方案**：
1. 使用 BuildTools 构建新版本的 Spigot
2. 备份当前服务器的所有数据
3. 停止服务器
4. 替换旧的 JAR 文件
5. 启动服务器并检查插件兼容性
