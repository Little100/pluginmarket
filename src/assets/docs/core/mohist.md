# Mohist

## 概述

Mohist 是一款 Minecraft 混合服务端软件，能够同时支持 Forge 模组和 Bukkit/Spigot/Paper 插件。这意味着服务器管理员可以在同一个服务器上同时运行模组和插件，为玩家提供更丰富的游戏体验。

Mohist 由 MohistMC 团队开发，项目中有较多国内开发者参与，因此在中文社区有一定的用户基础。

> **重要提示**：Mohist 项目已于 2025 年 1 月出售所有权，目前处于维护停止状态（EOL），不再接受核心功能反馈。现有版本仍可下载使用，但不会有新的更新。MohistMC 团队现推荐使用 **Youer**（基于 NeoForge + Paper/Purpur API）作为替代方案。

## 特点

- **模组与插件共存**：同时加载 Forge 模组和 Bukkit/Spigot/Paper 插件
- **基于 Forge + Paper**：底层使用 Forge 加载模组，同时实现 Paper API 以支持插件
- **多版本支持**：支持多个 Minecraft 版本
- **国内社区活跃**：国内开发者参与较多，中文文档和社区支持相对完善

## 重要注意事项

### 兼容性问题

混合服务端的本质是将两个不同的生态系统强行结合，因此存在以下风险：

1. **模组与插件冲突**：某些模组和插件可能会因为修改了相同的游戏机制而产生冲突
2. **API 不完全兼容**：部分依赖特定 API 实现的插件可能无法正常工作
3. **事件处理差异**：Forge 和 Bukkit 的事件系统不同，可能导致某些功能异常

### 性能考量

- 混合端的性能通常不如纯插件端（如 Paper）或纯模组端（如 Forge/Fabric）
- 同时加载模组和插件会增加内存占用和 CPU 负载
- 建议为服务器分配更多内存资源

### 稳定性说明

- Forge 官方不支持混合型服务端
- 部分社区反馈 Mohist 在某些场景下可能不够稳定
- 不建议用于大型生产环境服务器

## 支持版本

Mohist 支持以下 Minecraft 版本（截至项目停止更新）：

| Minecraft 版本 | Forge 版本 | 状态 |
|---------------|-----------|------|
| 1.20.1 | Forge 47.4.13 / NeoForge 47.1.106 | 最新支持版本 |
| 1.19.2 | - | 可用 |
| 1.18.2 | - | 可用 |
| 1.16.5 | - | 可用 |
| 1.12.2 | - | 可用 |

> 注意：由于项目已停止更新，不会有更新版本的 Minecraft 支持。

## 下载方式

### 官网下载

访问 MohistMC 官方下载页面：

- 下载地址：https://mohistmc.com/downloadSoftware?project=mohist
- 选择对应的 Minecraft 版本
- 下载最新的构建版本
- 页面提供 SHA256 校验值用于验证文件完整性

### GitHub 下载

- 原仓库：https://github.com/MohistMC/Mohist（已转移）
- 新仓库：https://github.com/Rz-C/Mohist

### 命令行下载

```bash
# 下载指定版本的最新构建（将 [版本] 替换为实际版本号，如 1.20.1）
wget https://mohistmc.com/api/v2/projects/mohist/[版本]/builds/latest/download
```

## 安装步骤

### 1. 环境准备

- 确保已安装 Java 21 或更高版本（Minecraft 1.17+ 需要）
- 准备足够的服务器内存（建议至少 4GB）

### 2. 下载服务端

从官网下载对应版本的 Mohist JAR 文件。

### 3. 创建服务器目录

```bash
mkdir mohist-server
cd mohist-server
```

### 4. 放置服务端文件

将下载的 JAR 文件移动到服务器目录中。

### 5. 首次启动

```bash
java -Xmx4G -jar mohist-1.20.1-xxx.jar nogui
```

### 6. 同意 EULA

首次启动后，编辑生成的 `eula.txt` 文件，将 `eula=false` 改为 `eula=true`。

### 7. 再次启动

```bash
java -Xmx4G -jar mohist-1.20.1-xxx.jar nogui
```

## 模组与插件共存注意事项

### 安装模组

将模组文件（.jar）放入服务器目录下的 `mods` 文件夹中。

### 安装插件

将插件文件（.jar）放入服务器目录下的 `plugins` 文件夹中。

### 兼容性建议

1. **逐个测试**：每次只添加一个模组或插件，确认无冲突后再添加下一个
2. **查看日志**：启动时仔细查看控制台日志，注意任何错误或警告信息
3. **避免功能重叠**：不要同时使用功能相似的模组和插件
4. **版本匹配**：确保模组和插件版本与服务端版本兼容
5. **备份存档**：在添加新模组或插件前，务必备份世界存档

### 已知不兼容情况

- 某些保护类插件可能与模组的方块/物品交互产生冲突
- 经济类插件可能无法正确识别模组物品
- 部分权限插件可能无法控制模组相关权限

## 常见问题

### Q: 服务器启动失败，提示 Java 版本错误

A: Mohist 1.17+ 版本需要 Java 17 或更高版本，1.20+ 版本建议使用 Java 21。请检查并更新 Java 版本。

### Q: 某个插件无法正常工作

A: 混合端对插件的兼容性不如纯 Paper 服务端。尝试以下步骤：
1. 检查插件是否有专门的 Mohist 兼容版本
2. 查看服务器日志中的错误信息
3. 在 Mohist 社区或插件作者处寻求帮助

### Q: 模组加载后服务器崩溃

A: 可能的原因：
1. 模组版本与 Minecraft/Forge 版本不匹配
2. 模组之间存在冲突
3. 模组与 Mohist 不兼容

建议逐个排查模组，找出问题所在。

### Q: 服务器内存占用过高

A: 混合端本身内存占用较高，建议：
1. 增加服务器内存分配
2. 减少不必要的模组和插件
3. 使用 JVM 优化参数

### Q: Mohist 还会继续更新吗？

A: 不会。Mohist 项目已于 2025 年 1 月出售并停止更新。如需使用支持新版本 Minecraft 的混合端，可以考虑 MohistMC 团队推出的 Youer 项目。

## 相关链接

- 官方网站：https://mohistmc.com
- 官方文档：https://mohistmc.com/mohist/docs
- 下载页面：https://mohistmc.com/downloadSoftware?project=mohist
- Youer（替代项目）：https://mohistmc.com/downloadSoftware?project=youer
