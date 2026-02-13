# Linux 运维指南

## 概述

### 为什么推荐 Linux 开服

Linux 是运行 Minecraft 服务器的理想选择，主要原因如下：

1. **资源占用低**：Linux 系统本身占用的内存和 CPU 资源远低于 Windows，可以将更多资源分配给服务器
2. **稳定性高**：Linux 服务器可以连续运行数月甚至数年而无需重启，非常适合需要长期在线的游戏服务器
3. **安全性强**：Linux 的权限管理机制更加严格，病毒和恶意软件的威胁也更少
4. **免费开源**：大多数 Linux 发行版完全免费，无需支付操作系统授权费用
5. **远程管理方便**：通过 SSH 可以轻松远程管理服务器，无需图形界面
6. **社区支持**：大量的服务器运维文档和教程都基于 Linux 环境

---

## 推荐发行版

### Ubuntu Server

Ubuntu Server 是最适合新手的 Linux 发行版：

- **优点**：
  - 文档丰富，社区活跃
  - 软件包更新及时
  - 安装和配置简单
  - LTS（长期支持）版本提供 5 年安全更新

- **推荐版本**：Ubuntu Server 22.04 LTS 或 24.04 LTS

- **安装 Java**：
```bash
# 更新软件包列表
sudo apt update

# 安装 Java 21（推荐用于 Minecraft 1.20.5+）
sudo apt install openjdk-21-jre-headless

# 验证安装
java -version
```

### Debian

Debian 是 Ubuntu 的上游发行版，以稳定性著称：

- **优点**：
  - 极其稳定，适合生产环境
  - 资源占用比 Ubuntu 更低
  - 软件包经过严格测试

- **推荐版本**：Debian 12 (Bookworm)

- **安装 Java**：
```bash
sudo apt update
sudo apt install openjdk-17-jre-headless
```

### CentOS / Rocky Linux / AlmaLinux

这些是企业级 Linux 发行版，适合有一定经验的用户：

- **优点**：
  - 企业级稳定性
  - 与 Red Hat Enterprise Linux 兼容
  - 适合大型服务器部署

- **推荐版本**：Rocky Linux 9 或 AlmaLinux 9

- **安装 Java**：
```bash
sudo dnf install java-21-openjdk-headless
```

---

## 基础命令

### 文件操作

#### ls - 列出目录内容

```bash
# 列出当前目录文件
ls

# 显示详细信息（权限、大小、修改时间）
ls -l

# 显示隐藏文件
ls -a

# 组合使用，显示所有文件的详细信息
ls -la

# 以人类可读的方式显示文件大小
ls -lh
```

#### cd - 切换目录

```bash
# 进入指定目录
cd /home/minecraft

# 返回上一级目录
cd ..

# 返回用户主目录
cd ~

# 返回上一次所在的目录
cd -
```

#### cp - 复制文件或目录

```bash
# 复制文件
cp server.jar server_backup.jar

# 复制目录（需要 -r 参数）
cp -r world world_backup

# 复制时保留文件属性
cp -p config.yml config_backup.yml
```

#### mv - 移动或重命名文件

```bash
# 重命名文件
mv old_name.jar new_name.jar

# 移动文件到其他目录
mv server.jar /home/minecraft/

# 移动目录
mv world /backup/
```

#### rm - 删除文件或目录

```bash
# 删除文件
rm unwanted_file.txt

# 删除目录（需要 -r 参数）
rm -r old_world

# 强制删除（不提示确认）
rm -rf old_backup

# 删除前确认
rm -i important_file.txt
```

> ⚠️ **警告**：`rm -rf` 命令非常危险，删除后无法恢复。使用前请务必确认路径正确。

#### mkdir - 创建目录

```bash
# 创建单个目录
mkdir plugins

# 创建多级目录
mkdir -p /home/minecraft/server/plugins

# 创建多个目录
mkdir logs backups configs
```

### 文件编辑

#### nano - 简单的文本编辑器

nano 是最适合新手的命令行文本编辑器：

```bash
# 打开或创建文件
nano server.properties

# 常用快捷键：
# Ctrl + O  保存文件
# Ctrl + X  退出编辑器
# Ctrl + K  剪切当前行
# Ctrl + U  粘贴
# Ctrl + W  搜索
# Ctrl + G  显示帮助
```

