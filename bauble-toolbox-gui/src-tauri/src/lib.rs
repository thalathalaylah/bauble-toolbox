// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_strings() -> Vec<String> {
    vec!["string1".into(), "string2".into(), "string3".into()]
}

use tauri::{LogicalPosition, LogicalSize, WebviewUrl};
use bauble_toolbox_logic::read_config;
#[cfg_attr(mobile, tauri::mobile_entry_point)]

pub fn run() {
    // TODO: release buildの場合は適切な場所からconfを読む必要がある
    match read_config("./config.json") {
        Ok(_config) => {
            // Configが読み込めた場合はアプリケーションをそのまま実行
            tauri::Builder::default()
                .setup(move |app| {
                    let width = _config.window.width as f64;
                    let height = _config.window.height as f64;

                    let left_window = width / 4.;

                    let window = tauri::window::WindowBuilder::new(app, "main")
                        .inner_size(width, height)
                        .build()?;

                    // `side_url` が空文字列でない場合のみ `main1` ウェブビューを生成
                    if !_config.window.side_url.is_empty() {
                        let _webview1 = window.add_child(
                            tauri::webview::WebviewBuilder::new(
                                "main1",
                                WebviewUrl::External(_config.window.side_url.parse().unwrap()),
                            )
                                .auto_resize(),
                            LogicalPosition::new(0., 0.),
                            LogicalSize::new(left_window, height),
                        )?;
                    }

                    let main2_width = if !_config.window.side_url.is_empty() {
                        width - left_window
                    } else {
                        width
                    };
                    let main2_left_window = if !_config.window.side_url.is_empty() {
                        left_window
                    } else {
                        0.
                    };

                    let _webview2 = window.add_child(
                        tauri::webview::WebviewBuilder::new(
                            "main2",
                            WebviewUrl::App(Default::default()),
                        )
                            .auto_resize(),
                        LogicalPosition::new(main2_left_window, 0.),
                        LogicalSize::new(main2_width, height),
                    )?;

                    Ok(())
                })
                .invoke_handler(tauri::generate_handler![get_strings])
                .run(tauri::generate_context!("./tauri.conf.json"))
                .expect("error while running tauri application");
        }
        Err(e) => {
            // Configが読み込めなかった場合はエラーメッセージを表示して終了
            eprintln!("Failed to read config: {}", e);
        }
    }
}