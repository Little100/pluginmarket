# Banner

## 概述

Banner 是由 MohistMC 团队开发的 Minecraft 混合服务端软件。它基于 Fabric 模组加载器构建，同时实现了 Bukkit/Spigot/Paper 插件 API，使服务器能够同时运行 Fabric 模组和 Bukkit 插件。可以将其理解为 Fabric 平台上的混合服务端解决方案，类似于 Forge 平台上的 Mohist。

## 特点

- **双重兼容**：基于 Fabric 加载器，同时支持 Bukkit/Spigot/Paper 插件 API
- **MohistMC 出品**：由开发 Mohist（Forge 混合端）的同一团队开发
- **版本支持**：主要支持 Minecraft 1.20.1 和 1.21.1 等较新版本
- **相对较新**：作为 Fabric 混合端方案，项目起步较晚，生态仍在发展中

## 重要注意事项

:::warning 兼容性警告
Banner 作为混合服务端，存在以下已知问题：

1. **兼容性有限**：并非所有 Fabric 模组和 Bukkit 插件都能正常工作，部分插件/模组可能产生冲突
2. **稳定性风险**：混合环境下可能出现崩溃、数据损坏等问题
3. **社区支持受限**：在 SpigotMC、PaperMC、Fabric 官方论坛寻求帮助时，可能因使用混合端而被拒绝
4. **项目状态**：MohistMC 项目在 2025 年 1 月出售后，核心更新已暂停，但 Banner 下载仍可从官网获取
:::

:::tip 使用建议
- 生产环境使用前务必充分测试
- 定期备份服务器数据
- 优先考虑使用纯 Fabric（仅模组）或纯 Paper（仅插件）方案
- 如需 Forge + 插件混合，可考虑 Mohist 或 Arclight
:::

## 支持版本

| Minecraft 版本 | 支持状态 |
|---------------|---------|
| 1.21.1 | ✅ 支持 |
| 1.20.1 | ✅ 支持 |

*注：支持的版本可能随项目更新而变化，请以官网为准。*

## 下载方式

### 官方下载

1. 访问 MohistMC 官网：https://mohistmc.com/
2. 在软件列表中选择 Banner
3. 选择对应的 Minecraft 版本（如 1.20.1 或 1.21.1）
4. 下载最新构建版本

直接下载链接：https://mohistmc.com/downloadSoftware?project=banner

### GitHub

- MohistMC 组织：https://github.com/MohistMC

## 安装步骤

1. **准备 Java 环境**
   - Minecraft 1.20.1+ 需要 Java 17 或更高版本
   - Minecraft 1.21+ 需要 Java 21 或更高版本

2. **下载服务端**
   - 从官网下载对应版本的 Banner jar 文件

3. **首次运行**
   ```bash
   java -jar banner-1.20.1-xxx.jar
   ```
   首次运行会生成配置文件并下载必要的库文件

4. **同意 EULA**
   - 编辑生成的 `eula.txt` 文件
   - 将 `eula=false` 改为 `eula=true`

5. **再次启动**
   ```bash
   java -Xmx4G -jar banner-1.20.1-xxx.jar nogui
   ```

6. **安装模组和插件**
   - Fabric 模组放入 `mods` 文件夹
   - Bukkit 插件放入 `plugins` 文件夹

## 常见问题

### Q: Banner 和 Mohist 有什么区别？

Banner 基于 Fabric 加载器，支持 Fabric 模组 + Bukkit 插件；Mohist 基于 Forge 加载器，支持 Forge 模组 + Bukkit 插件。选择哪个取决于你需要使用的模组是 Fabric 版还是 Forge 版。

### Q: 为什么某些插件/模组无法正常工作？

混合服务端需要在两套不同的 API 之间进行转换和兼容，这可能导致部分功能无法正常工作。建议：
- 查看官方兼容性列表
- 在测试环境中验证
- 寻找替代的模组或插件

### Q: 服务器崩溃了怎么办？

1. 查看崩溃日志（`crash-reports` 文件夹或 `logs/latest.log`）
2. 尝试移除最近添加的模组/插件
3. 确保所有模组/插件版本与 Minecraft 版本匹配
4. 在 MohistMC Discord 社区寻求帮助

### Q: 有没有其他 Fabric + Bukkit 混合方案？

除 Banner 外，还有 Cardboard 等项目尝试实现类似功能，但这类混合方案普遍存在兼容性问题。如果对稳定性要求较高，建议使用纯 Fabric 或纯 Paper 方案。

### Q: MohistMC 项目出售后 Banner 还能用吗？

截至 2025-2026 年，Banner 的下载仍可从 MohistMC 官网获取，已有的构建版本仍可正常使用。但由于项目维护状态不确定，建议关注官方公告了解最新动态。

## 相关链接

- 官网：https://mohistmc.com/
- GitHub：https://github.com/MohistMC
- Discord：https://discord.gg/mohistmc
