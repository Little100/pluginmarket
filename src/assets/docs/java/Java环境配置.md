# Java 环境配置指南

Minecraft 服务端运行需要 Java 运行环境。不同版本的 Minecraft 对 Java 版本有不同的要求，选择正确的 Java 版本是服务器稳定运行的基础。

## MC 版本与 Java 版本对应关系

| Minecraft 版本 | 最低 Java 版本 | 推荐 Java 版本 |
|---------------|---------------|---------------|
| 1.7.x ~ 1.16.x | Java 8 | Java 8 |
| 1.17.x | Java 16 | Java 17 |
| 1.18.x ~ 1.20.4 | Java 17 | Java 17 |
| 1.20.5 ~ 1.21.x | Java 21 | Java 21 |

> **注意**：使用高于最低要求的 Java 版本通常是安全的，但某些旧版插件可能存在兼容性问题。建议使用推荐版本以获得最佳兼容性和性能。

## 推荐的 JDK 发行版

Java 有多个发行版可供选择，以下是 Minecraft 服务器常用的几个发行版：

### Eclipse Adoptium (Temurin)

- **官网**：https://adoptium.net/
- **特点**：社区首选，完全免费开源，由 Eclipse 基金会维护
- **适用场景**：适合大多数用户，是新手的最佳选择
- **支持版本**：Java 8、11、17、21 等 LTS 版本

### Amazon Corretto

- **官网**：https://aws.amazon.com/corretto/
- **特点**：亚马逊维护，提供长期支持，包含性能优化补丁
- **适用场景**：适合需要长期稳定运行的生产环境
- **支持版本**：Java 8、11、17、21 等

### Azul Zulu ———— 个人最推荐

- **官网**：https://www.azul.com/downloads/
- **特点**：性能优秀，提供多种 CPU 架构支持
- **适用场景**：适合追求性能的用户
- **支持版本**：覆盖 Java 6 到最新版本

### GraalVM

- **官网**：https://www.graalvm.org/downloads/
- **特点**：高性能 JIT 编译器，可显著提升运行效率
- **适用场景**：适合高性能需求的大型服务器
- **支持版本**：Java 17、21 等
- **注意**：配置相对复杂，建议有一定经验后再使用

### Oracle JDK

- **官网**：https://www.oracle.com/java/technologies/downloads/
- **特点**：Oracle 官方版本，功能完整
- **适用场景**：个人学习和开发
- **注意**：商业使用需要注意许可证条款，从 Java 17 开始采用免费许可

### 发行版选择建议

| 使用场景 | 推荐发行版 |
|---------|-----------|
| 新手入门 | Eclipse Adoptium |
| 生产环境 | Amazon Corretto / Adoptium |
| 追求性能 | GraalVM / Azul Zulu |
| 企业环境 | Amazon Corretto |

## Windows 安装步骤

以 Eclipse Adoptium (Temurin) 为例介绍安装过程。

### 1. 下载安装包

1. 访问 https://adoptium.net/
2. 选择需要的 Java 版本（如 Java 21）
3. 选择操作系统为 Windows
4. 选择架构为 x64（64 位）
5. 下载 `.msi` 安装包

### 2. 运行安装程序

1. 双击下载的 `.msi` 文件
2. 在安装选项页面，确保勾选以下选项：
   - **Set JAVA_HOME variable**（设置 JAVA_HOME 环境变量）
   - **Add to PATH**（添加到系统 PATH）
   - **Associate .jar**（关联 .jar 文件，可选）
3. 点击 Next 完成安装

### 3. 手动配置环境变量（可选）

如果安装时未勾选自动配置，或需要手动修改，按以下步骤操作：

#### 设置 JAVA_HOME

1. 右键点击「此电脑」→「属性」→「高级系统设置」
2. 点击「环境变量」按钮
3. 在「系统变量」区域点击「新建」
4. 变量名输入：`JAVA_HOME`
5. 变量值输入 Java 安装路径，例如：
   ```
   C:\Program Files\Eclipse Adoptium\jdk-21.0.2.13-hotspot
   ```

#### 配置 PATH

1. 在「系统变量」中找到 `Path`，点击「编辑」
2. 点击「新建」，添加：
   ```
   %JAVA_HOME%\bin
   ```
3. 点击「确定」保存所有更改

### 4. 验证安装

打开命令提示符（Win + R，输入 `cmd`），执行：

