# Windows 运维指南

本文介绍如何在 Windows 系统上部署和维护 Minecraft 服务器，涵盖启动脚本编写、防火墙配置、后台运行、性能优化和远程管理等内容。

---

## 1. 概述

### 1.1 Windows 开服的优点

- **操作门槛低**：图形化界面友好，适合没有 Linux 经验的服主
- **软件兼容性好**：大部分 Java 版本和工具都提供 Windows 安装包，配置简单
- **远程桌面方便**：Windows 自带 RDP 远程桌面，可以直接看到图形界面
- **调试直观**：可以直接在控制台窗口中查看日志输出，双击即可启动服务器

### 1.2 Windows 开服的缺点

- **资源占用较高**：Windows 系统本身占用的内存和 CPU 资源比 Linux 多
- **稳定性不如 Linux**：Windows 可能因系统更新、弹窗等原因导致服务器意外中断
- **后台运行不便**：不像 Linux 有 screen/tmux，Windows 需要额外工具才能实现后台运行
- **安全性相对较弱**：Windows 面临的病毒和攻击面比 Linux 更广
- **授权成本**：Windows Server 需要购买许可证（个人使用 Windows 10/11 通常已有授权）

### 1.3 适用场景

- 个人或小型服务器（10-30 人）
- 服主不熟悉 Linux 命令行操作
- 需要在同一台电脑上边玩边开服（仅限测试用途）
- 临时搭建的测试服务器

---

## 2. 启动脚本

### 2.1 基础 .bat 启动脚本

创建一个 `start.bat` 文件，放在服务端 jar 文件所在目录：

```bat
@echo off
title Minecraft Server
java -Xms2G -Xmx4G -jar server.jar nogui
pause
```

参数说明：

| 参数 | 含义 |
|------|------|
| `@echo off` | 关闭命令回显，保持控制台整洁 |
| `title` | 设置控制台窗口标题 |
| `-Xms2G` | JVM 初始分配内存为 2GB |
| `-Xmx4G` | JVM 最大可用内存为 4GB |
| `-jar server.jar` | 指定要运行的服务端 jar 文件 |
| `nogui` | 不启动 Minecraft 自带的图形界面 |
| `pause` | 服务器关闭后暂停窗口，方便查看错误信息 |

> **提示**：将 `server.jar` 替换为你实际使用的服务端文件名，如 `paper-1.20.4.jar`。

### 2.2 带自动重启的 .bat 脚本

服务器崩溃或正常关闭后自动重启：

```bat
@echo off
title Minecraft Server (Auto Restart)

:loop
echo [%date% %time%] 服务器启动中...
java -Xms2G -Xmx4G -jar server.jar nogui

echo.
echo [%date% %time%] 服务器已停止
echo 将在 10 秒后自动重启，按 Ctrl+C 取消...
timeout /t 10 /nobreak
echo.
goto loop
```

工作原理：

1. `:loop` 定义一个标签，作为循环的起点
2. 服务器进程结束后，脚本继续向下执行
3. `timeout /t 10` 等待 10 秒
4. `goto loop` 跳回标签位置，重新启动服务器

如果需要手动停止而不触发重启，可以改进脚本：

```bat
@echo off
title Minecraft Server (Auto Restart)

:loop
echo [%date% %time%] 服务器启动中...
java -Xms2G -Xmx4G -jar server.jar nogui

if exist "stop.flag" (
    echo 检测到 stop.flag 文件，不再重启
    del "stop.flag"
    pause
    exit
)

echo [%date% %time%] 服务器已停止，10 秒后重启...
timeout /t 10 /nobreak
goto loop
```

使用方法：在服务器目录下创建一个名为 `stop.flag` 的空文件，服务器下次停止时就不会自动重启。

### 2.3 PowerShell 启动脚本

PowerShell 提供了更强大的脚本功能。创建 `start.ps1` 文件：

```powershell
# Minecraft Server 启动脚本 (PowerShell)
$ServerJar = "server.jar"
$MinMemory = "2G"
$MaxMemory = "4G"
$AutoRestart = $true

function Start-MinecraftServer {
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] 服务器启动中..." -ForegroundColor Green

    $process = Start-Process -FilePath "java" `
        -ArgumentList "-Xms$MinMemory", "-Xmx$MaxMemory", "-jar", $ServerJar, "nogui" `
        -NoNewWindow -Wait -PassThru

    return $process.ExitCode
}

# 主循环
do {
    $exitCode = Start-MinecraftServer
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] 服务器已停止 (退出码: $exitCode)" -ForegroundColor Yellow

    if (-not $AutoRestart) {
        break
    }

    if (Test-Path "stop.flag") {
        Write-Host "检测到 stop.flag，停止自动重启" -ForegroundColor Red
        Remove-Item "stop.flag"
        break
    }

    Write-Host "10 秒后自动重启..." -ForegroundColor Cyan
    Start-Sleep -Seconds 10
} while ($true)

Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
```

> **注意**：首次运行 PowerShell 脚本可能需要修改执行策略。以管理员身份打开 PowerShell，执行：
>
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

---

## 3. 防火墙配置

