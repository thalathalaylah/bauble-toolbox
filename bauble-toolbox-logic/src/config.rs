use std::fs;
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub struct Task {
    pub name: String
}
#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub struct WindowSetting {
    pub width: i32,
    pub height: i32,
    pub side_url: String
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub struct Config {
    pub window: WindowSetting,
    pub tasks: Vec<Task>
}

use thiserror::Error;

#[derive(Debug, Error)]
pub enum ConfigError {
    #[error("I/O Error occurred: {0}")]
    IoError(#[from] std::io::Error),

    #[error("JSON parsing error: {0}")]
    JsonError(#[from] serde_json::Error),

    #[error("Unknown error")]
    Unknown,
}

type Result<T> = std::result::Result<T, ConfigError>;

pub fn read_config(config_path: &str) -> Result<Config> {
    let conf_string = fs::read_to_string(config_path)?;
    let config: Config = serde_json::from_str(&conf_string)?;
    Ok(config)
}