```batch
java -version
```

正常输出示例：

```
openjdk version "21.0.2" 2024-01-16 LTS
OpenJDK Runtime Environment Temurin-21.0.2+13 (build 21.0.2+13-LTS)
OpenJDK 64-Bit Server VM Temurin-21.0.2+13 (build 21.0.2+13-LTS, mixed mode, sharing)
```

同时验证 JAVA_HOME 是否正确设置：

```batch
echo %JAVA_HOME%
```

## Linux 安装步骤

### 方法一：使用包管理器安装

#### Debian / Ubuntu

```bash
# 更新软件源
sudo apt update

# 安装 Adoptium 仓库
sudo apt install -y wget apt-transport-https
wget -qO - https://packages.adoptium.net/artifactory/api/gpg/key/public | sudo tee /etc/apt/keyrings/adoptium.asc
echo "deb [signed-by=/etc/apt/keyrings/adoptium.asc] https://packages.adoptium.net/artifactory/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/adoptium.list

# 更新并安装
sudo apt update
sudo apt install -y temurin-21-jdk
```

#### CentOS / RHEL / Rocky Linux

```bash
# 添加 Adoptium 仓库
cat <<EOF | sudo tee /etc/yum.repos.d/adoptium.repo
[Adoptium]
name=Adoptium
baseurl=https://packages.adoptium.net/artifactory/rpm/rhel/\$releasever/\$basearch
enabled=1
gpgcheck=1
gpgkey=https://packages.adoptium.net/artifactory/api/gpg/key/public
EOF

# 安装
sudo yum install -y temurin-21-jdk
```

#### 使用 Amazon Corretto（适用于 Amazon Linux）

```bash
# Amazon Linux 2
sudo yum install -y java-21-amazon-corretto-devel

# Amazon Linux 2023
sudo dnf install -y java-21-amazon-corretto-devel
```

### 方法二：手动下载安装

1. 下载压缩包：

```bash
# 以 Adoptium JDK 21 为例
wget https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.2%2B13/OpenJDK21U-jdk_x64_linux_hotspot_21.0.2_13.tar.gz
```

2. 解压到指定目录：

```bash
sudo mkdir -p /usr/local/java
sudo tar -xzf OpenJDK21U-jdk_x64_linux_hotspot_21.0.2_13.tar.gz -C /usr/local/java
```

3. 配置环境变量：

编辑 `/etc/profile`（全局生效）或 `~/.bashrc`（当前用户生效）：

```bash
sudo nano /etc/profile
```

在文件末尾添加：

```bash
export JAVA_HOME=/usr/local/java/jdk-21.0.2+13
export PATH=$JAVA_HOME/bin:$PATH
```

4. 使配置生效：

```bash
source /etc/profile
```

### 验证安装

```bash
java -version
echo $JAVA_HOME
```

## 多版本 Java 共存

运行不同版本的 Minecraft 服务器时，可能需要同时安装多个 Java 版本。

### Windows 多版本管理

#### 方法一：修改 JAVA_HOME

每次切换版本时修改 `JAVA_HOME` 环境变量指向对应的 Java 安装目录。

#### 方法二：在启动脚本中指定完整路径（推荐）

在服务器启动脚本中直接使用 Java 的完整路径，无需修改系统环境变量：

```batch
@echo off
"C:\Program Files\Eclipse Adoptium\jdk-21.0.2.13-hotspot\bin\java.exe" -Xms4G -Xmx4G -jar server.jar nogui
pause
```

对于 Java 8 的服务器：

```batch
@echo off
"C:\Program Files\Eclipse Adoptium\jdk-8.0.402.6-hotspot\bin\java.exe" -Xms4G -Xmx4G -jar server.jar nogui
pause
```

### Linux 多版本管理

#### 方法一：使用 update-alternatives

```bash
# 注册 Java 版本
sudo update-alternatives --install /usr/bin/java java /usr/local/java/jdk-21.0.2+13/bin/java 2100
sudo update-alternatives --install /usr/bin/java java /usr/local/java/jdk-17.0.10+7/bin/java 1700
sudo update-alternatives --install /usr/bin/java java /usr/local/java/jdk-8u402-b06/bin/java 800

# 切换默认版本
sudo update-alternatives --config java
```

执行 `--config` 后会显示已注册的版本列表，输入对应数字即可切换。

#### 方法二：在启动脚本中指定完整路径（推荐）