#### vim - 强大的文本编辑器

vim 功能强大但学习曲线较陡：

```bash
# 打开文件
vim server.properties
```

vim 有两种主要模式：
- **普通模式**：按 `Esc` 进入，用于导航和执行命令
- **插入模式**：按 `i` 进入，用于编辑文本

```bash
# 基本操作：
# i          进入插入模式
# Esc        返回普通模式
# :w         保存文件
# :q         退出（未修改时）
# :wq        保存并退出
# :q!        强制退出（不保存）
# dd         删除当前行
# yy         复制当前行
# p          粘贴
# /keyword   搜索关键词
# u          撤销
```

### 权限管理

Linux 文件权限分为三组：所有者（owner）、所属组（group）、其他用户（others）。

每组有三种权限：
- **r (read)**：读取权限，数值为 4
- **w (write)**：写入权限，数值为 2
- **x (execute)**：执行权限，数值为 1

#### chmod - 修改文件权限

```bash
# 使用数字方式设置权限
# 755 = 所有者可读写执行，组和其他用户可读执行
chmod 755 start.sh

# 644 = 所有者可读写，组和其他用户只读
chmod 644 server.properties

# 使用符号方式
# 给所有者添加执行权限
chmod u+x start.sh

# 移除其他用户的写权限
chmod o-w config.yml

# 给所有用户添加读权限
chmod a+r readme.txt
```

#### chown - 修改文件所有者

```bash
# 修改文件所有者
sudo chown minecraft server.jar

# 修改文件所有者和所属组
sudo chown minecraft:minecraft server.jar

# 递归修改目录及其内容的所有者
sudo chown -R minecraft:minecraft /home/minecraft/server
```

### 进程管理

#### ps - 查看进程

```bash
# 查看当前用户的进程
ps

# 查看所有进程
ps aux

# 查找特定进程
ps aux | grep java

# 查看进程树
ps auxf
```

#### top - 实时监控系统资源

```bash
# 启动 top
top

# 常用快捷键：
# q          退出
# M          按内存使用排序
# P          按 CPU 使用排序
# k          终止进程（输入 PID）
# 1          显示每个 CPU 核心的使用情况
```

#### htop - 增强版进程监控

htop 比 top 更直观，支持鼠标操作：

```bash
# 安装 htop
sudo apt install htop    # Debian/Ubuntu
sudo dnf install htop    # CentOS/Rocky

# 启动 htop
htop
```

#### kill - 终止进程

```bash
# 正常终止进程
kill PID

# 强制终止进程
kill -9 PID

# 终止所有 java 进程
killall java

# 根据进程名终止
pkill -f "minecraft"
```

---

## Screen 会话管理

Screen 是一个终端复用器，可以在断开 SSH 连接后保持程序运行。

### 安装 Screen

```bash
# Debian/Ubuntu
sudo apt install screen

# CentOS/Rocky
sudo dnf install screen
```

### 基本操作

#### 创建会话

```bash
# 创建一个名为 minecraft 的会话
screen -S minecraft
```

#### 分离会话

在 Screen 会话中，按 `Ctrl + A`，然后按 `D` 可以分离会话（程序继续在后台运行）。

#### 恢复会话

```bash
# 恢复名为 minecraft 的会话
screen -r minecraft

# 如果会话被其他终端占用，强制恢复
screen -d -r minecraft
```

#### 列出所有会话

```bash
screen -ls
```

输出示例：
```
There are screens on:
    12345.minecraft    (Detached)
    12346.backup       (Attached)
2 Sockets in /run/screen/S-user.
```

#### 关闭会话

```bash
# 方法一：在会话中输入 exit
exit

# 方法二：从外部终止会话
screen -X -S minecraft quit
```

### 在 Screen 中运行 Minecraft 服务器

```bash
# 1. 创建新会话
screen -S minecraft

# 2. 进入服务器目录
cd /home/minecraft/server

# 3. 启动服务器
java -Xms4G -Xmx4G -jar server.jar nogui

# 4. 按 Ctrl+A 然后按 D 分离会话

# 5. 之后可以随时恢复会话查看服务器状态
screen -r minecraft
```

---

## Systemd 服务

Systemd 是现代 Linux 发行版的标准服务管理器，可以实现服务器的自动启动、崩溃重启等功能。

### 创建服务文件

