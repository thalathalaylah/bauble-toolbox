use bauble_toolbox_logic::{read_config, Link, Task};
use tauri::{LogicalPosition, LogicalSize, State, WebviewUrl, Manager};
use tauri_plugin_dialog::{DialogExt, MessageDialogButtons};

struct AppState {
    tasks: Vec<Task>,
    links: Vec<Link>
}

#[tauri::command]
fn get_tasks(state: State<AppState>) -> Vec<Task> {
    state.tasks.clone()
}

#[tauri::command]
fn get_links(state: State<AppState>) -> Vec<Link> {
    state.links.clone()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // context を1回だけ生成
    let context = tauri::generate_context!("./tauri.conf.json");
    
    // 最小限のTauriアプリを作成（エラーダイアログ用）
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init());

    match read_config("./config.json") {
        Ok(_config) => {
            let tasks = _config.tasks.clone();
            let links = _config.links.clone();
            let app_state = AppState { tasks, links };

            builder
                .plugin(tauri_plugin_shell::init())
                .manage(app_state)
                .setup(move |app| {
                    let width = _config.window.width as f64;
                    let height = _config.window.height as f64;

                    let left_window = width / 4.;

                    let window = match tauri::window::WindowBuilder::new(app, "main")
                        .inner_size(width, height)
                        .build() {
                            Ok(window) => window,
                            Err(e) => {
                                let app_handle = app.app_handle();
                                app_handle.dialog()
                                    .message(format!("ウィンドウの作成に失敗しました: {}", e))
                                    .title("エラー")
                                    .buttons(MessageDialogButtons::Ok)
                                    .blocking_show();
                                std::process::exit(1);
                            }
                        };

                    // `side_url` が空文字列でない場合のみ `main1` ウェブビューを生成
                    if !_config.window.side_url.is_empty() {
                        // side_urlのパース
                        let side_url = match _config.window.side_url.parse() {
                            Ok(url) => url,
                            Err(e) => {
                                let app_handle = app.app_handle();
                                app_handle.dialog()
                                    .message(format!("サイドURLの解析に失敗しました: {}", e))
                                    .title("エラー")
                                    .buttons(MessageDialogButtons::Ok)
                                    .blocking_show();
                                std::process::exit(1);
                            }
                        };

                        let _webview1 = match window.add_child(
                            tauri::webview::WebviewBuilder::new(
                                "main1",
                                WebviewUrl::External(side_url),
                            )
                            .auto_resize(),
                            LogicalPosition::new(0., 0.),
                            LogicalSize::new(left_window, height),
                        ) {
                            Ok(webview) => webview,
                            Err(e) => {
                                let app_handle = app.app_handle();
                                app_handle.dialog()
                                    .message(format!("サイドビューの作成に失敗しました: {}", e))
                                    .title("エラー")
                                    .buttons(MessageDialogButtons::Ok)
                                    .blocking_show();
                                std::process::exit(1);
                            }
                        };
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

                    let _webview2 = match window.add_child(
                        tauri::webview::WebviewBuilder::new(
                            "main2",
                            WebviewUrl::App(Default::default()),
                        )
                        .auto_resize(),
                        LogicalPosition::new(main2_left_window, 0.),
                        LogicalSize::new(main2_width, height),
                    ) {
                        Ok(webview) => webview,
                        Err(e) => {
                            let app_handle = app.app_handle();
                            app_handle.dialog()
                                .message(format!("メインビューの作成に失敗しました: {}", e))
                                .title("エラー")
                                .buttons(MessageDialogButtons::Ok)
                                .blocking_show();
                            std::process::exit(1);
                        }
                    };

                    Ok(())
                })
                .invoke_handler(tauri::generate_handler![get_tasks, get_links])
                .run(context)
                .expect("error while running tauri application");
        }
        Err(e) => {
            // 設定ファイルの読み込みに失敗した場合は、最小限のアプリを実行してダイアログを表示
            builder
                .setup(move |app| {
                    let app_handle = app.app_handle();
                    app_handle.dialog()
                        .message(format!("設定ファイルの読み込みに失敗しました: {}", e))
                        .title("エラー")
                        .buttons(MessageDialogButtons::Ok)
                        .blocking_show();
                    std::process::exit(1);
                })
                .run(context)
                .expect("error while showing error dialog");
        }
    }
}