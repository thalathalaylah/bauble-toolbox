// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use tauri::{LogicalPosition, LogicalSize, WebviewUrl};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let width = 1920.;
            let height = 1080.;

            let left_window = width / 4.;

            let window = tauri::window::WindowBuilder::new(app, "main")
                .inner_size(width, height)
                .build()?;

            let _webview1 = window.add_child(
                tauri::webview::WebviewBuilder::new(
                    "main1",
                    WebviewUrl::External("https://github.com/tauri-apps/tauri".parse().unwrap()),
                )
                    .auto_resize(),
                LogicalPosition::new(0., 0.),
                LogicalSize::new(left_window, height),
            )?;

            let _webview2 = window.add_child(
                tauri::webview::WebviewBuilder::new(
                    "main2",
                    WebviewUrl::App(Default::default()),
                )
                    .auto_resize(),
                LogicalPosition::new(left_window, 0.),
                LogicalSize::new(width - left_window, height),
            )?;

            Ok(())
        })
        .run(tauri::generate_context!("./tauri.conf.json"))
        .expect("error while running tauri application")
}
