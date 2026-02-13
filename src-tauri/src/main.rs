// 在 Windows 上，正常双击启动时隐藏控制台窗口
// 但如果从命令行启动，仍然可以看到输出
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

fn main() {
    mc_plugin_market_lib::run()
}
