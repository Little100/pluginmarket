# FRP 内网穿透

## 概述

### 什么是 FRP 内网穿透

FRP（Fast Reverse Proxy）是一款高性能的反向代理应用，专门用于内网穿透。它可以将位于 NAT 或防火墙后的本地服务器暴露到公网，使外部用户能够访问内网中的服务。

### 工作原理

FRP 采用客户端-服务端架构：

1. **frps（服务端）**：部署在具有公网 IP 的服务器上，负责接收外部请求
2. **frpc（客户端）**：部署在内网机器上，与服务端建立长连接
3. **数据转发**：当外部用户访问公网服务器的指定端口时，frps 将请求通过已建立的连接转发给 frpc，frpc 再将请求转发到本地服务

```
外部用户 → 公网服务器(frps) → 内网客户端(frpc) → 本地服务
```

### 常见应用场景

- 远程访问家庭或公司内网的服务器
- 将本地开发环境暴露给外部测试
- 搭建 Minecraft、Terraria 等游戏服务器供外网玩家连接
- 远程桌面连接内网电脑
- 访问内网的 Web 服务、数据库等

## FRP 的优缺点

### 优点

| 优点 | 说明 |
|------|------|
| 开源免费 | FRP 本身是开源项目，可自由使用 |
| 配置简单 | 配置文件结构清晰，易于理解和修改 |
| 性能优秀 | 使用 Go 语言编写，性能出色 |
| 协议支持全面 | 支持 TCP、UDP、HTTP、HTTPS 等多种协议 |
| 跨平台 | 支持 Windows、Linux、macOS 等操作系统 |
| 功能丰富 | 支持加密传输、负载均衡、访问控制等高级功能 |

### 缺点

| 缺点 | 说明 |
|------|------|
| 需要公网服务器 | 自建 FRP 需要一台具有公网 IP 的服务器 |
| 带宽受限 | 传输速度受服务器带宽限制 |
| 安全风险 | 配置不当可能导致内网服务暴露 |
| 维护成本 | 自建方案需要自行维护服务端 |

## Sakura FRP（樱花穿透）

Sakura FRP（樱花穿透）是国内知名的 FRP 内网穿透服务提供商，提供稳定的穿透服务和友好的管理界面，是新手入门的首选方案。

### 官网信息

- **官网地址**：https://www.natfrp.com/
- **管理面板**：https://www.natfrp.com/user/
- **文档中心**：https://doc.natfrp.com/

### 注册账号

1. 访问官网 https://www.natfrp.com/
2. 点击右上角「注册」按钮
3. 填写邮箱、用户名、密码等信息
4. 完成邮箱验证
5. 登录后进行实名认证（部分功能需要）

### 创建隧道

1. 登录管理面板
2. 点击左侧菜单「隧道列表」→「创建隧道」
3. 选择节点（建议选择延迟低、负载低的节点）
4. 配置隧道参数：
   - **隧道类型**：根据需求选择 TCP、UDP、HTTP、HTTPS
   - **本地地址**：通常为 `127.0.0.1`
   - **本地端口**：要穿透的本地服务端口
   - **远程端口**：公网访问端口（部分节点支持自定义）
5. 点击「创建」完成配置

### 启动器使用

#### Windows 系统

1. 下载启动器：在管理面板「软件下载」页面下载 Windows 版启动器
2. 解压并运行 `SakuraLauncher.exe`
3. 首次运行需要登录账号或输入访问密钥
4. 在启动器中勾选要启用的隧道
5. 点击「启动」按钮开始穿透

#### Linux 系统

**方式一：使用官方脚本安装**

```bash
# 下载并安装
wget -O frpc https://nya.globalslb.net/natfrp/client/frpc/0.51.0-sakura-7.2/frpc_linux_amd64
chmod +x frpc
sudo mv frpc /usr/local/bin/

# 运行（替换为你的访问密钥和隧道ID）
frpc -f <访问密钥>:<隧道ID>
```

