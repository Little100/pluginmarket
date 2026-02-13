# Arclight

## 概述

Arclight 是一款基于 Forge/NeoForge 的混合服务端软件，使用 Mixin 技术实现了对 Bukkit/Spigot 插件的支持。这意味着服务器管理员可以在同一个服务端上同时运行 Forge/NeoForge 模组和 Bukkit 插件，无需在模组服和插件服之间做出取舍。

Arclight 由 IzzelAliz 开发并持续维护，是目前最活跃的混合服务端项目之一。

## 特点

- **模组与插件兼容**：同时支持 Forge/NeoForge 模组和 Bukkit/Spigot 插件
- **多加载器支持**：提供 Forge 版、NeoForge 版和 Fabric 版三个分支
- **版本覆盖广**：支持从 1.16.5 到 1.21.1 的多个 Minecraft 版本
- **活跃维护**：项目持续更新，提供稳定版和夜间构建版
- **自动依赖下载**：首次运行时自动下载所需的 Forge/NeoForge 安装器

## 支持版本

| Minecraft 版本 | 支持状态 | 推荐 Java 版本 |
|---------------|---------|---------------|
| 1.21.1 | ✅ 支持 | Java 21+ |
| 1.20.4 | ✅ 支持 | Java 17+ |
| 1.20.1 | ✅ 支持 | Java 17+ |
| 1.19.4 | ✅ 支持 | Java 17+ |
| 1.18.2 | ✅ 支持 | Java 17+ |
| 1.16.5 | ✅ 支持 | Java 8-16 |

> 具体版本支持情况请参考 [GitHub Discussions #1575](https://github.com/IzzelAliz/Arclight/discussions/1575)

## 下载方式

### 官方下载站（推荐）

访问 **https://arclight.izzel.io/** 下载最新版本。

该站点提供：
- 按 Minecraft 版本筛选
- 按加载器类型筛选（Forge / NeoForge / Fabric）
- 稳定版和夜间构建版下载

### GitHub Releases

- 仓库地址：https://github.com/IzzelAliz/Arclight
- Releases 页面：https://github.com/IzzelAliz/Arclight/releases

> 注意：官方已将主要下载迁移至 arclight.izzel.io，GitHub Releases 可能不包含最新的夜间构建版。

## 安装步骤

1. **下载服务端文件**
   
   从官方下载站下载对应版本的 JAR 文件，例如 `arclight-neoforge-1.21.1-xxx.jar`

2. **准备运行环境**
   
   确保已安装对应版本的 Java 运行环境

3. **首次启动**
   
   ```bash
   java -jar arclight.jar nogui
   ```
   
   首次运行会自动下载 Forge/NeoForge 安装器及相关依赖

4. **同意 EULA**
   
   编辑生成的 `eula.txt` 文件，将 `eula=false` 改为 `eula=true`

5. **再次启动**
   
   ```bash
   java -jar arclight.jar nogui
   ```

6. **安装模组和插件**
   
   - 将模组文件（.jar）放入 `/mods/` 文件夹
   - 将插件文件（.jar）放入 `/plugins/` 文件夹

## Forge 版 vs NeoForge 版

| 对比项 | Forge 版 | NeoForge 版 |
|-------|---------|-------------|
| 模组生态 | 成熟稳定，模组数量多 | 较新，模组数量增长中 |
| 更新速度 | 相对保守 | 更新较快 |
| 适用场景 | 需要使用大量老牌模组 | 追求新特性和新版本支持 |
| 1.20.1+ | 支持 | 支持 |

**选择建议**：
- 如果你的模组包主要使用传统 Forge 模组，选择 Forge 版
- 如果你使用较新的 Minecraft 版本且模组支持 NeoForge，可以选择 NeoForge 版
- 不确定时，优先选择 Forge 版，兼容性更好

## 常见问题

### Q: Arclight 和 Mohist 有什么区别？

Arclight 和 Mohist 都是混合服务端，但实现方式不同。Arclight 使用 Mixin 技术，而 Mohist 直接修改 Forge 源码。Arclight 的更新通常更快，且对新版本的支持更及时。

### Q: 所有插件和模组都能兼容吗？

不是所有插件和模组都能完美兼容。部分插件可能因为使用了 NMS（Net Minecraft Server）代码而无法正常工作，部分模组也可能与插件产生冲突。建议在正式使用前进行充分测试。

### Q: 服务器启动时报错怎么办？

1. 确认 Java 版本是否正确
2. 检查是否有模组或插件冲突
3. 尝试使用最新的夜间构建版
4. 查看 [GitHub Issues](https://github.com/IzzelAliz/Arclight/issues) 是否有类似问题
5. 在 [Discord](https://discord.gg/ZvTY5SC) 社区寻求帮助

### Q: 如何获取帮助？

- 官方文档：https://wiki.izzel.io/s/arclight-docs
- Discord 社区：https://discord.gg/ZvTY5SC
- GitHub Issues：https://github.com/IzzelAliz/Arclight/issues

### Q: 夜间构建版稳定吗？

夜间构建版包含最新的修复和功能，但可能存在未发现的问题。生产环境建议使用稳定版，或在测试环境充分验证后再部署夜间版。
