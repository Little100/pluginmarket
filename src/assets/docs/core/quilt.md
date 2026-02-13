# Quilt

## 概述

Quilt 是一个开源的 Minecraft 模组加载器，于 2021 年从 Fabric 项目分裂而来。Quilt 的创建目标是提供更好的社区治理、更强的模组兼容性，以及更包容的开发环境。作为 Fabric 的分支项目，Quilt 保持了与大部分 Fabric 模组的兼容性，同时引入了自己的标准库和改进功能。

Quilt 项目由社区驱动，强调透明的决策过程和包容性的社区文化。虽然相比 Fabric 生态规模较小，但 Quilt 正在稳步发展中。

## 特点

### 从 Fabric 分裂而来

Quilt 最初是 Fabric 项目的一部分，后因社区治理理念的分歧而独立。Quilt 继承了 Fabric 的轻量级设计理念，同时在此基础上进行了改进和扩展。

### 兼容大部分 Fabric 模组

Quilt 的一大优势是能够运行大部分 Fabric 模组。通过 Quilted Fabric API（QFAPI），玩家可以在 Quilt 环境中使用绝大多数为 Fabric 开发的模组，无需等待模组作者专门适配。

### 更注重社区治理和包容性

Quilt 项目采用更加透明和民主的治理模式，强调社区成员的参与和包容性。项目设有明确的行为准则，致力于创建一个友好、安全的开发和使用环境。

### 提供 Quilt Standard Libraries (QSL)

Quilt 开发了自己的标准库 QSL（Quilt Standard Libraries），为模组开发者提供统一的 API 和工具。QSL 在 Fabric API 的基础上进行了扩展和改进，提供了更多功能和更好的开发体验。

### 仍在发展中，生态相对较小

作为较新的项目，Quilt 的生态系统仍在建设中。虽然可以使用大部分 Fabric 模组，但专门为 Quilt 开发的原生模组数量相对有限。随着项目的发展，这一情况正在逐步改善。

## 与 Fabric 的关系和区别

| 方面 | Quilt | Fabric |
|------|-------|--------|
| 起源 | 从 Fabric 分裂 | 原始项目 |
| 模组兼容性 | 兼容大部分 Fabric 模组 | 仅支持 Fabric 模组 |
| 标准库 | QSL + QFAPI | Fabric API |
| 社区治理 | 更强调透明和包容 | 传统治理模式 |
| 生态规模 | 较小但在增长 | 成熟且庞大 |
| 更新速度 | 较快 | 非常快 |

选择建议：
- 如果追求最大的模组兼容性和成熟生态，选择 Fabric
- 如果认同 Quilt 的社区理念或需要 QSL 特有功能，选择 Quilt
- 大部分情况下，两者的使用体验差异不大

## 支持版本

Quilt 支持多个 Minecraft 版本，包括：

- Minecraft 1.14 及以上版本
- 最新的正式版和快照版本
- 安装时可在安装器中选择具体版本

Quilt Loader 最新版本：0.29.3（截至 2026 年 2 月）

## 下载方式

### 官方网站

访问 Quilt 官方网站下载安装器：

**官网地址**：https://quiltmc.org/

### 安装器下载

**客户端安装器**：https://quiltmc.org/en/install/client

- Universal JAR（适用于任何有 Java 17+ 的系统）：
  https://quiltmc.org/api/v1/download-latest-installer/java-universal
- Windows EXE：
  https://quiltmc.org/api/v1/download-latest-installer/windows-x86_64

**服务器安装器**：https://quiltmc.org/en/install/server

### 第三方启动器

以下启动器内置 Quilt 支持，无需单独下载安装器：

- Prism Launcher
- CurseForge App
- MultiMC
- ATLauncher

## 安装步骤

### 客户端安装

1. **准备工作**
   - 确保已安装 Java 17 或更高版本
   - 下载并安装官方 Minecraft 启动器

2. **下载安装器**
   - 访问 https://quiltmc.org/en/install/client
   - 下载 Universal JAR 或 Windows EXE

3. **运行安装器**
   - 双击运行下载的安装器
   - 选择 "Client" 标签页
   - 选择要安装的 Minecraft 版本
   - 选择 Quilt Loader 版本（推荐使用最新稳定版）
   - 点击 "Install" 按钮

4. **启动游戏**
   - 打开 Minecraft 启动器
   - 在 "Installations" 标签页找到新创建的 Quilt 配置
   - 选择该配置并启动游戏

5. **安装模组**
   - 打开游戏目录下的 `mods` 文件夹
   - 将模组文件（.jar）放入该文件夹
   - 建议安装 Quilted Fabric API（QFAPI）以获得最佳兼容性

### 服务器安装

1. 下载 Quilt 安装器
2. 运行安装器，选择 "Server" 标签页
3. 选择 Minecraft 版本和安装位置
4. 点击 "Install" 下载服务器文件
5. 运行生成的服务器启动脚本

## 模组兼容性

### 可在 Quilt 上运行的模组

1. **Quilt 原生模组**
   - 专门为 Quilt 开发的模组
   - 可充分利用 QSL 的功能

2. **Fabric 模组**
   - 大部分 Fabric 模组可直接在 Quilt 上运行
   - 需要安装 Quilted Fabric API（QFAPI）
   - 少数依赖 Fabric 特定功能的模组可能不兼容

### 不兼容的模组

- Forge 模组（完全不兼容）
- NeoForge 模组（完全不兼容）
- 部分使用 Fabric 内部 API 的模组

### 模组下载来源

- **Modrinth**：https://modrinth.com/ （推荐，支持筛选 Quilt 模组）
- **CurseForge**：https://www.curseforge.com/minecraft/mc-mods

## 常见问题

### Quilt 和 Fabric 哪个更好？

两者各有优势。Fabric 拥有更成熟的生态和更多模组选择；Quilt 提供更好的社区治理和一些独特功能。由于 Quilt 兼容大部分 Fabric 模组，实际使用体验差异不大。

### 为什么我的 Fabric 模组在 Quilt 上无法运行？

可能的原因：
1. 未安装 Quilted Fabric API（QFAPI）
2. 模组使用了 Fabric 的内部 API
3. 模组版本与 Minecraft 版本不匹配
4. 模组之间存在冲突

### 安装器提示需要 Java 17？

Quilt 安装器需要 Java 17 或更高版本。请从以下来源下载安装：
- Adoptium：https://adoptium.net/
- Oracle：https://www.oracle.com/java/technologies/downloads/

### 如何同时安装 QSL 和 QFAPI？

Quilted Fabric API（QFAPI）已包含 QSL，下载 QFAPI 即可同时获得两者的功能。从 Modrinth 或 CurseForge 搜索 "Quilted Fabric API" 下载。

### Quilt 的更新速度如何？

Quilt 团队积极维护项目，通常在 Minecraft 新版本发布后较快提供支持。但由于团队规模较小，更新速度可能略慢于 Fabric。

### 是否应该从 Fabric 迁移到 Quilt？

如果当前使用 Fabric 没有问题，不必强制迁移。如果认同 Quilt 的社区理念，或需要使用 Quilt 独有的功能，可以考虑迁移。迁移过程相对简单，大部分模组可以直接使用。