Minecraft 服务器默认使用 TCP 25565 端口。如果外部玩家无法连接，通常是防火墙未放行该端口。

### 3.1 命令行方式添加规则

以管理员身份打开命令提示符或 PowerShell，执行以下命令：

```bat
netsh advfirewall firewall add rule name="Minecraft Server" dir=in action=allow protocol=TCP localport=25565
```

如果服务器同时使用 UDP（某些插件或模组需要），也添加 UDP 规则：

```bat
netsh advfirewall firewall add rule name="Minecraft Server UDP" dir=in action=allow protocol=UDP localport=25565
```

查看已添加的规则：

```bat
netsh advfirewall firewall show rule name="Minecraft Server"
```

删除规则：

```bat
netsh advfirewall firewall delete rule name="Minecraft Server"
```

### 3.2 图形界面方式

1. 按 `Win + R`，输入 `wf.msc`，回车打开"高级安全 Windows 防火墙"
2. 在左侧点击"入站规则"
3. 在右侧点击"新建规则..."
4. 选择"端口"，点击下一步
5. 选择"TCP"，在"特定本地端口"中输入 `25565`，点击下一步
6. 选择"允许连接"，点击下一步
7. 勾选"域"、"专用"、"公用"三个配置文件，点击下一步
8. 输入规则名称（如 `Minecraft Server`），点击完成

### 3.3 验证端口是否开放

在服务器上执行以下命令，确认服务器正在监听端口：

```bat
netstat -an | findstr "25565"
```

如果看到类似以下输出，说明服务器正在监听：

```
TCP    0.0.0.0:25565    0.0.0.0:0    LISTENING
```

> **注意**：如果服务器部署在云服务器（如阿里云、腾讯云）上，除了 Windows 防火墙，还需要在云控制台的安全组中放行对应端口。

---

## 4. 后台运行

### 4.1 使用任务计划程序实现开机自启

Windows 任务计划程序可以在系统启动时自动运行服务器。

配置步骤：

1. 按 `Win + R`，输入 `taskschd.msc`，回车打开任务计划程序
2. 在右侧点击"创建任务..."（不是"创建基本任务"）
3. **常规**选项卡：
   - 名称：`Minecraft Server`
   - 勾选"不管用户是否登录都要运行"
   - 勾选"使用最高权限运行"
4. **触发器**选项卡：
   - 点击"新建..."
   - 开始任务选择"启动时"
   - 勾选"延迟任务时间"，设置为 30 秒（等待系统完全启动）
5. **操作**选项卡：
   - 点击"新建..."
   - 操作选择"启动程序"
   - 程序或脚本：填写 `start.bat` 的完整路径
   - 起始于：填写服务端所在目录的路径
6. **条件**选项卡：
   - 取消勾选"只有在计算机使用交流电源时才启动此任务"
7. **设置**选项卡：
   - 取消勾选"如果任务运行时间超过以下时间，停止任务"
   - 在"如果此任务已经运行"下拉框中选择"请勿启动新实例"

### 4.2 使用 NSSM 注册为 Windows 服务

NSSM（Non-Sucking Service Manager）可以将任何程序注册为 Windows 服务，实现真正的后台运行和自动恢复。

#### 安装 NSSM