创建文件 `/etc/systemd/system/minecraft.service`：

```bash
sudo nano /etc/systemd/system/minecraft.service
```

### 完整的 service 文件示例

```ini
[Unit]
Description=Minecraft Server
Documentation=https://minecraft.net
After=network.target

[Service]
Type=simple
User=minecraft
Group=minecraft
WorkingDirectory=/home/minecraft/server

# 启动命令
ExecStart=/usr/bin/java -Xms4G -Xmx4G -jar server.jar nogui

# 停止命令（发送 stop 命令给服务器）
ExecStop=/bin/kill -SIGINT $MAINPID

# 重启策略
Restart=on-failure
RestartSec=10

# 资源限制
MemoryMax=6G
CPUQuota=200%

# 安全设置
NoNewPrivileges=true
PrivateTmp=true

# 日志设置
StandardOutput=journal
StandardError=journal
SyslogIdentifier=minecraft

[Install]
WantedBy=multi-user.target
```

### 服务管理命令

```bash
# 重新加载 systemd 配置（修改 service 文件后必须执行）
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start minecraft

# 停止服务
sudo systemctl stop minecraft

# 重启服务
sudo systemctl restart minecraft

# 查看服务状态
sudo systemctl status minecraft

# 设置开机自启
sudo systemctl enable minecraft

# 取消开机自启
sudo systemctl disable minecraft

# 查看服务日志
sudo journalctl -u minecraft

# 实时查看日志
sudo journalctl -u minecraft -f

# 查看最近 100 行日志
sudo journalctl -u minecraft -n 100
```

---

## 启动脚本

### 基础启动脚本

创建 `start.sh`：

```bash
#!/bin/bash

# 服务器目录
SERVER_DIR="/home/minecraft/server"

# 进入服务器目录
cd "$SERVER_DIR"

# 启动服务器
java -Xms4G -Xmx4G -jar server.jar nogui
```

设置执行权限：

```bash
chmod +x start.sh
```

### 带参数的启动脚本

```bash
#!/bin/bash

# 配置区域
SERVER_DIR="/home/minecraft/server"
JAR_NAME="server.jar"
MIN_RAM="4G"
MAX_RAM="8G"

# JVM 优化参数（Aikar's Flags）
JVM_OPTS="-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200"
JVM_OPTS="$JVM_OPTS -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC"
JVM_OPTS="$JVM_OPTS -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30"
JVM_OPTS="$JVM_OPTS -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M"
JVM_OPTS="$JVM_OPTS -XX:G1ReservePercent=20 -XX:G1HeapWastePercent=5"
JVM_OPTS="$JVM_OPTS -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15"
JVM_OPTS="$JVM_OPTS -XX:G1MixedGCLiveThresholdPercent=90"
JVM_OPTS="$JVM_OPTS -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32"
JVM_OPTS="$JVM_OPTS -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1"
JVM_OPTS="$JVM_OPTS -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true"

# 进入服务器目录
cd "$SERVER_DIR"

# 启动服务器
java -Xms${MIN_RAM} -Xmx${MAX_RAM} $JVM_OPTS -jar "$JAR_NAME" nogui
```

### 自动重启脚本

服务器崩溃或关闭后自动重启：

```bash
#!/bin/bash

SERVER_DIR="/home/minecraft/server"
JAR_NAME="server.jar"
MIN_RAM="4G"
MAX_RAM="8G"

cd "$SERVER_DIR"

while true; do
    echo "$(date '+%Y-%m-%d %H:%M:%S') 服务器启动中..."
    
    java -Xms${MIN_RAM} -Xmx${MAX_RAM} -jar "$JAR_NAME" nogui
    
    echo "$(date '+%Y-%m-%d %H:%M:%S') 服务器已停止"
    echo "10 秒后重新启动..."
    echo "按 Ctrl+C 取消重启"
    
    sleep 10
done
```

### 带日志的启动脚本

