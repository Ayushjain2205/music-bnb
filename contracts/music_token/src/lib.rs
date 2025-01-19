use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo,
    Response, StdResult, Uint128, Coin, BankMsg,
};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use cw_storage_plus::{Item, Map};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct TokenData {
    pub creator: String,
    pub price: Uint128,
    pub supply: Uint128,
    pub metadata_uri: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub name: String,
    pub symbol: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    CreateMusicToken {
        initial_price: Uint128,
        metadata_uri: String,
    },
    PurchaseTokens {
        token_id: u64,
        amount: Uint128,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetTokenData { token_id: u64 },
    CalculateCurrentPrice { supply: Uint128 },
    CalculatePurchasePrice { current_supply: Uint128, amount: Uint128 },
}

pub const TOKEN_COUNT: Item<u64> = Item::new("token_count");
pub const TOKENS: Map<u64, TokenData> = Map::new("tokens");

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    TOKEN_COUNT.save(deps.storage, &0u64)?;
    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("name", msg.name)
        .add_attribute("symbol", msg.symbol))
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::CreateMusicToken { initial_price, metadata_uri } => {
            create_music_token(deps, info, initial_price, metadata_uri)
        }
        ExecuteMsg::PurchaseTokens { token_id, amount } => {
            purchase_tokens(deps, env, info, token_id, amount)
        }
    }
}

pub fn create_music_token(
    deps: DepsMut,
    info: MessageInfo,
    initial_price: Uint128,
    metadata_uri: String,
) -> StdResult<Response> {
    let token_id = TOKEN_COUNT.load(deps.storage)? + 1;
    TOKEN_COUNT.save(deps.storage, &token_id)?;

    let token = TokenData {
        creator: info.sender.to_string(),
        price: initial_price,
        supply: Uint128::zero(),
        metadata_uri,
    };
    TOKENS.save(deps.storage, token_id, &token)?;

    Ok(Response::new()
        .add_attribute("method", "create_music_token")
        .add_attribute("token_id", token_id.to_string())
        .add_attribute("creator", info.sender)
        .add_attribute("initial_price", initial_price))
}

pub fn purchase_tokens(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    token_id: u64,
    amount: Uint128,
) -> StdResult<Response> {
    let mut token = TOKENS.load(deps.storage, token_id)?;
    let purchase_price = calculate_purchase_price(token.supply, amount);

    // Check if enough funds were sent
    let payment = info
        .funds
        .iter()
        .find(|c| c.denom == "uxion")
        .map(|c| c.amount)
        .unwrap_or_else(Uint128::zero);
    
    if payment < purchase_price {
        return Err(cosmwasm_std::StdError::generic_err("Insufficient payment"));
    }

    // Send payment to creator
    let creator_addr = deps.api.addr_validate(&token.creator)?;
    let bank_msg = BankMsg::Send {
        to_address: creator_addr.to_string(),
        amount: vec![Coin {
            denom: "uxion".to_string(),
            amount: purchase_price,
        }],
    };

    // Update token data
    token.supply += amount;
    TOKENS.save(deps.storage, token_id, &token)?;

    // Refund excess payment
    let mut messages = vec![bank_msg];
    if payment > purchase_price {
        messages.push(BankMsg::Send {
            to_address: info.sender.to_string(),
            amount: vec![Coin {
                denom: "uxion".to_string(),
                amount: payment - purchase_price,
            }],
        });
    }

    Ok(Response::new()
        .add_messages(messages)
        .add_attribute("method", "purchase_tokens")
        .add_attribute("token_id", token_id.to_string())
        .add_attribute("buyer", info.sender)
        .add_attribute("amount", amount)
        .add_attribute("price", purchase_price))
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetTokenData { token_id } => to_binary(&TOKENS.load(deps.storage, token_id)?),
        QueryMsg::CalculateCurrentPrice { supply } => to_binary(&calculate_current_price(supply)),
        QueryMsg::CalculatePurchasePrice { current_supply, amount } => {
            to_binary(&calculate_purchase_price(current_supply, amount))
        }
    }
}

fn calculate_current_price(supply: Uint128) -> Uint128 {
    // Base price: 0.001 XION = 1000 uXION
    let base_price = Uint128::from(1000u128);
    // Slope: 0.0001 XION = 100 uXION
    let slope = Uint128::from(100u128);
    base_price + (supply * slope)
}

fn calculate_purchase_price(current_supply: Uint128, amount: Uint128) -> Uint128 {
    let start_price = calculate_current_price(current_supply);
    let end_price = calculate_current_price(current_supply + amount);
    ((start_price + end_price) / Uint128::from(2u128)) * amount
} 