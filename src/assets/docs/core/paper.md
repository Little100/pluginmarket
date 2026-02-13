# Paper

## 概述

Paper 是基于 Spigot 开发的高性能 Minecraft 服务端软件。它在 Spigot 的基础上进行了大量优化和改进，是目前 Minecraft 插件服务器最主流的选择。Paper 由活跃的开发团队维护，拥有庞大的用户社区，被广泛应用于各类规模的服务器。

## 特点

- **性能优化**：Paper 包含数百项针对原版和 Spigot 的性能优化，显著降低服务器资源占用，提升 TPS（每秒游戏刻数）稳定性
- **Bug 修复**：修复了大量原版 Minecraft 和 Spigot 中存在的问题，包括游戏机制漏洞和安全隐患
- **完全兼容 Bukkit/Spigot 插件**：几乎所有为 Bukkit 或 Spigot 编写的插件都可以在 Paper 上正常运行
- **异步区块加载**：区块加载操作在独立线程中执行，避免阻塞主线程，减少卡顿
- **Paper API**：在 Bukkit API 基础上提供了大量扩展接口，为插件开发者提供更多功能
- **活跃的社区和开发团队**：持续更新，快速响应新版本 Minecraft，定期发布安全补丁

## 支持版本

Paper 支持 Minecraft 1.8.8 至最新版本。当前最新稳定版本为 **Paper 1.21.11**（Build #113，发布于 2025 年 12 月）。

建议使用最新版本以获得最佳性能和安全性。旧版本仍可从官网下载，但不再接收更新。

## 下载方式

### 官网下载

访问 Paper 官方下载页面：

```
https://papermc.io/downloads/paper
```

页面会显示当前最新版本，点击下载按钮即可获取 jar 文件。

### API 下载（用于自动化）

Paper 提供 REST API 用于自动化下载：

```
https://api.papermc.io/v2/projects/paper
```

获取特定版本的构建列表：

```
https://api.papermc.io/v2/projects/paper/versions/1.21.11
```

下载特定构建：

```
https://api.papermc.io/v2/projects/paper/versions/1.21.11/builds/113/downloads/paper-1.21.11-113.jar
```

### 选择版本

1. 确定你需要的 Minecraft 版本
2. 在下载页面选择对应版本
3. 选择最新的构建号（Build Number），构建号越大表示越新
4. 下载对应的 jar 文件

## 安装步骤

### 准备工作

- 确保已安装 Java 21 或更高版本（Minecraft 1.20.5+ 需要 Java 21）
- 准备至少 2GB 可用内存（推荐 4GB 以上）

### Windows 安装

1. **创建服务器目录**

   在任意位置创建一个新文件夹，例如 `D:\minecraft-server`

2. **下载 Paper**

   从官网下载最新版本的 jar 文件，将其放入服务器目录，重命名为 `paper.jar`

3. **首次启动**

   在服务器目录中创建 `start.bat` 文件，内容如下：

   ```batch
   @echo off
   java -Xms2G -Xmx2G -jar paper.jar --nogui
   pause
   ```

   双击运行 `start.bat`，服务器会生成配置文件后自动停止

4. **同意 EULA**

   打开生成的 `eula.txt` 文件，将 `eula=false` 改为 `eula=true`

5. **再次启动**

   再次运行 `start.bat`，服务器将正常启动

### Linux 安装

1. **创建服务器目录**

   ```bash
   mkdir ~/minecraft-server
   cd ~/minecraft-server
   ```

2. **下载 Paper**

   ```bash
   wget https://api.papermc.io/v2/projects/paper/versions/1.21.11/builds/113/downloads/paper-1.21.11-113.jar -O paper.jar
   ```

3. **首次启动**

   ```bash
   java -Xms2G -Xmx2G -jar paper.jar --nogui
   ```

4. **同意 EULA**

   ```bash
   sed -i 's/eula=false/eula=true/g' eula.txt
   ```

5. **再次启动**

   ```bash
   java -Xms2G -Xmx2G -jar paper.jar --nogui
   ```

### 启动参数说明

- `-Xms2G`：设置初始内存为 2GB
- `-Xmx2G`：设置最大内存为 2GB
- `--nogui`：不启动图形界面，使用命令行模式

推荐的生产环境启动命令：

```bash
java -Xms4G -Xmx4G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -jar paper.jar --nogui
```

## 目录结构说明

首次启动后，服务器目录会生成以下文件和文件夹：

```
minecraft-server/
├── paper.jar              # 服务端核心文件
├── eula.txt               # EULA 协议文件
├── server.properties      # 服务器主配置文件
├── bukkit.yml             # Bukkit 配置文件
├── spigot.yml             # Spigot 配置文件
├── paper-global.yml       # Paper 全局配置文件
├── paper-world-defaults.yml # Paper 世界默认配置
├── commands.yml           # 命令别名配置
├── permissions.yml        # 权限配置（已弃用）
├── banned-ips.json        # IP 封禁列表
├── banned-players.json    # 玩家封禁列表
├── ops.json               # 管理员列表
├── whitelist.json         # 白名单
├── logs/                  # 日志文件夹
├── plugins/               # 插件文件夹
├── world/                 # 主世界数据
├── world_nether/          # 下界数据
├── world_the_end/         # 末地数据
├── cache/                 # 缓存文件夹
└── libraries/             # 依赖库文件夹
```

## 从其他服务端迁移到 Paper

### 从 Spigot 迁移

Spigot 迁移到 Paper 非常简单：

1. 停止当前服务器
2. 备份整个服务器目录
3. 将 Spigot 的 jar 文件替换为 Paper 的 jar 文件
4. 启动服务器

Paper 会自动读取现有的配置文件和世界数据，并生成 Paper 特有的配置文件。

### 从 Vanilla（原版）迁移

1. 停止原版服务器
2. 备份整个服务器目录
3. 将 Paper jar 文件放入服务器目录
4. 重命名世界文件夹：
   - 原版的 `world/DIM-1` 移动到 `world_nether/DIM-1`
   - 原版的 `world/DIM1` 移动到 `world_the_end/DIM1`
5. 启动 Paper 服务器

或者使用更简单的方法：

1. 在 `bukkit.yml` 中配置世界容器指向原版世界文件夹
2. 启动服务器后 Paper 会自动处理

## 常见问题

### 服务器无法启动，提示 Java 版本过低

Paper 1.20.5 及以上版本需要 Java 21。请确保安装了正确版本的 Java，并在启动命令中指定 Java 路径：

```bash
"C:\Program Files\Java\jdk-21\bin\java.exe" -Xms2G -Xmx2G -jar paper.jar --nogui
```

### 插件无法加载

1. 检查插件是否支持当前 Minecraft 版本
2. 查看 `logs/latest.log` 中的错误信息
3. 确认插件的依赖项是否已安装

### 服务器卡顿

1. 使用 `/timings` 命令生成性能报告
2. 检查是否有插件占用过多资源
3. 调整 `paper-global.yml` 中的性能相关配置
4. 考虑增加服务器内存或升级硬件

### 世界数据损坏

1. 从备份恢复世界数据
2. 使用 `--forceUpgrade` 参数尝试修复：
   ```bash
   java -Xmx4G -jar paper.jar --forceUpgrade
   ```

### 如何更新 Paper

1. 停止服务器
2. 备份服务器目录
3. 下载新版本的 Paper jar 文件
4. 替换旧的 jar 文件
5. 启动服务器

Paper 会自动处理配置文件的兼容性，通常无需手动修改配置。
