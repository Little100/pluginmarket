# Pufferfish

## 概述

Pufferfish 是基于 Paper 开发的高性能 Minecraft 服务端软件，专为大型服务器和高玩家数量场景设计。它在 Paper 的基础上进行了进一步的性能优化，特别是在实体处理、区块加载和服务器 tick 等方面。Pufferfish 由 pufferfish.host 团队维护，完全兼容 Bukkit/Spigot/Paper 插件生态系统。

## 特点

- **深度性能优化**：在 Paper 基础上进一步优化实体处理、区块加载、漏斗运算等核心系统，显著提升高负载场景下的服务器性能
- **DAB（Dynamic Activation of Brain）**：动态激活大脑系统，根据实体与玩家的距离动态调整实体 AI 的更新频率，大幅降低实体 AI 计算开销
- **异步怪物生成**：将怪物生成逻辑移至异步线程执行，减少主线程负担
- **优化的漏斗系统**：改进漏斗物品传输逻辑，降低漏斗密集区域的性能消耗
- **完全兼容 Bukkit/Spigot/Paper 插件**：所有为 Bukkit、Spigot 或 Paper 编写的插件都可以在 Pufferfish 上正常运行
- **适合高玩家数量服务器**：专为 100+ 玩家同时在线的大型服务器优化
- **持续更新维护**：紧跟 Paper 上游更新，定期合并最新优化和安全补丁

## 支持版本

Pufferfish 支持 Minecraft 1.18 至最新版本。当前支持的主要版本包括：

- **1.21.x**（最新，Build #39，更新于 2025 年 12 月）
- **1.20.4**
- **1.19.4**
- **1.18.2**

建议使用最新版本以获得最佳性能和安全性。

## 下载方式

### 官网下载

访问 Pufferfish 官方下载页面：

```
https://pufferfish.host/downloads
```

页面会显示所有支持的 Minecraft 版本，选择对应版本后点击下载按钮即可获取 jar 文件。

### CI 构建下载

Pufferfish 提供持续集成构建服务，可获取最新开发版本：

```
https://ci.pufferfish.host/
```

选择对应版本的构建任务（如 `Pufferfish-1.21`），点击最新成功的构建号，在 Artifacts 中下载 jar 文件。

### GitHub 仓库

Pufferfish 源代码托管在 GitHub：

```
https://github.com/pufferfish-gg/Pufferfish
```

可从 Releases 页面下载稳定版本，或克隆仓库自行编译。

### Pufferfish+

Pufferfish+ 是增强版本，包含额外的性能优化。该版本仅对 pufferfish.host 托管服务的客户免费提供，或可单独购买。

## 安装步骤

Pufferfish 的安装过程与 Paper 基本相同。

### 准备工作

- 确保已安装 Java 21 或更高版本（Minecraft 1.20.5+ 需要 Java 21）
- 准备至少 4GB 可用内存（大型服务器推荐 8GB 以上）

### 安装流程

1. **创建服务器目录**

   创建一个新文件夹用于存放服务器文件

2. **下载 Pufferfish**

   从官网下载对应版本的 jar 文件，放入服务器目录，重命名为 `pufferfish.jar`

3. **创建启动脚本**

   Windows（`start.bat`）：
   ```batch
   @echo off
   java -Xms4G -Xmx4G -jar pufferfish.jar --nogui
   pause
   ```

   Linux（`start.sh`）：
   ```bash
   #!/bin/bash
   java -Xms4G -Xmx4G -jar pufferfish.jar --nogui
   ```

4. **首次启动**

   运行启动脚本，服务器会生成配置文件后自动停止

5. **同意 EULA**

   打开 `eula.txt` 文件，将 `eula=false` 改为 `eula=true`

6. **再次启动**

   再次运行启动脚本，服务器将正常启动

### 从 Paper 迁移

从 Paper 迁移到 Pufferfish 非常简单：

