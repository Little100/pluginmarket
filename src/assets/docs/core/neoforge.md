# NeoForge

## 概述

NeoForge 是 Minecraft Java 版的新一代模组加载器，由原 Forge 核心开发团队于 2023 年从 Forge 项目分裂后创建。作为 Forge 的精神继承者，NeoForge 致力于提供更现代化的模组开发框架，同时保持对 Minecraft 模组生态系统的支持。

NeoForge 的诞生源于 Forge 团队内部对项目发展方向的分歧。原 Forge 的主要维护者选择创建 NeoForge，以实现更快速的迭代更新和更友好的开发者体验。

## 特点

### 现代化架构
- 基于 Forge 的成熟代码库进行重构和优化
- 采用更清晰的 API 设计
- 更好的代码组织结构

### 活跃的开发
- 更快的 Minecraft 版本适配速度
- 频繁的功能更新和 Bug 修复
- 积极响应社区反馈

### 开发者友好
- 改进的文档和示例代码
- 更简洁的模组开发流程
- 更好的调试工具支持

### 模组兼容性
- 早期版本（1.20.1）与 Forge 模组有较高兼容性
- 随着版本迭代，API 逐渐与 Forge 分化
- 新版本需要使用专门为 NeoForge 开发的模组

## 与 Forge 的关系和区别

### 分裂背景
2023 年，由于对 Forge 项目管理和技术方向的分歧，原 Forge 的核心开发者 cpw 等人决定创建 NeoForge。这次分裂导致 Minecraft 模组社区出现了两个并行的模组加载器。

### API 差异
- NeoForge 在 1.20.2 之后开始对 API 进行重大调整
- 事件系统、注册机制等核心功能有所变化
- 模组开发者需要针对不同加载器进行适配

### 如何选择
- 如果使用较新版本的 Minecraft（1.20.2+），建议优先考虑 NeoForge
- 如果需要使用仅支持 Forge 的老模组，则需要使用 Forge
- 部分模组同时支持两个加载器，可根据其他模组的兼容性决定

## 支持版本

NeoForge 从 Minecraft 1.20.1 开始提供支持，主要版本包括：

| Minecraft 版本 | NeoForge 版本 | 状态 |
|---------------|---------------|------|
| 1.21.11 | 21.11.x | 最新稳定版 |
| 1.21.9 | 21.9.x | 稳定版 |
| 1.21.6 | 21.6.x | 稳定版 |
| 1.20.4 | 20.4.x | 稳定版 |
| 1.20.2 | 20.2.x | 稳定版 |
| 1.20.1 | 47.1.x | 稳定版 |

> 注意：NeoForge 版本号与 Minecraft 版本对应，如 21.11 对应 Minecraft 1.21.11。

## 下载方式

### 官方网站
- 官网：https://neoforged.net/
- 下载页面：https://neoforged.net/releases/

### 下载步骤
1. 访问 NeoForge 官网
2. 在页面中找到 "NeoForge installer files" 部分
3. 选择对应的 Minecraft 版本
4. 点击 "Download Installer" 下载安装器（.jar 文件）

### 其他下载源
- GitHub Releases：https://github.com/neoforged/NeoForge/releases
- Maven 仓库（开发者使用）

## 安装步骤

### 前置要求
- Java 21 或更高版本（Minecraft 1.20.5+ 需要）
- Java 17（Minecraft 1.20.1-1.20.4）
- 已安装对应版本的原版 Minecraft

### Windows 安装

1. **确认 Java 环境**
   ```
   java -version
   ```
   确保输出显示 Java 21 或更高版本。

2. **下载安装器**
   从官网下载对应版本的 NeoForge 安装器（.jar 文件）。

3. **运行安装器**
   双击下载的 .jar 文件，或在命令行中执行：
   ```
   java -jar neoforge-<版本>-installer.jar
   ```

4. **选择安装类型**
   - Install client：安装客户端（单人游戏/联机）
   - Install server：安装服务端

5. **选择游戏目录**
   默认为 `%APPDATA%\.minecraft`，通常无需修改。

6. **完成安装**
   点击 "OK" 开始安装，等待完成。

7. **启动游戏**
   打开 Minecraft 启动器，在配置文件中选择 NeoForge 版本启动。

### Linux 安装

1. **确认 Java 环境**
   ```bash
   java -version
   ```

2. **下载安装器**
   ```bash
   wget https://maven.neoforged.net/releases/net/neoforged/neoforge/<版本>/neoforge-<版本>-installer.jar
   ```

3. **运行安装器（图形界面）**
   ```bash
   java -jar neoforge-<版本>-installer.jar
   ```

4. **运行安装器（无图形界面/服务器）**
   ```bash
   java -jar neoforge-<版本>-installer.jar --installServer
   ```

5. **启动服务器**
   安装完成后，使用生成的启动脚本：
   ```bash
   ./run.sh
   ```
   或手动启动：
   ```bash
   java -jar neoforge-<版本>-server.jar
   ```

## 模组安装方法

### 客户端模组安装

1. **定位模组文件夹**
   - Windows：`%APPDATA%\.minecraft\mods`
   - Linux：`~/.minecraft/mods`
   - macOS：`~/Library/Application Support/minecraft/mods`

2. **下载模组**
   从以下平台下载 NeoForge 版本的模组：
   - CurseForge：https://www.curseforge.com/minecraft/mc-mods
   - Modrinth：https://modrinth.com/mods

3. **安装模组**
   将下载的 .jar 文件复制到 mods 文件夹中。

4. **启动游戏**
   使用 NeoForge 配置文件启动游戏，模组将自动加载。

### 服务端模组安装

1. **定位模组文件夹**
   服务器根目录下的 `mods` 文件夹。

2. **安装模组**
   将模组 .jar 文件复制到 mods 文件夹。

3. **重启服务器**
   重启服务器以加载新模组。

### 注意事项
- 确保模组版本与 NeoForge 版本匹配
- 确保模组是为 NeoForge 开发的，而非 Forge 或 Fabric
- 注意模组之间的依赖关系

## 常见问题

### 安装器无法运行
**问题**：双击 .jar 文件没有反应。

**解决方案**：
1. 确认已安装 Java 并配置环境变量
2. 使用命令行运行：`java -jar 安装器文件名.jar`
3. 检查 .jar 文件关联是否正确

### 游戏启动崩溃
**问题**：安装后启动游戏立即崩溃。

**解决方案**：
1. 检查 Java 版本是否符合要求
2. 确认已运行过对应版本的原版 Minecraft
3. 查看崩溃日志（logs/latest.log）获取详细信息
4. 尝试移除所有模组后启动

### 模组不加载
**问题**：模组放入 mods 文件夹后不生效。

**解决方案**：
1. 确认模组版本与 NeoForge 版本匹配
2. 确认模组是 NeoForge 版本而非 Forge/Fabric 版本
3. 检查是否缺少前置模组
4. 查看日志文件获取错误信息

### Forge 模组能否在 NeoForge 上运行
**问题**：已有的 Forge 模组能否直接使用。

**解决方案**：
- 1.20.1 版本：大部分 Forge 模组可以直接使用
- 1.20.2+ 版本：需要使用专门为 NeoForge 开发的模组
- 建议在模组下载页面确认支持的加载器类型

### 服务器无法启动
**问题**：服务端安装后无法启动。

**解决方案**：
1. 确认 Java 版本正确
2. 检查是否有足够的内存分配
3. 查看服务器日志获取错误信息
4. 确认 eula.txt 中已同意 EULA（`eula=true`）
