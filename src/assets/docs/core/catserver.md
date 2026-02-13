# CatServer

## 概述

CatServer 是一款由国内开发者维护的 Minecraft 混合服务端，基于 Forge 和 Bukkit/Spigot 构建。它允许服务器同时运行 Forge 模组和 Bukkit 插件，为希望兼顾模组玩法与插件管理功能的服务器提供了解决方案。

CatServer 在国内 Minecraft 服务器社区中有较高的知名度，拥有活跃的中文用户群体和技术支持渠道。

## 特点

- **模组与插件兼容**：同时支持 Forge 模组和 Bukkit/Spigot 插件，无需在两者之间做出选择
- **国内开发维护**：由国内开发者主导开发，中文文档和社区支持完善
- **针对性优化**：对国内服务器运行环境进行了针对性优化，提升稳定性和性能
- **开源免费**：完全开源，可在 GitHub 上获取源代码

## 重要注意事项

作为混合服务端，CatServer 存在一些需要注意的兼容性问题：

1. **并非所有模组和插件都能完美兼容**：部分模组或插件可能存在冲突，需要逐一测试
2. **性能开销较大**：同时运行模组和插件会增加服务器资源消耗
3. **问题排查复杂**：当出现问题时，需要判断是模组、插件还是服务端本身的问题
4. **更新滞后**：混合端的开发难度较高，版本更新通常比纯净服务端慢
5. **部分高级功能可能受限**：某些依赖底层修改的模组或插件可能无法正常工作

建议在正式部署前进行充分的兼容性测试。

## 支持版本

| Minecraft 版本 | Forge 版本 | Bukkit API 版本 | 状态 |
|---------------|------------|-----------------|------|
| 1.12.2 | 14.23.5.2860 | 1.12.2-R0.1-SpigotAPI | 主推版本，最稳定 |
| 1.16.5 | 36.2.39 | 1.16.5-R0.1-SpigotAPI | 支持中 |
| 1.18.2 | 40.0.83 | 1.18.2-R0.1-SpigotAPI | 支持中 |

> 注意：CatServer 目前暂未支持 1.20 及更高版本。如需运行更新版本的 Minecraft，可考虑 Arclight 或 Mohist 等其他混合服务端。

## 下载方式

### 官方网站

- 官网地址：[https://catmc.org](https://catmc.org)
- 下载页面可能偶尔不可用，如遇问题请使用 GitHub 下载

### GitHub 仓库

- 仓库地址：[https://github.com/Luohuayu/CatServer](https://github.com/Luohuayu/CatServer)
- Releases 页面：[https://github.com/Luohuayu/CatServer/releases](https://github.com/Luohuayu/CatServer/releases)

下载时请选择对应 Minecraft 版本的分支，下载 `universal.jar` 文件。

### 其他渠道

- Telegram 频道：[https://t.me/CatServer](https://t.me/CatServer)（获取更新公告）

## 安装步骤

1. **准备 Java 环境**
   - 1.12.2 版本：需要 Java 8
   - 1.16.5 版本：需要 Java 8 或 Java 11
   - 1.18.2 版本：需要 Java 17

2. **下载服务端**
   - 从 GitHub Releases 或官网下载对应版本的 `CatServer-xxx-universal.jar`

3. **首次启动**
   ```bash
   java -Xmx4G -jar CatServer-xxx-universal.jar
   ```
   首次启动会自动下载所需的库文件，请确保网络畅通

4. **同意 EULA**
   - 编辑生成的 `eula.txt` 文件，将 `eula=false` 改为 `eula=true`

5. **再次启动**
   - 再次运行启动命令，服务器将正常启动

6. **安装模组和插件**
   - 将 Forge 模组放入 `mods` 文件夹
   - 将 Bukkit 插件放入 `plugins` 文件夹

## 常见问题

### 启动时下载库文件失败

由于库文件托管在国外服务器，国内网络可能下载缓慢或失败。解决方案：
- 使用代理或加速器
- 从官网下载 Libraries 压缩包并手动解压到服务器目录

### 模组和插件冲突

当模组和插件同时修改相同的游戏机制时可能产生冲突。建议：
- 逐个添加模组和插件，每次添加后测试
- 查阅 CatServer 社区的兼容性列表
- 在测试环境中充分验证后再部署到正式服务器

### 服务器崩溃或报错

1. 检查日志文件（`logs/latest.log`）中的错误信息
2. 确认 Java 版本是否正确
3. 尝试移除最近添加的模组或插件
4. 在社区或 GitHub Issues 中搜索相关问题

### 性能问题

- 适当增加分配给服务器的内存
- 减少不必要的模组和插件数量
- 使用性能优化类插件
- 调整服务器配置文件中的相关参数