1. 停止当前服务器
2. 备份整个服务器目录
3. 将 Paper 的 jar 文件替换为 Pufferfish 的 jar 文件
4. 启动服务器

Pufferfish 会自动读取现有的配置文件和世界数据，并生成 Pufferfish 特有的配置文件。

## pufferfish.yml 关键配置

Pufferfish 会在服务器目录生成 `pufferfish.yml` 配置文件，包含 Pufferfish 特有的优化选项。

### DAB（动态激活大脑）配置

```yaml
dab:
  enabled: true                    # 是否启用 DAB 系统
  start-distance: 12               # 开始降低 AI 更新频率的距离
  max-tick-freq: 20                # 最大 tick 间隔（距离最远时）
  activation-dist-mod: 8           # 激活距离修正值
```

DAB 系统会根据实体与最近玩家的距离动态调整实体 AI 的更新频率。距离越远，更新频率越低，从而节省大量计算资源。

### 实体优化配置

```yaml
entity:
  max-loads-per-projectile: 8      # 每个投射物最大加载区块数
```

### 其他优化配置

```yaml
misc:
  disable-method-profiler: true    # 禁用方法分析器以提升性能
  disable-out-of-order-chat: false # 是否禁用乱序聊天检测
```

### 推荐配置

对于高玩家数量服务器，建议：

- 保持 DAB 系统启用
- 根据服务器规模调整 `start-distance`，玩家越多可适当降低
- 配合 Paper 和 Spigot 的优化配置使用

## 适用场景

Pufferfish 特别适合以下场景：

- **大型生存服务器**：100+ 玩家同时在线的生存服务器
- **小游戏服务器**：需要处理大量实体和玩家的小游戏服务器
- **RPG 服务器**：包含大量自定义怪物和 NPC 的 RPG 服务器
- **高性能需求场景**：对 TPS 稳定性有严格要求的服务器
- **资源受限环境**：需要在有限硬件资源下支持更多玩家

对于小型服务器（20 人以下），Paper 通常已经足够，Pufferfish 的优势在高负载场景下更为明显。

## 常见问题

### Pufferfish 和 Paper 有什么区别？

Pufferfish 基于 Paper 开发，包含 Paper 的所有功能和优化。主要区别在于 Pufferfish 针对高玩家数量场景进行了额外优化，特别是 DAB 系统可以显著降低实体 AI 的计算开销。对于小型服务器，两者差异不大；对于大型服务器，Pufferfish 可以提供更好的性能。

### 我的 Paper 插件能在 Pufferfish 上运行吗？

可以。Pufferfish 完全兼容 Bukkit、Spigot 和 Paper 插件。所有在 Paper 上正常运行的插件都可以在 Pufferfish 上使用。

### DAB 系统会影响游戏体验吗？

DAB 系统通过降低远距离实体的 AI 更新频率来节省性能。在正常游戏中，玩家通常不会注意到这种变化，因为远距离的实体行为本身就不太引人注目。如果发现特定场景下有问题，可以在配置文件中调整 DAB 参数或禁用该功能。

### 如何从 Pufferfish 回退到 Paper？

1. 停止服务器
2. 将 Pufferfish jar 文件替换为 Paper jar 文件
3. 启动服务器

世界数据和大部分配置都是兼容的，`pufferfish.yml` 配置文件会被忽略。

### 服务器启动失败，提示找不到类

确保下载的是正确版本的 Pufferfish。Pufferfish 的版本需要与 Minecraft 版本匹配。同时确保使用了正确版本的 Java（1.20.5+ 需要 Java 21）。

### 如何获取 Pufferfish+ ？

Pufferfish+ 是增强版本，包含额外的优化。可以通过以下方式获取：

1. 成为 pufferfish.host 托管服务的客户（免费获得）
2. 单独购买 Pufferfish+ 许可证

### 在哪里获取帮助？

- 官方 Discord 服务器
- GitHub Issues 页面
- pufferfish.host 知识库