**方式二：使用 systemd 服务**

```bash
# 创建服务文件
sudo nano /etc/systemd/system/sakurafrp.service
```

写入以下内容：

```ini
[Unit]
Description=SakuraFRP Client
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/frpc -f <访问密钥>:<隧道ID>
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable sakurafrp
sudo systemctl start sakurafrp
```

### 免费额度

Sakura FRP 提供一定的免费额度：

| 项目 | 免费额度 |
|------|----------|
| 每日流量 | 约 5GB（根据节点不同有所差异） |
| 隧道数量 | 2-3 条（新用户） |
| 可用节点 | 部分免费节点 |
| 带宽限制 | 有一定限速 |

> 注意：免费额度可能随政策调整，具体以官网公告为准。付费用户可获得更多流量、更多隧道和更高带宽。

## ChmlFRP

ChmlFRP 是另一个国内 FRP 服务提供商，提供免费的内网穿透服务，适合个人用户和小型项目使用。

### 官网信息

- **官网地址**：https://www.chmlfrp.cn/
- **管理面板**：https://panel.chmlfrp.cn/
- **文档地址**：https://docs.chmlfrp.cn/

### 注册账号

1. 访问官网 https://www.chmlfrp.cn/
2. 点击「注册」按钮
3. 填写用户名、邮箱、密码
4. 完成邮箱验证或手机验证
5. 登录账号

### 使用步骤

#### 创建隧道

1. 登录管理面板
2. 进入「隧道管理」→「新建隧道」
3. 选择服务器节点
4. 填写隧道配置：
   - 隧道名称
   - 隧道类型（TCP/UDP/HTTP/HTTPS）
   - 本地 IP 和端口
   - 远程端口（如支持自定义）
5. 保存配置

#### 下载客户端

1. 在面板「下载中心」获取客户端
2. 根据操作系统选择对应版本

#### Windows 启动

```powershell
# 命令行启动
frpc.exe -u <用户Token> -p <隧道ID>
```

或使用图形化启动器。

#### Linux 启动

```bash
# 下载客户端
wget -O frpc https://download.chmlfrp.cn/frpc_linux_amd64
chmod +x frpc

# 启动隧道
./frpc -u <用户Token> -p <隧道ID>
```

### 免费额度

| 项目 | 免费额度 |
|------|----------|
| 隧道数量 | 3-5 条 |
| 每日流量 | 约 10GB |
| 可用节点 | 多个免费节点 |
| 带宽限制 | 有一定限速 |

> 具体额度以官网最新公告为准。

## 自建 FRP（进阶）

如果你有一台具有公网 IP 的服务器，可以自行搭建 FRP 服务，获得完全的控制权和更好的性能。

### 准备工作

- 一台具有公网 IP 的服务器（如云服务器）
- 服务器开放必要的端口（防火墙/安全组配置）
- 下载 FRP：https://github.com/fatedier/frp/releases

### 服务端配置（frps）

#### 下载并解压

```bash
# Linux 服务器
cd /opt
wget https://github.com/fatedier/frp/releases/download/v0.61.0/frp_0.61.0_linux_amd64.tar.gz
tar -xzf frp_0.61.0_linux_amd64.tar.gz
mv frp_0.61.0_linux_amd64 frp
cd frp
```

#### 配置文件 frps.toml

```toml
# frps.toml - 服务端配置

# 基础配置
bindPort = 7000                    # frp 服务端口
vhostHTTPPort = 80                 # HTTP 虚拟主机端口（可选）
vhostHTTPSPort = 443               # HTTPS 虚拟主机端口（可选）

# 认证配置
auth.method = "token"
auth.token = "your_secure_token"   # 设置一个强密码

# 日志配置
log.to = "/var/log/frps.log"
log.level = "info"
log.maxDays = 7

# Web 管理面板（可选）
webServer.addr = "0.0.0.0"
webServer.port = 7500
webServer.user = "admin"
webServer.password = "admin_password"
```

#### 启动服务端

