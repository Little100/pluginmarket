# JVM 启动参数指南

## 前言

这整篇文章都没有看的必要, 真的需要jvm参数直接随便找一个国内ai然后修改发送以下这段提示词 不满意再问(他不能让一个性能低的机器变成高性能机器,不要过多幻想)

```
请为我的世界服务器提供优化的JVM启动参数。
我的服务器配置如下：

CPU 核心数：____（例如：4核心）

运行环境：____（虚拟机 / 实体机 需要包含系统）

运行内存：____GB

服务端类型：____（例如：Paper、Spigot、Vanilla、Purpur 等）

主要用途：____（例如：空岛生存、原版生存、小游戏、模组服等）

请根据以上配置给出适合的 JVM 优化参数，并简要说明各参数的作用。
```

> 国内推荐ai有这些 [deepseek](https://chat.deepseek.com/) [kimi](https://www.kimi.com/) [glm](https://chatglm.cn/main/alltoolsdetail?redirect=/main/alltoolsdetail&lang=zh) [minimax](https://agent.minimaxi.com/)

## 概述

JVM（Java 虚拟机）启动参数直接影响 Minecraft 服务端的性能表现。合理配置这些参数可以显著减少卡顿、降低延迟、提高服务器的稳定性。本指南将帮助你理解各项参数的含义，并根据服务器配置选择最优方案。

---

## 基础参数说明

### `-Xms` 和 `-Xmx`（堆内存设置）

- `-Xms`：设置 JVM 启动时分配的初始堆内存大小
- `-Xmx`：设置 JVM 可使用的最大堆内存大小

```bash
java -Xms4G -Xmx4G -jar server.jar
```

建议将 `-Xms` 和 `-Xmx` 设置为相同的值，原因如下：
- 避免 JVM 在运行时动态调整堆大小带来的性能开销
- 防止内存碎片化
- 使 GC（垃圾回收）行为更加可预测

### `-jar`（指定 JAR 文件）

指定要运行的 JAR 文件路径：

```bash
java -jar server.jar
java -jar paper-1.20.4-496.jar
```

### `nogui`（无图形界面模式）

在命令末尾添加 `nogui` 参数可禁用服务端的图形界面，节省系统资源：

```bash
java -Xmx4G -jar server.jar nogui
```

### `-server`（服务端模式）

强制 JVM 使用服务端模式运行，启用更激进的优化策略。现代 64 位 JVM 默认已启用此模式：

```bash
java -server -Xmx4G -jar server.jar nogui
```

---

## Aikar's Flags（推荐参数）

Aikar's Flags 是由 PaperMC 团队成员 Aikar 针对 Minecraft 服务端优化的一套 JVM 参数，被广泛认为是目前最优的通用配置方案。

### 完整参数

```bash
java -Xms10G -Xmx10G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true -jar server.jar nogui
```

### 参数详解

#### 垃圾回收器选择

| 参数 | 说明 |
|------|------|
| `-XX:+UseG1GC` | 启用 G1（Garbage-First）垃圾回收器，专为大堆内存设计，能够在回收垃圾的同时保持较低的停顿时间 |
| `-XX:+ParallelRefProcEnabled` | 启用并行引用处理，加速引用对象的回收过程 |

#### 停顿时间控制

| 参数 | 说明 |
|------|------|
| `-XX:MaxGCPauseMillis=200` | 设置 GC 最大停顿时间目标为 200 毫秒，G1 会尽量在此时间内完成垃圾回收 |

#### 实验性功能与优化

| 参数 | 说明 |
|------|------|
| `-XX:+UnlockExperimentalVMOptions` | 解锁实验性 JVM 选项，允许使用一些高级调优参数 |
| `-XX:+DisableExplicitGC` | 禁用代码中显式调用的 `System.gc()`，防止插件触发不必要的完整 GC |
| `-XX:+AlwaysPreTouch` | JVM 启动时预先分配并初始化所有堆内存页，避免运行时的内存分配延迟 |

#### G1 垃圾回收器调优

| 参数 | 说明 |
|------|------|
| `-XX:G1NewSizePercent=30` | 新生代最小占堆内存的 30%，Minecraft 会产生大量短生命周期对象，需要较大的新生代 |
| `-XX:G1MaxNewSizePercent=40` | 新生代最大占堆内存的 40% |
| `-XX:G1HeapRegionSize=8M` | 设置 G1 堆区域大小为 8MB，较大的区域有助于处理 Minecraft 的大对象 |
| `-XX:G1ReservePercent=20` | 保留 20% 的堆空间作为空闲区域，防止晋升失败 |
| `-XX:G1HeapWastePercent=5` | 允许 5% 的堆空间浪费，减少不必要的 GC 触发 |
| `-XX:G1MixedGCCountTarget=4` | 混合 GC 周期的目标次数，控制老年代回收的节奏 |
| `-XX:InitiatingHeapOccupancyPercent=15` | 当堆使用率达到 15% 时开始并发标记周期，提前启动 GC 以避免堆满 |
| `-XX:G1MixedGCLiveThresholdPercent=90` | 只有存活对象低于 90% 的区域才会被纳入混合 GC |
| `-XX:G1RSetUpdatingPauseTimePercent=5` | 限制 RSet 更新在 GC 停顿中的时间占比为 5% |

#### 对象晋升策略

| 参数 | 说明 |
|------|------|
| `-XX:SurvivorRatio=32` | 设置 Eden 区与 Survivor 区的比例为 32:1，增大 Eden 区以容纳更多新对象 |
| `-XX:MaxTenuringThreshold=1` | 对象只需经过 1 次 Minor GC 就晋升到老年代，适合 Minecraft 的对象生命周期特点 |

#### 性能优化

| 参数 | 说明 |
|------|------|
| `-XX:+PerfDisableSharedMem` | 禁用性能计数器的共享内存映射，避免某些情况下的 IO 停顿 |

#### 标识参数

| 参数 | 说明 |
|------|------|
| `-Dusing.aikars.flags=https://mcflags.emc.gs` | 标识正在使用 Aikar's Flags |
| `-Daikars.new.flags=true` | 标识使用的是新版参数 |

---

## ZGC 参数（大内存服务器推荐）

ZGC（Z Garbage Collector）是 Java 11 引入的低延迟垃圾回收器，在 Java 17+ 中已相当成熟。适合 16GB 以上内存的服务器。

### 特点

- 停顿时间通常不超过 10 毫秒，且不随堆大小增加而增长
- 支持 TB 级别的堆内存
- 并发执行几乎所有 GC 工作

### 推荐参数

```bash
java -Xms16G -Xmx16G -XX:+UseZGC -XX:+ZGenerational -XX:+AlwaysPreTouch -XX:+DisableExplicitGC -XX:+PerfDisableSharedMem -jar server.jar nogui
```

### 参数说明

| 参数 | 说明 |
|------|------|
| `-XX:+UseZGC` | 启用 ZGC 垃圾回收器 |
| `-XX:+ZGenerational` | 启用分代 ZGC（Java 21+），显著提升性能。Java 17-20 可省略此参数 |
| `-XX:+AlwaysPreTouch` | 预先分配内存页 |
| `-XX:+DisableExplicitGC` | 禁用显式 GC 调用 |
| `-XX:+PerfDisableSharedMem` | 禁用性能计数器共享内存 |

### 适用场景

- 服务器内存 16GB 以上
- 使用 Java 17 或更高版本
- 对延迟敏感的大型服务器
- 玩家数量较多（50+）的服务器

---

## Shenandoah GC 参数

Shenandoah 是 Red Hat 开发的低停顿垃圾回收器，与 ZGC 类似但在某些场景下表现更好。

### 推荐参数

```bash
java -Xms8G -Xmx8G -XX:+UseShenandoahGC -XX:+AlwaysPreTouch -XX:+DisableExplicitGC -XX:+PerfDisableSharedMem -XX:ShenandoahGCHeuristics=adaptive -jar server.jar nogui
```

### 参数说明

| 参数 | 说明 |
|------|------|
| `-XX:+UseShenandoahGC` | 启用 Shenandoah 垃圾回收器 |
| `-XX:ShenandoahGCHeuristics=adaptive` | 使用自适应启发式算法，根据运行时情况自动调整 GC 行为 |

### 注意事项

- Oracle JDK 不包含 Shenandoah，需使用 OpenJDK 或其衍生版本（如 Amazon Corretto、Adoptium）
- 适合 8GB-16GB 内存范围的服务器

---

## GraalVM 专用参数

GraalVM 是 Oracle 开发的高性能 JDK，其 JIT 编译器能够生成更优化的机器码。

### 推荐参数

```bash
java -Xms8G -Xmx8G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:+OptimizeLongCalls -XX:+UseCompressedOops -jar server.jar nogui
```

### GraalVM 特有参数

| 参数 | 说明 |
|------|------|
| `-XX:+OptimizeLongCalls` | 优化长调用链，提升方法调用性能 |
| `-XX:+UseCompressedOops` | 使用压缩对象指针，减少内存占用（64 位 JVM 默认启用） |

### 适用场景

- 追求极致性能优化
- 愿意使用非标准 JDK
- 服务器 CPU 性能较强

---

## 不同内存规模推荐配置

### 4GB 内存（小型服务器，10 人以下）

```bash
java -Xms4G -Xmx4G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=4M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -jar server.jar nogui
```

注意：4GB 配置将 `G1HeapRegionSize` 调整为 4M 以适应较小的堆。

### 8GB 内存（中型服务器，10-30 人）

```bash
java -Xms8G -Xmx8G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true -jar server.jar nogui
```

### 16GB 内存（大型服务器，30-80 人）

推荐使用 ZGC 以获得更低的延迟：

```bash
java -Xms16G -Xmx16G -XX:+UseZGC -XX:+ZGenerational -XX:+AlwaysPreTouch -XX:+DisableExplicitGC -XX:+PerfDisableSharedMem -jar server.jar nogui
```

或使用 G1GC（兼容性更好）：

```bash
java -Xms16G -Xmx16G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=40 -XX:G1MaxNewSizePercent=50 -XX:G1HeapRegionSize=16M -XX:G1ReservePercent=15 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=20 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true -jar server.jar nogui
```

### 32GB 内存（超大型服务器/群组服）

强烈推荐使用 ZGC：

```bash
java -Xms30G -Xmx30G -XX:+UseZGC -XX:+ZGenerational -XX:+AlwaysPreTouch -XX:+DisableExplicitGC -XX:+PerfDisableSharedMem -XX:ConcGCThreads=4 -jar server.jar nogui
```

注意：即使有 32GB 物理内存，也建议将 Xmx 设置为 30GB，为操作系统和其他进程预留空间。

---

## 启动脚本示例

### Windows 启动脚本（start.bat）

```bat
@echo off
title Minecraft Server

:: 服务器 JAR 文件名
set SERVER_JAR=server.jar

:: 内存配置（根据实际情况修改）
set MIN_RAM=8G
set MAX_RAM=8G

:: JVM 参数
set JVM_ARGS=-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1

:start
echo Starting Minecraft Server...
java -Xms%MIN_RAM% -Xmx%MAX_RAM% %JVM_ARGS% -jar %SERVER_JAR% nogui

:: 服务器停止后询问是否重启
echo.
echo Server stopped. Press any key to restart, or Ctrl+C to exit.
pause >nul
goto start
```

### Linux 启动脚本（start.sh）

```bash
#!/bin/bash

# 服务器 JAR 文件名
SERVER_JAR="server.jar"

# 内存配置（根据实际情况修改）
MIN_RAM="8G"
MAX_RAM="8G"

# JVM 参数
JVM_ARGS="-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1"

# 自动重启循环
while true; do
    echo "Starting Minecraft Server..."
    java -Xms${MIN_RAM} -Xmx${MAX_RAM} ${JVM_ARGS} -jar ${SERVER_JAR} nogui
    
    echo ""
    echo "Server stopped. Restarting in 5 seconds..."
    echo "Press Ctrl+C to cancel restart."
    sleep 5
done
```

使用前需要赋予执行权限：

```bash
chmod +x start.sh
```

---

## 常见启动错误及解决方案

### Error: Could not find or load main class

**原因**：JVM 无法找到指定的主类。

**解决方案**：
1. 确认 JAR 文件名拼写正确
2. 确认 JAR 文件与启动脚本在同一目录
3. 检查 JAR 文件是否损坏，尝试重新下载

### OutOfMemoryError

**原因**：分配的内存不足以运行服务器。

**解决方案**：
1. 增加 `-Xmx` 参数的值
2. 减少服务器加载的插件数量
3. 减小视距（view-distance）设置
4. 检查是否有插件存在内存泄漏

```
# 错误示例
java.lang.OutOfMemoryError: Java heap space
```

### Invalid or corrupt jarfile

**原因**：JAR 文件损坏或不完整。

**解决方案**：
1. 重新下载服务端 JAR 文件
2. 验证文件的 MD5/SHA 校验和
3. 确保下载过程中没有中断

### UnsupportedClassVersionError

**原因**：Java 版本过低，无法运行服务端。

**解决方案**：
1. 检查服务端要求的 Java 版本
2. 安装对应版本的 Java
3. 确保系统 PATH 指向正确的 Java 版本

```
# 错误示例
java.lang.UnsupportedClassVersionError: net/minecraft/server/Main has been compiled by a more recent version of the Java Runtime (class file version 61.0)
```

常见版本对应关系：
- Minecraft 1.17+：需要 Java 16+
- Minecraft 1.18+：需要 Java 17+
- Minecraft 1.20.5+：需要 Java 21+

### Address already in use（端口占用）

**原因**：服务器端口（默认 25565）已被其他程序占用。

**解决方案**：

Windows：
```bat
:: 查找占用端口的进程
netstat -ano | findstr :25565

:: 根据 PID 结束进程
taskkill /PID <进程ID> /F
```

Linux：
```bash
# 查找占用端口的进程
lsof -i :25565

# 或使用
netstat -tlnp | grep 25565

# 结束进程
kill -9 <进程ID>
```

或者在 `server.properties` 中修改端口：
```properties
server-port=25566
```

---

## 注意事项

1. **内存分配原则**
   - 不要将 `-Xmx` 设置为物理内存的全部，至少为操作系统保留 1-2GB
   - 例如：8GB 物理内存建议设置 `-Xmx6G`，16GB 建议设置 `-Xmx14G`

2. **Xms 与 Xmx 设置**
   - 建议将 `-Xms` 和 `-Xmx` 设置为相同的值
   - 这样可以避免 JVM 动态调整堆大小带来的性能波动

3. **垃圾回收器选择**
   - 12GB 以下内存：推荐使用 G1GC（Aikar's Flags）
   - 12GB 以上内存：建议考虑 ZGC
   - 使用 OpenJDK 且内存适中：可以尝试 Shenandoah

4. **Java 版本选择**
   - 优先使用 LTS（长期支持）版本：Java 17、Java 21
   - 确保 Java 版本满足服务端的最低要求
   - 推荐使用 Adoptium（Eclipse Temurin）或 Amazon Corretto

5. **性能监控**
   - 使用 `/tps` 命令监控服务器 TPS
   - 使用 Spark 插件进行详细的性能分析
   - 定期检查 GC 日志，可添加 `-Xlog:gc*:file=gc.log` 参数记录 GC 信息

6. **参数调优**
   - 本指南提供的参数适用于大多数场景
   - 如需进一步优化，建议使用 Spark 等工具分析后针对性调整
   - 不要盲目复制网上的参数，需要根据实际情况测试


