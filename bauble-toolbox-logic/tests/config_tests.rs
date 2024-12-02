use bauble_toolbox_logic::{read_config, Config, ConfigError, WindowSetting, Task, Link}; //  your crate name

#[test]
fn read_config_test() {
    let expected_conf = Config {
        window: WindowSetting {
            width: 800,
            height: 600,
            side_url: "http://example.com".to_string()
        },
        tasks: vec![
            Task {
                name: "Task1".to_string(),
                link: Some("Link1".to_string())
            },
            Task {
                name: "Task2".to_string(),
                link: None
            }
        ],
        links: vec![
            Link {
                name: "Link1".to_string(),
                link: "example".to_string()
            }
        ]
    };

    match read_config("./test_files/test_input.json") {
        Ok(config) => assert_eq!(config, expected_conf),
        Err(e) => panic!("Failed to read config: {}", e),
    }
}

// 読もうとしたファイルが存在しなかった場合
#[test]
fn read_nonexistent_config_test() {
    match read_config("./test_files/nonexistent.json") {
        Ok(_) => panic!("Expected an error, but got a config"),
        Err(e) => match e {
            ConfigError::IoError(_) => {} // Expected error type
            _ => panic!("Unexpected error type: {}", e),
        }
    }
}

// 読んだファイルがconfigとして不正なjsonだった場合
#[test]
fn read_invalid_format_config_test() {
    match read_config("./test_files/test_fail_input.json") {
        Ok(_) => panic!("Expected an error, but got a config"),
        Err(e) => match e {
            ConfigError::JsonError(_) => {} // Expected error type
            _ => panic!("Unexpected error type: {}", e),
        }
    }
}