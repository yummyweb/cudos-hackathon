use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::Addr;
use cw_storage_plus::Map;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    pub name: String,
    pub venue: String,
    pub description: String,
    pub price: i32,
    pub owner: Addr
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Ticket {
    pub event: String,
    pub id: String,
    pub owner: Addr
}

pub const STATE: Map<&str,  State> = Map::new("state");
pub const TICKETS: Map<&str,  Ticket> = Map::new("tickets");