```bash
# 前台运行（测试用）
./frps -c frps.toml

# 后台运行
nohup ./frps -c frps.toml > /dev/null 2>&1 &
```

#### systemd 服务配置

创建服务文件 `/etc/systemd/system/frps.service`：

```ini
[Unit]
Description=FRP Server
After=network.target

[Service]
Type=simple
ExecStart=/opt/frp/frps -c /opt/frp/frps.toml
Restart=on-failure
RestartSec=5
LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target
```

启用并启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable frps
sudo systemctl start frps
sudo systemctl status frps
```

### 客户端配置（frpc）

#### 下载客户端

根据操作系统下载对应版本：

**Windows：**
```powershell
# 下载 Windows 版本
# 访问 https://github.com/fatedier/frp/releases 下载 frp_x.x.x_windows_amd64.zip
```

**Linux：**
```bash
wget https://github.com/fatedier/frp/releases/download/v0.61.0/frp_0.61.0_linux_amd64.tar.gz
tar -xzf frp_0.61.0_linux_amd64.tar.gz
```

#### 配置文件 frpc.toml

```toml
# frpc.toml - 客户端配置

# 服务端连接配置
serverAddr = "your_server_ip"      # 服务端公网 IP
serverPort = 7000                  # 服务端 frp 端口

# 认证配置（需与服务端一致）
auth.method = "token"
auth.token = "your_secure_token"

# 日志配置
log.to = "./frpc.log"
log.level = "info"

# ===== 隧道配置示例 =====

# TCP 隧道示例：穿透 SSH 服务
[[proxies]]
name = "ssh"
type = "tcp"
localIP = "127.0.0.1"
localPort = 22
remotePort = 6022                  # 通过 服务器IP:6022 访问内网 SSH

# TCP 隧道示例：穿透 Minecraft 服务器
[[proxies]]
name = "minecraft"
type = "tcp"
localIP = "127.0.0.1"
localPort = 25565
remotePort = 25565

# HTTP 隧道示例：穿透 Web 服务
[[proxies]]
name = "web"
type = "http"
localIP = "127.0.0.1"
localPort = 8080
customDomains = ["example.yourdomain.com"]

# UDP 隧道示例
[[proxies]]
name = "dns"
type = "udp"
localIP = "127.0.0.1"
localPort = 53
remotePort = 5353
```

#### 启动客户端

**Windows：**
```powershell
# 命令行启动
frpc.exe -c frpc.toml
```

**Linux：**
```bash
# 前台运行
./frpc -c frpc.toml

# 后台运行
nohup ./frpc -c frpc.toml > /dev/null 2>&1 &
```

#### Linux 客户端 systemd 服务

创建 `/etc/systemd/system/frpc.service`：

```ini
[Unit]
Description=FRP Client
After=network.target

