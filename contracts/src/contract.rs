#[cfg(not(feature = "library"))]
use std::str;
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Order};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{EventResponse, ExecuteMsg, InstantiateMsg, QueryMsg, TicketResponse, TicketEntry, Entry};
use crate::state::{State, STATE, Ticket, TICKETS};


// version info for migration info
const CONTRACT_NAME: &str = "crates.io:debook";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Create { name, venue, description, price, id } => try_create(deps, info, name, venue, description, price, id),
        ExecuteMsg::BuyTicket { event, ticketId, id } => try_buy(deps, info, event, ticketId, id),
    }
}

pub fn try_create(
    deps: DepsMut,
    info: MessageInfo,
    name: String,
    venue: String,
    description: String,
    price: i32,
    id: String,
) -> Result<Response, ContractError> {
    let state = State {
        name: name,
        venue: venue,
        description: description,
        price: price,
        owner: info.sender
    };
    STATE.save(deps.storage, &id, &state)?;

    Ok(Response::new().add_attribute("method", "try_create"))
}

pub fn try_buy(
    deps: DepsMut,
    info: MessageInfo,
    event: String,
    ticketId: String,
    id: String,
) -> Result<Response, ContractError> {
    let ticket = Ticket {
        event: event,
        id: ticketId,
        owner: info.sender
    };
    TICKETS.save(deps.storage, &id, &ticket)?;

    Ok(Response::new().add_attribute("method", "try_buy"))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetEvents {} => to_binary(&query_all(deps)?),
        QueryMsg::GetTickets {} => to_binary(&query_tickets(deps)?),
    }
}

fn query_all(deps: Deps) -> StdResult<EventResponse> {
    let all: StdResult<Vec<_>> = STATE
        .range(deps.storage, None, None, Order::Ascending)
        .collect();
    let mut resp: Vec<Entry> = Vec::new();
    for (id, data) in all? {
        resp.push(Entry {
            name: data.name,
            venue: data.venue,
            description: data.description,
            price: data.price,
            owner: data.owner
        });
    }
    Ok(EventResponse { entries: resp })
}

fn query_tickets(deps: Deps) -> StdResult<TicketResponse> {
    let all: StdResult<Vec<_>> = TICKETS
        .range(deps.storage, None, None, Order::Ascending)
        .collect();
    let mut resp: Vec<TicketEntry> = Vec::new();
    for (id, data) in all? {
        resp.push(TicketEntry {
            event: data.event,
            id: data.id,
            owner: data.owner
        });
    }
    Ok(TicketResponse { tickets: resp })
}
