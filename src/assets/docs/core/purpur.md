# Purpur

## 概述

Purpur 是基于 Paper 的高度可定制 Minecraft 插件服务端。它在继承 Paper 全部性能优化的基础上，提供了大量额外的配置选项，允许服务器管理员自定义几乎所有的游戏机制。Purpur 的名称来源于紫珀块（Purpur Block），体现了其在 Paper 基础上的进一步扩展。

Purpur 的核心理念是"让服务器管理员拥有更多控制权"。通过 `purpur.yml` 配置文件，你可以调整原版 Minecraft 中无法修改的行为，例如让玩家骑乘各种生物、修改 TNT 的爆炸行为、调整生物的 AI 等。

## 特点

### 继承 Paper 的所有优化
- 包含 Paper 的全部性能改进和 Bug 修复
- 异步区块加载和保存
- 优化的实体 AI 和红石系统
- 反作弊和安全性增强

### 大量可配置选项
- 通过 `purpur.yml` 提供数百个配置项
- 可以精细控制几乎所有游戏机制
- 支持按世界单独配置

### 自定义原版行为
- 允许玩家骑乘各种生物（海豚、末影龙等）
- 自定义 TNT 爆炸范围和行为
- 修改生物生成规则和 AI 行为
- 调整方块交互和物品属性

### 完全兼容
- 兼容所有 Bukkit 插件
- 兼容所有 Spigot 插件
- 兼容所有 Paper 插件
- 无需修改现有插件即可使用

## 支持版本

Purpur 支持 Minecraft 1.14.x 至最新版本。当前最新支持版本为 **1.21.11**（构建号 2561，2026 年 2 月）。

建议始终使用与你的 Minecraft 版本对应的最新 Purpur 构建，以获得最佳性能和最新的 Bug 修复。

## 下载方式

### 官网下载

访问 Purpur 官方下载页面：

```
https://purpurmc.org/download/purpur
```

在页面中选择你需要的 Minecraft 版本，然后点击下载最新构建。

### API 下载

Purpur 提供 API 接口用于自动化下载：

下载最新版本：
```
https://api.purpurmc.org/v2/purpur/<MC版本>/latest/download
```

示例（下载 1.21.11 最新版）：
```
https://api.purpurmc.org/v2/purpur/1.21.11/latest/download
```

下载指定构建：
```
https://api.purpurmc.org/v2/purpur/<MC版本>/<构建号>/download
```

> **安全提示**：请仅从官方网站 purpurmc.org 或官方 API 下载 Purpur，避免使用第三方下载站点。

## 安装步骤

Purpur 的安装方式与 Paper 完全相同。

### Windows

1. 确保已安装 Java 21 或更高版本
2. 创建一个新文件夹作为服务器目录
3. 将下载的 `purpur-<版本>.jar` 放入该文件夹
4. 创建启动脚本 `start.bat`：
   ```batch
   @echo off
   java -Xms2G -Xmx2G -jar purpur-1.21.11.jar nogui
   pause
   ```
5. 双击运行 `start.bat`
6. 首次运行后，编辑 `eula.txt`，将 `eula=false` 改为 `eula=true`
7. 再次运行 `start.bat` 启动服务器

### Linux

1. 确保已安装 Java 21 或更高版本
2. 创建服务器目录并进入：
   ```bash
   mkdir minecraft-server && cd minecraft-server
   ```
3. 下载 Purpur：
   ```bash
   wget -O purpur.jar https://api.purpurmc.org/v2/purpur/1.21.11/latest/download
   ```
4. 创建启动脚本 `start.sh`：
   ```bash
   #!/bin/bash
   java -Xms2G -Xmx2G -jar purpur.jar nogui
   ```
5. 添加执行权限并运行：
   ```bash
   chmod +x start.sh
   ./start.sh
   ```
6. 首次运行后，编辑 `eula.txt`，将 `eula=false` 改为 `eula=true`
7. 再次运行 `./start.sh` 启动服务器

## purpur.yml 亮点配置

Purpur 的核心特色在于 `purpur.yml` 配置文件，以下是一些有趣的配置项：

### 生物骑乘
```yaml
mobs:
  dolphin:
    ridable: true           # 允许骑乘海豚
    ridable-in-water: true  # 允许在水中骑乘
  ender_dragon:
    ridable: true           # 允许骑乘末影龙
```

### TNT 行为
```yaml
blocks:
  tnt:
    defuse-by-breaking-when-lit: true  # 点燃后可通过破坏来拆除
    explosion-power: 4.0               # 爆炸威力
```

### 村民优化
```yaml
mobs:
  villager:
    brain-ticks: 1                    # AI 计算频率
    lobotomize:
      enabled: true                   # 启用简化 AI（提升性能）
```

### 末影人行为
```yaml
mobs:
  enderman:
    can-grief: false                  # 禁止末影人搬运方块
```

### 幻翼控制
```yaml
mobs:
  phantom:
    spawn:
      only-above-sea-level: true      # 仅在海平面以上生成
      only-with-visible-sky: true     # 仅在露天生成
```

### 耕地保护
```yaml
blocks:
  farmland:
    disable-trampling: true           # 禁止踩踏耕地
```

完整配置项列表请参考官方文档：https://purpurmc.org/docs/purpur/configuration

## 从 Paper 迁移到 Purpur

从 Paper 迁移到 Purpur 非常简单：

1. 停止当前运行的 Paper 服务器
2. 备份服务器文件（推荐）
3. 下载对应版本的 Purpur jar 文件
4. 用 Purpur jar 替换原来的 Paper jar
5. 更新启动脚本中的 jar 文件名（如有需要）
6. 启动服务器

Purpur 会自动读取现有的 Paper 配置，并生成新的 `purpur.yml` 配置文件。所有现有的插件、世界数据和配置都会保持不变。

## 常见问题

### Purpur 和 Paper 有什么区别？

Paper 专注于性能优化和 Bug 修复，而 Purpur 在此基础上增加了大量可配置选项。如果你只需要性能优化，Paper 已经足够；如果你想要更多自定义能力，Purpur 是更好的选择。

### Purpur 会影响服务器性能吗？

Purpur 继承了 Paper 的所有优化，默认配置下性能与 Paper 相当。某些配置项（如生物骑乘）可能会略微增加服务器负载，但影响通常可以忽略。

### 我的 Paper 插件能在 Purpur 上运行吗？

可以。Purpur 完全兼容所有 Bukkit、Spigot 和 Paper 插件，无需任何修改。

### purpur.yml 配置修改后需要重启服务器吗？

大部分配置修改后需要重启服务器才能生效。少数配置支持热重载，可以使用 `/purpur reload` 命令。

### 如何获取 Purpur 的技术支持？

- 官方 Discord：https://purpurmc.org/discord
- GitHub Issues：https://github.com/PurpurMC/Purpur/issues
- 官方文档：https://purpurmc.org/docs

### Purpur 支持 Folia 吗？

Purpur 目前不支持 Folia 的多线程区域化特性。如果你需要 Folia 的功能，请直接使用 Folia。
