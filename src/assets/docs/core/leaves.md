# Leaves 服务端

## 概述

Leaves 是由 LeavesMC 团队开发维护的 Minecraft 服务端核心，基于 Paper 进行二次开发。该项目由国内开发者主导，专注于为生电（技术向）玩家提供更友好的游戏体验。Leaves 在继承 Paper 全部优化的基础上，修复了大量原版机制问题，并提供了丰富的可配置选项，使服务器管理员能够根据需求精细调整服务器行为。

## 特点

### 继承 Paper 优化
- 完全兼容 Bukkit/Spigot/Paper 插件生态
- 继承 Paper 的所有性能优化和安全修复
- 保持与上游 Paper 的同步更新

### 生电/技术向友好
- 提供大量针对生电玩法的配置选项
- 修复了 Paper 中被认为是"特性"但影响生电玩法的行为
- 支持更精确的红石机制控制
- 优化了实体寻路等原版机制

### 假人（Fakeplayer）功能
- 内置假人系统，无需额外安装 Carpet 模组
- 支持通过命令创建和管理假人
- 假人可执行基本操作，用于挂机、测试等场景

### 国内社区支持
- 中文文档和社区支持
- 国内开发者维护，响应及时
- 活跃的用户社区和技术交流

## 支持版本

Leaves 支持 Minecraft 1.17.1 及以上版本：

| 版本分支 | 状态 | 说明 |
|---------|------|------|
| 1.21.x | 稳定版 | 当前主要维护版本 |
| 1.20.x | 维护中 | 长期支持版本 |
| 1.19.x | 停止更新 | 仅安全修复 |
| 1.18.x | 停止更新 | 不再维护 |
| 1.17.x | 停止更新 | 不再维护 |

> 建议使用最新稳定版本以获得最佳体验和安全性。

## 下载方式

### 官方下载（推荐）

访问 LeavesMC 官方下载页面：
- **官网下载**：https://leavesmc.org/downloads/leaves
- 选择对应的 Minecraft 版本
- 点击构建号即可下载 JAR 文件

### GitHub 下载

访问 GitHub Releases 页面：
- **GitHub**：https://github.com/LeavesMC/Leaves/releases
- 下载最新版本的 JAR 文件

## 安装步骤

### 环境要求

- Java 21 或更高版本（Minecraft 1.17.1+ 要求）
- 足够的内存（建议至少 4GB）

### 安装流程

1. **下载服务端**
   
   从官网或 GitHub 下载最新版本的 `leaves-*.jar` 文件。

2. **创建服务器目录**
   
   创建一个新文件夹作为服务器根目录，将下载的 JAR 文件放入其中。

3. **首次启动**
   
   ```bash
   java -Xmx4G -Xms4G -jar leaves-1.21.jar --nogui
   ```

4. **同意 EULA**
   
   首次启动后，编辑生成的 `eula.txt` 文件，将 `eula=false` 改为 `eula=true`。

5. **再次启动**
   
   再次运行启动命令，服务器将正常启动并生成世界。

### 启动脚本示例

**Windows (start.bat)**：
```batch
@echo off
java -Xmx4G -Xms4G -jar leaves-1.21.jar --nogui
pause
```

**Linux/macOS (start.sh)**：
```bash
#!/bin/bash
java -Xmx4G -Xms4G -jar leaves-1.21.jar --nogui
```

## leaves.yml 关键配置

Leaves 的核心配置文件为 `leaves.yml`，位于服务器根目录。以下是一些重要的生电相关配置项：

### 假人设置

```yaml
fakeplayer:
  enable: true                    # 启用假人功能
  unable-fakeplayer-names:        # 禁止使用的假人名称
    - player
  limit: 10                       # 单个玩家可创建的假人数量上限
  always-send-data: true          # 始终向客户端发送假人数据
  resident-fakeplayer: false      # 假人是否为常驻（服务器重启后保留）
  open-fakeplayer-inventory: true # 允许打开假人背包
  skip-sleep-check: true          # 假人不计入睡眠检测
  spawn-phantom: false            # 假人是否生成幻翼
```