```bash
#!/bin/bash

SERVER_DIR="/home/minecraft/server"
LOG_DIR="/home/minecraft/server/logs/startup"
JAR_NAME="server.jar"
MIN_RAM="4G"
MAX_RAM="8G"

# 创建日志目录
mkdir -p "$LOG_DIR"

# 生成日志文件名（包含时间戳）
LOG_FILE="$LOG_DIR/server_$(date '+%Y%m%d_%H%M%S').log"

cd "$SERVER_DIR"

echo "$(date '+%Y-%m-%d %H:%M:%S') 服务器启动" | tee -a "$LOG_FILE"
echo "日志文件: $LOG_FILE"

# 启动服务器并记录日志
java -Xms${MIN_RAM} -Xmx${MAX_RAM} -jar "$JAR_NAME" nogui 2>&1 | tee -a "$LOG_FILE"

echo "$(date '+%Y-%m-%d %H:%M:%S') 服务器停止" | tee -a "$LOG_FILE"
```

---

## 定时任务（Cron）

Cron 是 Linux 的定时任务调度器，可以在指定时间自动执行命令。

### Crontab 语法

```
分钟 小时 日期 月份 星期 命令
 │    │    │    │    │
 │    │    │    │    └── 星期几 (0-7, 0 和 7 都表示周日)
 │    │    │    └─────── 月份 (1-12)
 │    │    └──────────── 日期 (1-31)
 │    └───────────────── 小时 (0-23)
 └────────────────────── 分钟 (0-59)
```

特殊字符：
- `*`：任意值
- `,`：列表分隔符（如 `1,3,5`）
- `-`：范围（如 `1-5`）
- `/`：步长（如 `*/5` 表示每 5 个单位）

### 编辑定时任务

```bash
# 编辑当前用户的定时任务
crontab -e

# 查看当前用户的定时任务
crontab -l

# 编辑指定用户的定时任务
sudo crontab -u minecraft -e
```

### 定时重启示例

```bash
# 每天凌晨 4 点重启服务器
0 4 * * * systemctl restart minecraft

# 每 6 小时重启一次（0点、6点、12点、18点）
0 */6 * * * systemctl restart minecraft

# 每周一凌晨 3 点重启
0 3 * * 1 systemctl restart minecraft

# 每天凌晨 4 点发送重启警告，4:05 重启
0 4 * * * screen -S minecraft -p 0 -X stuff "say 服务器将在 5 分钟后重启\n"
5 4 * * * systemctl restart minecraft
```

### 定时备份示例

创建备份脚本 `/home/minecraft/backup.sh`：

```bash
#!/bin/bash

# 配置
SERVER_DIR="/home/minecraft/server"
BACKUP_DIR="/home/minecraft/backups"
WORLD_NAME="world"
MAX_BACKUPS=7

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 生成备份文件名
BACKUP_FILE="$BACKUP_DIR/${WORLD_NAME}_$(date '+%Y%m%d_%H%M%S').tar.gz"

# 通知服务器
screen -S minecraft -p 0 -X stuff "say 正在进行世界备份...\n"
screen -S minecraft -p 0 -X stuff "save-off\n"
screen -S minecraft -p 0 -X stuff "save-all\n"

# 等待保存完成
sleep 10

# 创建备份
tar -czf "$BACKUP_FILE" -C "$SERVER_DIR" "$WORLD_NAME"

# 恢复自动保存
screen -S minecraft -p 0 -X stuff "save-on\n"
screen -S minecraft -p 0 -X stuff "say 备份完成！\n"

# 删除旧备份（保留最近 N 个）
cd "$BACKUP_DIR"
ls -t ${WORLD_NAME}_*.tar.gz | tail -n +$((MAX_BACKUPS + 1)) | xargs -r rm

echo "$(date '+%Y-%m-%d %H:%M:%S') 备份完成: $BACKUP_FILE"
```

设置定时备份：

```bash
# 每天凌晨 3 点备份
0 3 * * * /home/minecraft/backup.sh >> /home/minecraft/logs/backup.log 2>&1

# 每 12 小时备份一次
0 */12 * * * /home/minecraft/backup.sh >> /home/minecraft/logs/backup.log 2>&1
```

---

## 日志管理

### 日志文件位置

Minecraft 服务器的日志通常位于：

```
/home/minecraft/server/logs/
├── latest.log          # 当前运行的日志
├── 2024-01-15-1.log.gz # 历史日志（压缩）
├── 2024-01-14-1.log.gz
└── ...
```

### 查看日志

#### tail - 查看文件末尾

```bash
# 查看最后 50 行
tail -n 50 logs/latest.log

# 实时跟踪日志（新内容会自动显示）
tail -f logs/latest.log

# 实时跟踪并显示最后 100 行
tail -n 100 -f logs/latest.log
```

