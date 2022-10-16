const EQUAL = "=="
const DISTINCT = "DISTINCT"
const LESS = "<"
const LESS_EQUAL = "<="
const GREATER = ">"
const GREATER_EQUAL = ">="
const AND = "AND"
const OR = "OR"
const NOT = "NOT"
const NEGATE = "NEGATE"
const PLUS = "+"
const MINUS = "-"
const MULTIPLY = "*"
const DIVIDE = "/"
const MIN = "MIN"
const MAX = "MAX"
const AVERAGE = "AVERAGE"
const STDDEV = "STDDEV"
const FIRST = "FIRST"
const LAST = "LAST"

const MANY_OPS_ARR = [EQUAL, DISTINCT, LESS, LESS_EQUAL, GREATER, GREATER_EQUAL, PLUS, MULTIPLY, MIN, MAX, AVERAGE, STDDEV, FIRST, LAST, AND, OR] as const
type ManyOps = typeof MANY_OPS_ARR[number]

const BINARY_OPS_ARR = [MINUS, DIVIDE] as const
type BinaryOps = typeof BINARY_OPS_ARR[number] 

const UNARY_OPS_ARR = [NOT, NEGATE] as const
type UnaryOps = typeof UNARY_OPS_ARR[number]

const BOOLEAN_OPS_ARR = [EQUAL, DISTINCT, LESS, LESS_EQUAL, GREATER, GREATER_EQUAL, AND, OR, NOT] as const
const NUMBER_OPS_ARR = [PLUS, MINUS, MULTIPLY, DIVIDE, MIN, MAX, AVERAGE, STDDEV, FIRST, LAST, NEGATE] as const

function isCallMany(call: ValueCall): call is ValueCallMany {
  return MANY_OPS_ARR.some(s => s == call.name)
}

function isCallBinary(call: ValueCall): call is ValueCallBinary {
  return BINARY_OPS_ARR.some(s => s == call.name)
}

function isCallUnary(call: ValueCall): call is ValueCallUnary {
  return UNARY_OPS_ARR.some(s => s == call.name)
}

function isBooleanCall(call: ValueCall): call is ValueCall {
  return BOOLEAN_OPS_ARR.some(s => s == call.name)
}

function isNumberCall(call: ValueCall): call is ValueCall {
  return NUMBER_OPS_ARR.some(s => s == call.name)
}