1. 从 [nssm.cc](https://nssm.cc/download) 下载最新版本
2. 解压后将 `nssm.exe` 放到一个固定目录（如 `C:\Tools\nssm\`）
3. 将该目录添加到系统 PATH 环境变量（可选）

#### 注册服务

以管理员身份打开命令提示符：

```bat
nssm install MinecraftServer
```

在弹出的图形界面中配置：

- **Path**：Java 的完整路径（如 `C:\Program Files\Java\jdk-21\bin\java.exe`）
- **Startup directory**：服务端所在目录
- **Arguments**：`-Xms2G -Xmx4G -jar server.jar nogui`

点击"Install service"完成安装。

#### 常用 NSSM 命令

```bat
:: 启动服务
nssm start MinecraftServer

:: 停止服务
nssm stop MinecraftServer

:: 重启服务
nssm restart MinecraftServer

:: 查看服务状态
nssm status MinecraftServer

:: 编辑服务配置
nssm edit MinecraftServer

:: 删除服务
nssm remove MinecraftServer confirm
```

#### 配置服务自动恢复

```bat
:: 设置服务失败后自动重启，延迟 10 秒
nssm set MinecraftServer AppExit Default Restart
nssm set MinecraftServer AppRestartDelay 10000
```

> **注意**：使用 NSSM 注册为服务后，服务器将在后台运行，没有控制台窗口。如果需要执行服务器命令，需要通过 RCON 或其他远程管理方式。

---

## 5. 性能优化

### 5.1 关闭不必要的后台程序

Windows 系统默认运行许多后台程序，会占用服务器资源。

建议关闭的程序：

- **Windows Search**：索引服务，占用磁盘 I/O
- **Superfetch/SysMain**：预加载服务，与服务器场景不匹配
- **Windows Defender 实时保护**：扫描会影响性能（如果服务器在内网可考虑关闭）
- **OneDrive**：云同步服务
- **Xbox Game Bar**：游戏录制功能

通过服务管理器禁用服务：

```bat
:: 禁用 Windows Search
sc config "WSearch" start= disabled
sc stop "WSearch"

:: 禁用 SysMain (Superfetch)
sc config "SysMain" start= disabled
sc stop "SysMain"
```

### 5.2 电源计划设置为高性能

默认的"平衡"电源计划会降低 CPU 频率以节省电能，影响服务器性能。

命令行设置：

```bat
:: 查看可用的电源计划
powercfg /list

:: 设置为高性能模式
powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c
```

或通过图形界面：

1. 打开"控制面板" → "电源选项"
2. 选择"高性能"计划
3. 如果没有显示，点击"显示附加计划"

### 5.3 关闭 Windows 更新自动重启

Windows 更新可能在服务器运行时自动重启系统，导致服务中断。

方法一：使用组策略（仅限专业版/企业版）

1. 按 `Win + R`，输入 `gpedit.msc`
2. 导航到：计算机配置 → 管理模板 → Windows 组件 → Windows 更新
3. 找到"对于有已登录用户的计算机，计划的自动更新安装不执行重新启动"
4. 设置为"已启用"

方法二：设置活动时间

1. 打开"设置" → "更新和安全" → "Windows 更新"
2. 点击"更改活动时间"
3. 设置服务器运行的时间段（最多 18 小时）

方法三：暂停更新

```bat
:: 暂停更新 35 天
reg add "HKLM\SOFTWARE\Microsoft\WindowsUpdate\UX\Settings" /v PauseUpdatesExpiryTime /t REG_SZ /d "2099-12-31T00:00:00Z" /f
```

---

## 6. 远程管理

### 6.1 远程桌面（RDP）

Windows 自带的远程桌面功能可以远程访问服务器的图形界面。

启用远程桌面：

1. 打开"设置" → "系统" → "远程桌面"
2. 开启"启用远程桌面"
3. 记录显示的电脑名称或 IP 地址

命令行启用：

```bat
:: 启用远程桌面
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f

:: 允许远程桌面通过防火墙
netsh advfirewall firewall set rule group="远程桌面" new enable=yes
```

连接方式：

1. 在另一台 Windows 电脑上按 `Win + R`，输入 `mstsc`
2. 输入服务器的 IP 地址或计算机名
3. 输入用户名和密码登录

> **安全建议**：
> - 修改默认的 RDP 端口（3389）以减少暴力破解风险
> - 使用强密码
> - 考虑配置 VPN 后再使用 RDP

### 6.2 RCON 远程控制

RCON（Remote Console）允许通过网络发送服务器命令，无需登录服务器。

启用 RCON：

编辑 `server.properties` 文件：

```properties
enable-rcon=true
rcon.port=25575
rcon.password=你的RCON密码
```

> **重要**：RCON 密码以明文传输，务必设置强密码，并且不要将 RCON 端口暴露到公网。

使用 RCON 客户端：

推荐工具：

- **mcrcon**：命令行工具，跨平台
- **RCON Client**：图形界面工具

mcrcon 使用示例：

```bat
:: 发送单条命令
mcrcon -H 127.0.0.1 -P 25575 -p 密码 "say Hello"

:: 进入交互模式
mcrcon -H 127.0.0.1 -P 25575 -p 密码 -t
```

---

## 7. 常见问题

### Q1: 双击 start.bat 后窗口一闪而过

可能原因：

- Java 未正确安装或未添加到 PATH
- 服务端 jar 文件名与脚本中不一致
- 内存分配超过系统可用内存

解决方法：

1. 在脚本末尾添加 `pause` 命令查看错误信息
2. 打开命令提示符，手动执行 `java -version` 确认 Java 已安装
3. 检查 jar 文件名是否正确

### Q2: 外部玩家无法连接服务器

排查步骤：

1. 确认服务器已启动并显示 "Done"
2. 检查 `server.properties` 中的 `server-port` 设置
3. 确认 Windows 防火墙已放行端口
4. 如果是云服务器，检查安全组规则
5. 使用端口检测工具测试端口是否开放

### Q3: 服务器启动后内存占用过高

可能原因：

- `-Xmx` 设置过大
- 插件内存泄漏
- 世界文件过大

解决方法：

1. 根据实际需求调整 `-Xmx` 参数
2. 使用 Spark 等性能分析插件定位问题
3. 定期清理不需要的区块

### Q4: 使用 NSSM 后无法查看控制台输出

NSSM 服务在后台运行，没有控制台窗口。

解决方法：

1. 配置 NSSM 将输出重定向到日志文件：
   ```bat
   nssm set MinecraftServer AppStdout C:\mc\logs\stdout.log
   nssm set MinecraftServer AppStderr C:\mc\logs\stderr.log
   ```
2. 使用 RCON 执行命令和查看反馈
3. 查看服务器的 `logs/latest.log` 文件

### Q5: 任务计划程序创建的任务没有自动运行

排查步骤：

1. 检查任务的"历史记录"查看执行情况
2. 确认"不管用户是否登录都要运行"已勾选
3. 确认启动脚本路径正确
4. 检查是否有杀毒软件阻止了脚本执行
