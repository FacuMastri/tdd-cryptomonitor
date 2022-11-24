import {Rules} from "../../../interpreter/types/rule";
import {GREATER} from "../../../interpreter/types/calls";
import {BooleanCallCompNumbers} from "../../../interpreter/types/boolean";
import {mockServices} from "../mocks";
import {evalRules} from "../../../interpreter/interpreter";

describe('Test de prueba', () => {
  mockServices();

  const rules: Rules = {
    "requiredVariables": [
      "LTC/BUSD_DATA_SUM_THRESHOLD"
    ],
    "rules": [
      {
        "name": "Comprar 130 BNB/ETH cuando la suma de valores de DATA de LTC/BUSD sea mayor a LTC/BUSD_DATA_SUM_THRESHOLD",
        "condition": {
          "type": "CALL",
          "name": ">",
          "arguments": [
            {
              "type": "CALL",
              "name": "+",
              "arguments": {
                "type": "DATA",
                "symbol": "LTC/BUSD",
                "since": 7200,
                "until": 0,
                "default": [
                  {
                    "type": "CONSTANT",
                    "value": 180
                  }
                ]
              }
            },
            {
              "type": "VARIABLE",
              "name": "LTC/BUSD_DATA_SUM_THRESHOLD"
            }
          ]
        } as BooleanCallCompNumbers,
        "actions": [
          {
            "type": "BUY_MARKET",
            "symbol": "BNB/ETH",
            "amount": {
              "type": "CONSTANT",
              "value": 130
            }
          },
          {
            "type": "SET_VARIABLE",
            "name": "LTC/BUSD_DATA_SUM_THRESHOLD",
            "value": {
              "type": "CONSTANT",
              "value": 99999999
            }
          }
        ]
      }
    ]
  };

  it('Test de prueba', () => {
    const context = {
      variables: {
        "LTC/BUSD_DATA_SUM_THRESHOLD": 100
      },
      wallets: []
    }
    const new_context = evalRules(rules, context);
    // @ts-ignore
    expect(new_context.variables["LTC/BUSD_DATA_SUM_THRESHOLD"]).toBe(99999999);
  });
});