#### less - 分页查看

```bash
# 分页查看日志
less logs/latest.log

# 常用快捷键：
# 空格      下一页
# b         上一页
# g         跳到开头
# G         跳到结尾
# /keyword  搜索关键词
# n         下一个搜索结果
# N         上一个搜索结果
# q         退出
```

#### grep - 搜索日志

```bash
# 搜索包含 "ERROR" 的行
grep "ERROR" logs/latest.log

# 搜索包含 "玩家名" 的行
grep "PlayerName" logs/latest.log

# 忽略大小写搜索
grep -i "error" logs/latest.log

# 显示匹配行的前后 3 行
grep -C 3 "ERROR" logs/latest.log

# 搜索多个关键词
grep -E "ERROR|WARN" logs/latest.log

# 在压缩日志中搜索
zgrep "ERROR" logs/2024-01-15-1.log.gz
```

#### 组合使用

```bash
# 实时监控错误日志
tail -f logs/latest.log | grep --line-buffered "ERROR"

# 统计错误数量
grep -c "ERROR" logs/latest.log

# 查找玩家登录记录
grep "logged in" logs/latest.log
```

### 日志轮转

使用 logrotate 自动管理日志文件大小和数量。

创建配置文件 `/etc/logrotate.d/minecraft`：

```
/home/minecraft/server/logs/latest.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 644 minecraft minecraft
    copytruncate
}
```

配置说明：
- `daily`：每天轮转
- `rotate 14`：保留 14 个历史文件
- `compress`：压缩旧日志
- `delaycompress`：延迟压缩（保留最近一个不压缩）
- `missingok`：日志不存在时不报错
- `notifempty`：空文件不轮转
- `copytruncate`：复制后截断原文件（避免重启服务）

---

## 常见问题

### 无法连接服务器

1. **检查服务器是否运行**：
```bash
systemctl status minecraft
# 或
ps aux | grep java
```

2. **检查端口是否监听**：
```bash
ss -tlnp | grep 25565
```

3. **检查防火墙设置**：
```bash
# Ubuntu/Debian (ufw)
sudo ufw status
sudo ufw allow 25565/tcp

# CentOS/Rocky (firewalld)
sudo firewall-cmd --list-all
sudo firewall-cmd --permanent --add-port=25565/tcp
sudo firewall-cmd --reload
```

4. **检查 server.properties 配置**：
```properties
server-ip=
server-port=25565
online-mode=true
```

### 服务器启动失败

1. **检查 Java 版本**：
```bash
java -version
```

2. **检查内存设置**：
确保 `-Xmx` 参数不超过系统可用内存。

3. **查看错误日志**：
```bash
tail -n 100 logs/latest.log
```

4. **检查文件权限**：
```bash
ls -la server.jar
# 确保运行用户有读取权限
```

### 服务器卡顿

1. **检查 TPS**：
在游戏内执行 `/tps` 命令（需要相关插件）。

2. **检查系统资源**：
```bash
htop
# 或
top
```

3. **检查磁盘 I/O**：
```bash
iostat -x 1
```

4. **检查网络延迟**：
```bash
ping your-server-ip
```

### 权限被拒绝

```bash
# 检查文件所有者
ls -la

# 修改所有者
sudo chown -R minecraft:minecraft /home/minecraft/server

# 修改权限
chmod +x start.sh
```

### 内存不足

1. **检查内存使用**：
```bash
free -h
```

2. **调整 JVM 内存参数**：
```bash
# 减少最大内存
java -Xms2G -Xmx4G -jar server.jar nogui
```

3. **添加 swap 空间**：
```bash
# 创建 4GB swap 文件
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 永久启用（添加到 /etc/fstab）
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Screen 会话丢失

```bash
# 列出所有会话
screen -ls

# 如果显示 "Dead" 状态
screen -wipe

# 重新创建会话
screen -S minecraft
```

### Systemd 服务无法启动

1. **检查服务状态**：
```bash
sudo systemctl status minecraft
```

2. **查看详细日志**：
```bash
sudo journalctl -u minecraft -n 50 --no-pager
```

3. **验证 service 文件语法**：
```bash
sudo systemd-analyze verify /etc/systemd/system/minecraft.service
```

4. **重新加载配置**：
```bash
sudo systemctl daemon-reload
```