[Service]
Type=simple
ExecStart=/opt/frp/frpc -c /opt/frp/frpc.toml
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable frpc
sudo systemctl start frpc
```

### 安全建议

1. **使用强密码**：`auth.token` 应设置为复杂的随机字符串
2. **限制端口范围**：在服务端配置中限制允许的远程端口范围
   ```toml
   allowPorts = [
     { start = 10000, end = 20000 }
   ]
   ```
3. **启用 TLS 加密**：
   ```toml
   # 服务端
   transport.tls.force = true
   
   # 客户端
   transport.tls.enable = true
   ```
4. **配置防火墙**：仅开放必要的端口
5. **定期更新**：及时更新 FRP 到最新版本
6. **监控日志**：定期检查日志文件，发现异常访问

## 其他 FRP 服务

除了上述推荐的服务外，还有一些其他 FRP 服务可供选择：

| 服务名称 | 官网 | 特点 |
|----------|------|------|
| Ngrok | https://ngrok.com/ | 国际知名，功能强大，国内访问可能较慢 |
| NATAPP | https://natapp.cn/ | 国内服务，有免费隧道 |
| 花生壳 | https://hsk.oray.com/ | 老牌服务商，支持多种协议 |
| cpolar | https://www.cpolar.com/ | 国内服务，有免费额度 |
| 神卓互联 | https://www.shenzhuohl.com/ | 企业级服务 |

> 选择服务时需考虑：稳定性、速度、价格、节点位置、技术支持等因素。

## 方案对比表

| 对比项 | Sakura FRP | ChmlFRP | 自建 FRP |
|--------|------------|---------|----------|
| **难度** | ⭐ 简单 | ⭐ 简单 | ⭐⭐⭐ 较难 |
| **成本** | 免费/付费 | 免费/付费 | 服务器费用 |
| **稳定性** | ⭐⭐⭐ 高 | ⭐⭐ 中等 | ⭐⭐⭐ 取决于服务器 |
| **速度** | 受节点限制 | 受节点限制 | 取决于服务器带宽 |
| **自定义** | 有限 | 有限 | 完全自定义 |
| **隧道数量** | 有限制 | 有限制 | 无限制 |
| **流量限制** | 有 | 有 | 无 |
| **适合人群** | 新手、一般用户 | 新手、一般用户 | 有服务器的进阶用户 |
| **技术支持** | 有 | 有 | 自行解决 |

### 选择建议

- **新手用户**：推荐使用 Sakura FRP，文档完善，社区活跃
- **预算有限**：ChmlFRP 提供较多免费额度
- **追求稳定和速度**：自建 FRP + 优质云服务器
- **企业用户**：建议自建或使用企业级服务

## 常见问题

### 连接问题

**Q：客户端无法连接服务端？**

A：检查以下几点：
1. 服务端防火墙/安全组是否开放了 frp 端口（默认 7000）
2. `auth.token` 是否与服务端一致
3. 服务端 IP 地址是否正确
4. 服务端 frps 是否正常运行

**Q：隧道创建成功但无法访问？**

A：
1. 检查本地服务是否正常运行
2. 检查 `localIP` 和 `localPort` 配置是否正确
3. 检查远程端口是否被占用
4. 检查服务端防火墙是否开放了远程端口

### 性能问题

**Q：穿透速度很慢？**

A：
1. 选择距离更近、负载更低的节点
2. 检查本地网络和服务器网络状况
3. 考虑升级到付费套餐获得更高带宽
4. 自建方案可选择带宽更高的服务器

**Q：连接经常断开？**

A：
1. 检查网络稳定性
2. 在配置中启用心跳检测
3. 使用 systemd 服务实现自动重连

### 安全问题

**Q：如何防止未授权访问？**

A：
1. 使用强密码作为 `auth.token`
2. 启用 TLS 加密传输
3. 限制允许的端口范围
4. 对敏感服务添加额外的认证机制

**Q：日志中出现大量连接尝试？**

A：
1. 可能是端口扫描，属于正常现象
2. 确保使用了强密码
3. 考虑更换服务端口
4. 配置 fail2ban 等工具防止暴力破解

### 配置问题

**Q：如何同时穿透多个服务？**

A：在 `frpc.toml` 中添加多个 `[[proxies]]` 配置块，每个服务使用不同的名称和端口。

**Q：如何使用域名访问？**

A：
1. 将域名解析到服务端 IP
2. 使用 HTTP/HTTPS 类型隧道
3. 在 `customDomains` 中配置域名

```toml
[[proxies]]
name = "web"
type = "http"
localIP = "127.0.0.1"
localPort = 80
customDomains = ["your.domain.com"]
```

### 第三方服务问题

**Q：Sakura FRP 免费额度用完了怎么办？**

A：
1. 等待次日额度重置
2. 购买付费套餐
3. 尝试其他免费服务如 ChmlFRP
4. 考虑自建 FRP

**Q：节点选择有什么技巧？**

A：
1. 选择延迟低的节点（通常距离近）
2. 避开高负载节点
3. 根据用途选择（游戏选低延迟，下载选高带宽）
4. 多尝试不同节点找到最适合的
