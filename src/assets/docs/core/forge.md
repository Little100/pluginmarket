# Minecraft Forge

## 概述

Minecraft Forge 是 Minecraft 历史最悠久、生态最丰富的模组加载器。自 2011 年首次发布以来，Forge 一直是模组社区的核心平台，为数以万计的模组提供了统一的加载和运行环境。无论是大型整合包还是单个功能模组，Forge 都是最广泛支持的选择。

## 特点

- **历史最悠久**：作为最早的模组加载平台之一，Forge 拥有超过十年的发展历史，社区成熟稳定
- **模组数量最多**：CurseForge 和 Modrinth 上的大部分模组都支持 Forge，生态系统极为丰富
- **Forge API**：提供完善的 API 供模组开发者使用，包括事件系统、配置系统、网络通信等
- **纯模组端**：Forge 是纯粹的模组加载器，不支持 Bukkit/Spigot 插件（如需同时使用模组和插件，请参考 Mohist 等混合端）
- **性能开销**：相比 Fabric 等轻量级加载器，Forge 的性能开销较大，启动时间较长

## 支持版本

Forge 支持从 Minecraft 1.1 到最新版本的几乎所有主要版本：

| 版本范围 | 说明 |
|---------|------|
| 1.1 - 1.12.2 | 经典版本，大量老牌模组支持 |
| 1.13 - 1.16.5 | 过渡版本，API 有较大变化 |
| 1.17 - 1.20.x | 现代版本，需要 Java 17+ |
| 1.21.x | 最新版本，需要 Java 21+ |

当前最新支持版本：**1.21.11**（Forge 61.0.10）

## 下载方式

### 官方下载

访问 Forge 官方网站下载：**https://files.minecraftforge.net/**

1. 在左侧版本列表中选择你需要的 Minecraft 版本
2. 选择 **Installer** 版本下载（推荐下载 Recommended 版本，如需最新功能可选择 Latest）
3. 点击下载按钮后会有广告页面，等待数秒后点击右上角 **Skip** 即可下载

> ⚠️ **安全提示**：请务必从官方网站下载，避免从第三方网站下载以防止病毒或恶意软件。

## 服务端安装

### Windows 安装步骤

1. **下载 Installer**
   
   从官网下载对应版本的 Installer JAR 文件，例如 `forge-1.21.1-52.1.10-installer.jar`

2. **运行安装程序**
   
   打开命令提示符（CMD），进入 Installer 所在目录，执行：
   ```bash
   java -jar forge-1.21.1-52.1.10-installer.jar --installServer
   ```
   
   安装程序会自动下载所需的库文件和 Minecraft 服务端。

3. **安装后的目录结构**
   ```
   服务器目录/
   ├── libraries/          # Forge 和依赖库
   ├── mods/               # 模组文件夹（需手动创建或首次启动后生成）
   ├── run.bat             # Windows 启动脚本
   ├── run.sh              # Linux 启动脚本
   ├── user_jvm_args.txt   # JVM 参数配置文件
   └── ...
   ```

4. **启动服务器**
   
   双击 `run.bat` 或在命令行执行：
   ```bash
   run.bat
   ```
   
   如需手动启动，可使用：
   ```bash
   java @user_jvm_args.txt @libraries/net/minecraftforge/forge/1.21.1-52.1.10/win_args.txt
   ```

5. **同意 EULA**
   
   首次启动后，编辑生成的 `eula.txt` 文件，将 `eula=false` 改为 `eula=true`

6. **再次启动**
   
   再次运行启动脚本，服务器将正常启动

### Linux 安装步骤

1. **下载 Installer**
   ```bash
   wget https://maven.minecraftforge.net/net/minecraftforge/forge/1.21.1-52.1.10/forge-1.21.1-52.1.10-installer.jar
   ```

2. **运行安装程序**
   ```bash
   java -jar forge-1.21.1-52.1.10-installer.jar --installServer
   ```

3. **赋予启动脚本执行权限**
   ```bash
   chmod +x run.sh
   ```

4. **启动服务器**
   ```bash
   ./run.sh
   ```
   
   或手动启动：
   ```bash
   java @user_jvm_args.txt @libraries/net/minecraftforge/forge/1.21.1-52.1.10/unix_args.txt
   ```

5. **同意 EULA**
   ```bash
   echo "eula=true" > eula.txt
   ```

6. **配置 JVM 参数**
   
   编辑 `user_jvm_args.txt` 文件，添加内存配置：
   ```
   -Xmx4G
   -Xms2G
   ```

## 模组安装方法

### 下载模组

从以下平台下载模组：

- **CurseForge**：https://www.curseforge.com/minecraft/mc-mods
- **Modrinth**：https://modrinth.com/mods

### 安装模组

1. 将下载的模组 JAR 文件放入服务器目录下的 `mods` 文件夹
2. 重启服务器使模组生效

### 版本对应

安装模组时需要注意三个版本的对应关系：

| 项目 | 说明 |
|-----|------|
| Minecraft 版本 | 模组必须与服务器的 MC 版本一致 |
| Forge 版本 | 部分模组要求特定的 Forge 版本范围 |
| 模组版本 | 同一模组的不同版本对应不同的 MC 版本 |

> 💡 **提示**：在模组下载页面通常会标注支持的 Minecraft 版本和 Forge 版本，请仔细核对后再下载。

## 常见问题

### 模组冲突排查

当服务器无法启动或出现异常时，可能是模组之间存在冲突：

1. **查看日志**：检查 `logs/latest.log` 或 `crash-reports/` 目录下的崩溃报告
2. **二分法排查**：将 mods 文件夹中的模组分成两半，逐步缩小范围找出冲突模组
3. **检查依赖**：部分模组需要前置模组（如 Architectury、Cloth Config 等），确保已安装所有依赖

### 内存不足

如果服务器启动缓慢或频繁崩溃，可能是内存不足：

1. 编辑 `user_jvm_args.txt`，增加内存分配：
   ```
   -Xmx8G
   -Xms4G
   ```
2. 模组数量较多时建议分配 6GB 以上内存
3. 确保服务器物理内存充足

### 版本不兼容

遇到版本不兼容问题时：

1. **检查 Java 版本**：
   - Minecraft 1.17-1.20.4：需要 Java 17
   - Minecraft 1.20.5+：需要 Java 21
2. **检查模组版本**：确保所有模组都支持当前的 Minecraft 和 Forge 版本
3. **更新 Forge**：尝试更新到最新的 Forge 版本，可能已修复兼容性问题

### 启动脚本找不到

如果安装后没有生成 `run.bat` 或 `run.sh`：

1. 确认使用的是较新版本的 Forge（1.17+）
2. 旧版本 Forge 需要手动创建启动脚本：
   ```bash
   java -Xmx4G -jar forge-1.16.5-36.2.39.jar nogui
   ```
