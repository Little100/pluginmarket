# P2P 联机

本文档介绍如何使用 P2P（点对点）技术实现 Minecraft 服务器的联机，适用于没有公网 IP 的玩家。

## 概述

### 什么是 P2P 联机

P2P（Peer-to-Peer，点对点）联机是一种无需中心服务器的网络连接方式。在 P2P 网络中，每个参与者既是客户端也是服务端，数据直接在参与者之间传输，而不需要经过第三方服务器中转。

对于 Minecraft 开服场景，P2P 联机允许没有公网 IP 的玩家通过 NAT 穿透技术，让其他玩家直接连接到自己的服务器。

### 工作原理

P2P 联机的核心技术是 NAT 穿透（NAT Traversal），主要包括以下步骤：

1. **STUN 服务器探测**：客户端首先连接 STUN（Session Traversal Utilities for NAT）服务器，获取自己的公网 IP 和端口映射信息
2. **信息交换**：双方通过信令服务器交换各自的网络信息（公网 IP、端口、NAT 类型等）
3. **打洞（Hole Punching）**：双方同时向对方发送数据包，在各自的 NAT 设备上创建映射规则
4. **直连建立**：打洞成功后，双方可以直接通信，无需中转

如果 NAT 穿透失败（例如双方都是对称型 NAT），则需要通过 TURN 服务器进行数据中转。

## P2P 联机的优缺点

### 优点

| 优点 | 说明 |
|------|------|
| 无需公网 IP | 即使在内网环境下也能让其他玩家连接 |
| 无需购买服务器 | 使用自己的电脑作为服务器，节省成本 |
| 延迟较低 | 直连成功时，数据不经过第三方服务器，延迟通常比中转方案更低 |
| 带宽充足 | 直连时可以充分利用双方的网络带宽 |
| 配置简单 | 大多数 P2P 工具提供图形界面，操作简便 |

### 缺点

| 缺点 | 说明 |
|------|------|
| NAT 类型限制 | 某些 NAT 类型组合无法穿透，需要中转 |
| 稳定性不足 | 连接可能因网络波动而中断 |
| 依赖第三方服务 | 需要依赖 STUN/TURN 服务器和信令服务器 |
| 安全性考虑 | 暴露真实 IP 地址，存在一定安全风险 |
| 性能受限 | 服务器性能取决于主机电脑配置 |

## OPL（开放对等联机）

> **推荐平台**：Windows  
> **适用场景**：Minecraft 基岩版和 Java 版联机

### 简介

OPL（Open Peer-to-Peer Link，开放对等联机）是一款专为 Minecraft 设计的 P2P 联机工具，由国内开发者维护。它提供简洁的图形界面，支持一键创建和加入联机房间，特别适合不熟悉网络配置的玩家使用。

### 下载地址