```bash
#!/bin/bash
/usr/local/java/jdk-21.0.2+13/bin/java -Xms4G -Xmx4G -jar server.jar nogui
```

对于 Java 8 的服务器：

```bash
#!/bin/bash
/usr/local/java/jdk-8u402-b06/bin/java -Xms4G -Xmx4G -jar server.jar nogui
```

### 启动脚本示例

以下是一个完整的启动脚本示例，支持自定义 Java 路径：

**Windows (start.bat)**：

```batch
@echo off
REM 设置 Java 路径，根据实际安装位置修改
set JAVA_PATH=C:\Program Files\Eclipse Adoptium\jdk-21.0.2.13-hotspot\bin\java.exe

REM 设置内存参数
set MIN_RAM=4G
set MAX_RAM=4G

REM 启动服务器
"%JAVA_PATH%" -Xms%MIN_RAM% -Xmx%MAX_RAM% -jar server.jar nogui
pause
```

**Linux (start.sh)**：

```bash
#!/bin/bash

# 设置 Java 路径，根据实际安装位置修改
JAVA_PATH=/usr/local/java/jdk-21.0.2+13/bin/java

# 设置内存参数
MIN_RAM=4G
MAX_RAM=4G

# 启动服务器
$JAVA_PATH -Xms$MIN_RAM -Xmx$MAX_RAM -jar server.jar nogui
```

## 常见问题

### 1. 安装后 `java -version` 无输出或报错

**问题表现**：

```
'java' 不是内部或外部命令，也不是可运行的程序或批处理文件。
```

或

```
bash: java: command not found
```

**解决方法**：

1. 确认 Java 已正确安装
2. 检查环境变量配置：
   - Windows：确认 `%JAVA_HOME%\bin` 已添加到 PATH
   - Linux：确认 `$JAVA_HOME/bin` 已添加到 PATH
3. 重新打开命令行窗口（环境变量修改后需要重新打开才能生效）
4. Windows 用户可尝试注销并重新登录

### 2. 32 位和 64 位的区别

**重要**：Minecraft 服务端必须使用 64 位 Java。

- 32 位 Java 最大只能分配约 1.5GB 内存，无法满足服务器需求
- 64 位 Java 可以分配更大的内存，支持更多玩家同时在线
- 现代操作系统几乎都是 64 位，应始终选择 64 位版本的 Java

**如何确认当前 Java 是 64 位**：

执行 `java -version`，输出中包含 `64-Bit` 字样表示是 64 位版本：

```
OpenJDK 64-Bit Server VM Temurin-21.0.2+13 (build 21.0.2+13-LTS, mixed mode, sharing)
```

### 3. JDK 和 JRE 的区别

| 类型 | 全称 | 说明 |
|-----|------|------|
| JRE | Java Runtime Environment | Java 运行时环境，只能运行 Java 程序 |
| JDK | Java Development Kit | Java 开发工具包，包含 JRE 和开发工具 |

**建议**：安装 JDK 而非 JRE。

原因：
- 部分插件和工具需要 JDK 中的组件
- JDK 包含更完整的诊断工具，便于排查问题
- 现代 Java 发行版（Java 11+）已不再单独提供 JRE

### 4. 出现 `UnsupportedClassVersionError` 错误

**问题表现**：

```
Exception in thread "main" java.lang.UnsupportedClassVersionError: xxx has been compiled by a more recent version of the Java Runtime
```

**原因**：使用的 Java 版本低于服务端或插件要求的版本。

**解决方法**：升级到对应版本的 Java。参考本文开头的版本对应表。

### 5. 多个 Java 版本冲突

**问题表现**：明明安装了正确版本的 Java，但 `java -version` 显示的是其他版本。

**解决方法**：

1. 检查 PATH 环境变量中是否有多个 Java 路径
2. 确保需要的 Java 版本路径在 PATH 中的位置靠前
3. 或者在启动脚本中使用 Java 的完整路径（推荐）

### 6. Linux 下权限问题

**问题表现**：

```
bash: /usr/local/java/jdk-21.0.2+13/bin/java: Permission denied
```

**解决方法**：

```bash
sudo chmod +x /usr/local/java/jdk-21.0.2+13/bin/java
```

或为整个 bin 目录添加执行权限：

```bash
sudo chmod -R +x /usr/local/java/jdk-21.0.2+13/bin/
```