### 原版机制修复

```yaml
fixes:
  fix-paper-6045: true            # 修复 Paper #6045 问题
  fix-paper-9372: true            # 修复 Paper #9372 问题
  disable-check-out-of-order-command: true  # 禁用命令顺序检查
```

### 性能优化

```yaml
performance:
  remove-tick-guard-lambda: true  # 移除 tick 守卫 lambda
  remove-stream-for-entity-collision: true  # 优化实体碰撞检测
  reduce-entity-allocations: true # 减少实体内存分配
  optimize-suffocation-check: true # 优化窒息检测
```

### 协议支持

```yaml
protocol:
  bladeren:
    enable: true                  # 启用 Bladeren 协议
    mspt-sync-protocol: true      # MSPT 同步协议
    mspt-sync-tick-interval: 20   # 同步间隔
  syncmatica:
    enable: true                  # 启用 Syncmatica 协议（投影同步）
    quota: false                  # 是否启用配额限制
    quota-limit: 40000000         # 配额限制大小
  pca-sync-protocol: true         # PCA 同步协议
  pca-sync-player-entity: OPS     # 同步玩家实体权限
  bbor-protocol: true             # BBOR 协议支持
  jade-protocol: true             # Jade 协议支持
```

### 杂项设置

```yaml
misc:
  auto-update:
    enable: false                 # 自动更新
  extra-yggdrasil-service:
    enable: false                 # 额外的 Yggdrasil 验证服务
  disable-method-profiler: true   # 禁用方法分析器
  no-chat-sign: true              # 禁用聊天签名
  dont-respond-ping-before-start-fully: true  # 完全启动前不响应 ping
```

## 适用场景

Leaves 特别适合以下类型的服务器：

### 生电服务器
- 需要精确的红石机制
- 需要假人功能进行挂机
- 需要修复影响生电玩法的 Bug

### 技术向服务器
- 需要与 Litematica、Syncmatica 等模组配合
- 需要 BBOR、Jade 等协议支持
- 需要精细控制服务器行为

### 小型社区服务器
- 需要稳定的性能表现
- 需要丰富的配置选项
- 需要中文社区支持

## 常见问题

### Q: Leaves 和 Paper 有什么区别？

A: Leaves 基于 Paper 开发，继承了 Paper 的所有优化。主要区别在于 Leaves 提供了更多针对生电玩法的配置选项，内置假人功能，并修复了一些 Paper 中影响生电玩法的问题。

### Q: Leaves 支持哪些插件？

A: Leaves 完全兼容 Bukkit、Spigot 和 Paper 插件。所有能在 Paper 上运行的插件都可以在 Leaves 上使用。

### Q: 如何从 Paper 迁移到 Leaves？

A: 迁移非常简单：
1. 备份服务器数据
2. 下载对应版本的 Leaves JAR 文件
3. 替换原有的 Paper JAR 文件
4. 启动服务器，Leaves 会自动生成 `leaves.yml` 配置文件
5. 根据需要调整配置

### Q: 假人功能如何使用？

A: 在 `leaves.yml` 中启用假人功能后，使用以下命令：
- `/player <名称> spawn` - 创建假人
- `/player <名称> kill` - 移除假人
- `/player <名称> <动作>` - 让假人执行动作

### Q: Leaves 的更新频率如何？

A: Leaves 团队会跟随 Paper 的更新进行同步，通常在 Paper 发布新版本后的短时间内发布对应的 Leaves 版本。建议关注官方 GitHub 或加入社区获取更新通知。

### Q: 服务器启动报错怎么办？

A: 常见解决方案：
1. 确认 Java 版本是否为 21 或更高
2. 检查是否有足够的内存分配
3. 查看服务器日志中的具体错误信息
4. 在 LeavesMC 社区或 GitHub Issues 中寻求帮助

## 相关链接

- 官方网站：https://leavesmc.org
- GitHub 仓库：https://github.com/LeavesMC/Leaves
- 下载页面：https://leavesmc.org/downloads/leaves
- 文档：https://docs.leavesmc.org