| 平台 | 下载方式 |
|------|----------|
| Windows | [GitHub Releases](https://github.com/OPL-MCBE/OPL/releases/latest) |
| Android | GitHub Releases 或 APKPure |

> **注意**：请务必从官方渠道下载，避免使用第三方网盘分享的版本，以防止病毒和恶意软件。

### 安装步骤（Windows）

1. 访问 GitHub Releases 页面下载最新版本的 `OPL.zip`
2. 解压到任意目录（建议路径不含中文）
3. 运行 `OPL.exe`
4. 首次运行时，Windows 防火墙可能弹出提示，选择"允许访问"

### 使用方法

#### 创建房间（服务器端）

1. 启动 OPL 客户端
2. 点击"创建房间"
3. 设置房间名称和密码（可选）
4. 记录显示的房间 ID
5. 启动 Minecraft 服务器
6. 将房间 ID 分享给其他玩家

#### 加入房间（客户端）

1. 启动 OPL 客户端
2. 点击"加入房间"
3. 输入房间 ID 和密码（如有）
4. 等待连接建立
5. 使用 OPL 显示的本地地址连接 Minecraft 服务器

### 配置说明

OPL 的配置文件位于程序目录下的 `config.json`：

```json
{
  "stun_server": "stun.l.google.com:19302",
  "turn_server": "",
  "turn_username": "",
  "turn_password": "",
  "local_port": 25565
}
```

| 配置项 | 说明 |
|--------|------|
| `stun_server` | STUN 服务器地址，用于 NAT 探测 |
| `turn_server` | TURN 中转服务器地址（可选） |
| `local_port` | 本地监听端口，需与 Minecraft 服务器端口一致 |

### 注意事项

- 确保 Minecraft 服务器已启动并监听正确端口
- 防火墙需允许 OPL 和 Minecraft 的网络访问
- 如果连接失败，尝试更换 STUN 服务器
- 对称型 NAT 用户可能需要配置 TURN 服务器

## OpenP2P

> **推荐平台**：Windows / Linux / macOS（跨平台）  
> **官方推荐**：功能完善，社区活跃

### 简介

OpenP2P 是一个开源、免费、轻量级的 P2P 共享网络工具，支持内网穿透、异地组网、远程访问等场景。它采用 P2P 直连优先的策略，在直连失败时自动切换到中转模式，确保连接的可靠性。

项目特点：
- 开源免费，永久可用
- 支持 P2P 直连，可跑满带宽
- 提供 Web 控制台，便于管理
- 支持多种平台和架构

### 下载地址

| 资源 | 地址 |
|------|------|
| 官方网站 | https://openp2p.cn/ |
| 控制台 | https://console.openp2p.cn/ |
| GitHub 仓库 | https://github.com/openp2p-cn/openp2p |
| 下载页面 | https://github.com/openp2p-cn/openp2p/releases |

### 安装步骤

#### Windows

1. 访问 [GitHub Releases](https://github.com/openp2p-cn/openp2p/releases) 下载 `openp2p-windows-amd64.zip`
2. 解压到任意目录
3. 以管理员身份运行 `openp2p.exe`
4. 首次运行会自动安装为系统服务

#### Linux

```bash
# 下载最新版本（以 amd64 为例）
wget https://github.com/openp2p-cn/openp2p/releases/latest/download/openp2p-linux-amd64.tar.gz

# 解压
tar -xzf openp2p-linux-amd64.tar.gz

# 添加执行权限
chmod +x openp2p

# 安装为系统服务
sudo ./openp2p -d -i

# 启动服务
sudo systemctl start openp2p
```

### 使用方法

#### 1. 注册账号

访问 https://console.openp2p.cn/ 注册账号（免费，无需手机验证）。

#### 2. 添加设备

在控制台中添加设备，获取设备 Token。

#### 3. 配置客户端

编辑配置文件或使用命令行参数：

```bash
# 使用 Token 启动
./openp2p -token YOUR_TOKEN
```

#### 4. 创建 P2P 应用

在控制台中创建应用，配置：
- 源设备：运行 Minecraft 服务器的设备
- 目标端口：Minecraft 服务器端口（默认 25565）
- 协议：TCP

#### 5. 连接服务器

其他玩家使用控制台分配的地址连接 Minecraft 服务器。

### 配置文件

配置文件位于程序目录下的 `config.json`：

```json
{
  "network": {
    "token": "YOUR_TOKEN",
    "node": "openp2p.cn"
  },
  "apps": [
    {
      "name": "minecraft",
      "protocol": "tcp",
      "src_port": 25565,
      "peer_node": "TARGET_DEVICE_ID",
      "dst_port": 25565
    }
  ]
}
```

### 注意事项

- 首次使用需要注册控制台账号
- 确保防火墙允许 OpenP2P 的网络访问
- 中转模式下带宽限制为 10Mbps（共享节点模式）
- 建议将 OpenP2P 安装为系统服务，确保开机自启

## 其他 P2P 工具

除了 OPL 和 OpenP2P，还有一些其他可用于 Minecraft 联机的 P2P 工具。

### ZeroTier

ZeroTier 是一个软件定义网络（SDN）平台，可以创建虚拟局域网。

| 项目 | 说明 |
|------|------|
| 官网 | https://www.zerotier.com/ |
| 特点 | 免费版支持 25 个设备，配置简单 |
| 适用场景 | 需要稳定虚拟局域网的场景 |

基本使用步骤：
1. 注册 ZeroTier 账号并创建网络
2. 在所有设备上安装 ZeroTier 客户端
3. 加入同一网络 ID
4. 使用 ZeroTier 分配的虚拟 IP 连接

### Tailscale

Tailscale 基于 WireGuard 协议，提供安全的点对点连接。

| 项目 | 说明 |
|------|------|
| 官网 | https://tailscale.com/ |
| 特点 | 安全性高，配置简单，支持 SSO 登录 |
| 适用场景 | 注重安全性的个人或小团队 |

### Radmin VPN

Radmin VPN 是一款免费的虚拟局域网工具。

| 项目 | 说明 |
|------|------|
| 官网 | https://www.radmin-vpn.com/ |
| 特点 | 完全免费，无设备数量限制 |
| 适用场景 | Windows 用户的局域网联机 |

> 对国内非常不友好, 非常不推荐

### Hamachi

LogMeIn Hamachi 是老牌的虚拟局域网软件。

| 项目 | 说明 |
|------|------|
| 官网 | https://vpn.net/ |
| 特点 | 免费版支持 5 个设备 |
| 适用场景 | 小规模联机 |

> **提示**：虚拟局域网方案（ZeroTier、Radmin VPN、Hamachi）与纯 P2P 方案的区别在于，它们会创建一个虚拟网络接口，所有设备获得虚拟 IP 地址，相当于处于同一局域网中。

## NAT 类型说明

NAT（Network Address Translation，网络地址转换）类型直接影响 P2P 连接的成功率。了解 NAT 类型有助于判断是否能够成功建立 P2P 连接。

### NAT 类型分类

| NAT 类型 | 英文名称 | 穿透难度 | 说明 |
|----------|----------|----------|------|
| 全锥形 | Full Cone | 最易 | 外部任何主机都可以通过映射的公网地址访问内网主机 |
| 受限锥形 | Restricted Cone | 较易 | 只有内网主机主动联系过的外部 IP 才能访问 |
| 端口受限锥形 | Port Restricted Cone | 中等 | 只有内网主机主动联系过的外部 IP:Port 才能访问 |
| 对称型 | Symmetric | 最难 | 每次连接不同目标时使用不同的端口映射 |

### NAT 穿透兼容性

下表展示不同 NAT 类型组合的穿透可能性：

| 类型组合 | 全锥形 | 受限锥形 | 端口受限锥形 | 对称型 |
|----------|--------|----------|--------------|--------|
| 全锥形 | ✅ 可穿透 | ✅ 可穿透 | ✅ 可穿透 | ✅ 可穿透 |
| 受限锥形 | ✅ 可穿透 | ✅ 可穿透 | ✅ 可穿透 | ⚠️ 困难 |
| 端口受限锥形 | ✅ 可穿透 | ✅ 可穿透 | ✅ 可穿透 | ❌ 无法穿透 |
| 对称型 | ✅ 可穿透 | ⚠️ 困难 | ❌ 无法穿透 | ❌ 无法穿透 |

> **说明**：
> - ✅ 可穿透：可以直接建立 P2P 连接
> - ⚠️ 困难：需要特殊技术，成功率较低
> - ❌ 无法穿透：必须使用中转服务器

### 检测 NAT 类型

#### 方法一：使用在线工具

访问以下网站检测 NAT 类型：
- https://www.stunprotocol.org/
- https://natcheck.net/

#### 方法二：使用命令行工具

**Windows（使用 Python）**：

```bash
pip install pystun3
python -m stun
```

**Linux**：

```bash
# 安装 stun-client
sudo apt install stun-client

# 检测 NAT 类型
stun stun.l.google.com:19302
```

#### 方法三：使用 P2P 工具内置检测

大多数 P2P 工具（如 OpenP2P）在连接时会自动检测并显示 NAT 类型。

### 改善 NAT 类型的方法

如果 NAT 类型不理想，可以尝试以下方法：

1. **启用 UPnP**：在路由器设置中启用 UPnP（通用即插即用）
2. **设置 DMZ**：将主机设置为 DMZ 主机（安全性较低，谨慎使用）
3. **端口转发**：手动配置端口转发规则
4. **更换网络**：使用手机热点或其他网络环境测试
5. **联系运营商**：部分运营商可以申请更换 NAT 类型

## 方案对比表

| 方案 | 平台支持 | 是否免费 | 配置难度 | 稳定性 | 推荐场景 |
|------|----------|----------|----------|--------|----------|
| OPL | Windows、Android | ✅ 免费 | ⭐ 简单 | ⭐⭐⭐ 中等 | Windows 用户快速联机 |
| OpenP2P | 全平台 | ✅ 免费 | ⭐⭐ 中等 | ⭐⭐⭐⭐ 较好 | 跨平台、长期稳定使用 |
| ZeroTier | 全平台 | ✅ 免费（25设备） | ⭐⭐ 中等 | ⭐⭐⭐⭐ 较好 | 需要虚拟局域网 |
| Tailscale | 全平台 | ✅ 免费（个人） | ⭐ 简单 | ⭐⭐⭐⭐⭐ 优秀 | 注重安全性 |
| Radmin VPN | Windows | ✅ 免费 | ⭐ 简单 | ⭐⭐⭐ 中等 | Windows 局域网联机 |
| Hamachi | 全平台 | ⚠️ 部分免费 | ⭐ 简单 | ⭐⭐⭐ 中等 | 小规模联机（≤5人） |

### 选择建议

- **Windows 用户首选**：OPL，配置简单，专为 Minecraft 设计
- **跨平台需求**：OpenP2P，功能完善，社区活跃
- **追求稳定性**：ZeroTier 或 Tailscale，企业级方案
- **临时联机**：Radmin VPN 或 Hamachi，快速建立连接

## 常见问题

### 连接相关

**Q：P2P 连接失败怎么办？**

A：按以下步骤排查：
1. 检查防火墙设置，确保允许 P2P 工具的网络访问
2. 检测双方的 NAT 类型，确认是否支持穿透
3. 尝试更换 STUN 服务器
4. 如果双方都是对称型 NAT，需要使用中转服务器

**Q：连接成功但延迟很高？**

A：可能的原因：
1. 正在使用中转模式而非直连
2. 双方物理距离较远
3. 网络带宽不足
4. 尝试更换 P2P 工具或网络环境

**Q：连接经常断开？**

A：建议：
1. 检查网络稳定性
2. 确保 P2P 工具保持运行
3. 避免同时进行大流量下载
4. 考虑使用更稳定的方案（如 ZeroTier）

### 配置相关

**Q：如何确认 Minecraft 服务器端口？**

A：查看 `server.properties` 文件中的 `server-port` 配置项，默认为 25565。

**Q：需要在路由器上做端口转发吗？**

A：使用 P2P 工具时通常不需要端口转发，这正是 P2P 的优势所在。但如果 P2P 穿透失败，端口转发可以作为备选方案。

**Q：多个玩家可以同时连接吗？**

A：可以。P2P 工具建立的是网络通道，Minecraft 服务器本身支持多人连接。

### 安全相关

**Q：使用 P2P 联机安全吗？**

A：注意以下几点：
1. 从官方渠道下载工具
2. P2P 直连会暴露真实 IP，注意隐私保护
3. 定期更新 P2P 工具
4. 不要在公共网络上使用敏感账号

**Q：如何保护服务器不被攻击？**

A：建议措施：
1. 设置服务器白名单
2. 使用强密码保护 P2P 房间
3. 只将连接信息分享给信任的玩家
4. 考虑使用 Tailscale 等安全性更高的方案

