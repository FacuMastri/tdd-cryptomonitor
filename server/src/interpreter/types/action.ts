const ACTION_BUY = 'BUY_MARKET'
interface ActionBuyMarket {
    type: typeof ACTION_BUY;
    symbol: string;
    amount: Value;
}

const ACTION_SELL = 'SELL_MARKET'
interface ActionSellMarket {
    type: typeof ACTION_SELL;
    symbol: string;
    amount: Value;
}

const ACTION_SET = 'SET_VARIABLE'
interface ActionSetVariable {
    type: typeof ACTION_SET;
    name: string;
    value: Value;
}

type Action = ActionBuyMarket | ActionSellMarket | ActionSetVariable;