const VALUE_CONST = "CONSTANT"
interface ValueConstant {
    type: typeof VALUE_CONST;
    value: ValueOutput;
}

const VALUE_VAR = "VARIABLE"
interface ValueVariable {
    type: typeof VALUE_VAR;
    name: string;
}

const VALUE_WALLET = "WALLET"
interface ValueWallet {
    type: typeof VALUE_WALLET;
    symbol: number;
}

const VALUE_DATA = "DATA"
interface ValueData {
    type: typeof VALUE_DATA;
    symbol: string;
    since: number;
    until: number;
    default?: Value[];
}

const VALUE_CALL = "CALL"
interface ValueCallMany {
    type: typeof VALUE_CALL;
    name: ManyOps;
    arguments: ValueCallArgs;
}

interface ValueCallBinary {
    type: typeof VALUE_CALL;
    name: BinaryOps;
    arguments: ValueCallArgs;
}

interface ValueCallUnary {
    type: typeof VALUE_CALL;
    name: UnaryOps;
    arguments: ValueCallArgs;
}

type ValueCall = ValueCallMany | ValueCallBinary | ValueCallUnary;

type Value = ValueConstant | ValueVariable | ValueWallet | ValueData | ValueCall;

type ValueOutput = number | string | boolean;

type ValueCallArgs = Value[] | ValueData;