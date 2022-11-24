import { useMemo, useState } from "react";
import useSWR from "swr";
import { fetcher, MarketStatus } from "../util/fetch";
import { accountAPI, pricesAPI, transactionsAPI } from "../util/requests";
// import MarketStatusChip from "../util/statusChip";
import { Sparklines, SparklinesBars } from "react-sparklines";
import "../styles/dashboard.css";
import { Autocomplete, Button, FormControl } from "@mui/material";
import dayjs, { ManipulateType } from "dayjs";
type Props = {
  jwt: string;
};

type balance = {
  asset: string;
  free: any;
  locked: any;
};

type TransactionRecord = {
  symbol: string;
  type: "BUY" | "SELL";
  symbolStatus: MarketStatus;
  quantity: number;
  timestamp: number;
};

type RawPrices = Record<string, { value: string, timestamp: number }[]>;
type Prices = Record<string, RawPrices>;

const parseTimeStampToDate = (timestamp: number) => {
  return new Intl.DateTimeFormat("es-AR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp);
};

const parsePrices = (prices?: RawPrices, symbols?: string[]) => {
  if (!prices || !symbols) return;

  const parsedPrices: Prices = {};

  symbols.forEach((symbol) => {
    // find all prices for the symbol, prices are formated sym1sym2
    const symbolPrices = Object.keys(prices).filter((key) =>
      key.startsWith(symbol)
    );

    // make object with prices { sym2: prices[symbol] }
    const parsedSymbolPrices = symbolPrices.reduce((acc, key) => {
      const sym2 = key.replace(symbol, "");
      acc[sym2] = prices[key].reverse();
      return acc;
    }, {} as RawPrices);

    parsedPrices[symbol] = parsedSymbolPrices;
  });

  return parsedPrices;
};

type TimeInterval = {
  amount: number,
  unit: ManipulateType
}

const timeSteps: TimeInterval[] = [{
  amount: 60, 
  unit: 'minute'},
  { amount: 8, 
    unit: 'hour'},
  { amount: 1, 
    unit: 'day'},
  { amount: 15, 
    unit: 'day'}]; 

const timeIntervalToString = (time: TimeInterval) => {
  return time.amount.toString() + " " + time.unit + "s";
}

const Dashboard = ({ jwt }: Props) => {
  const { data: account } = useSWR(accountAPI, fetcher(jwt));
  const { data: raw_prices } = useSWR(pricesAPI, fetcher(jwt));
  const { data: transactions } = useSWR(transactionsAPI, fetcher(jwt));
  const balances: balance[] = account?.balances;
  const symbols = balances?.map((b) => b.asset);
  const [symbol, setSymbol] = useState(symbols && symbols[0]);
  const [timeStep, setTimeStep] = useState(0);
  const prices = useMemo(
    () => parsePrices(raw_prices, symbols),
    [raw_prices, symbols]
  );

  const getPrice = (asset: string) => {
    if (asset === symbol) return <td>1</td>;
    const history = prices?.[symbol]?.[asset];
    const price = history?.[0]?.value;
    if (!price) return <td>-</td>;
    const values = history.slice(0, 20).map((h) => Number(h.value) ?? 0);
    // return cell with graph background
    return (
      <td className="spark-td">
        <span className="price">{Number(price).toExponential(5)}</span>
        <div className="history">
          <Sparklines data={values} width={200} height={40} margin={0}>
            <SparklinesBars style={{ fill: "#2ca225" }} />
          </Sparklines>
        </div>
      </td>
    );
  };

  const getAvg = (asset: string) => {
    if (asset === symbol) return <td>1</td>;
    const history = prices?.[symbol]?.[asset];
    const price = history?.[0]?.value;
    if (!price) return <td>-</td>;
    const values = history.filter((value) => value.timestamp > timeToTimestamp()).map((h) => Number(h.value) ?? 0);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return <td>{avg.toExponential(5)}</td>;
  };

  const timeToTimestamp = (): number => {
    const time = timeSteps[timeStep];
    return dayjs().subtract(time.amount, time.unit).unix();
  };
  

  return (
    <section>
      <h1>Dashboard</h1>

      <h2>Coins</h2>

      <table>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Free</th>
            <th>Locked</th>
            <th>
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
              >
                {symbols
                  ? symbols.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))
                  : "Price"}
              </select>
            </th>
            <th>
            <select
              value={timeStep}
              onChange={(e) => setTimeStep(Number(e.target.value))}
            >
              {timeSteps
                ? timeSteps.map((s, i) => (
                    <option key={i} value={i}>
                      {timeIntervalToString(s)}
                    </option>
                  ))
                : "Historic Avg."}
            </select>
            </th>
          </tr>
        </thead>
        <tbody>
          {balances?.map((balance) => (
            <tr key={balance.asset}>
              <td>{balance.asset}</td>
              <td>{balance.free}</td>
              <td>{balance.locked}</td>
              {getPrice(balance.asset)}
              {getAvg(balance.asset)}
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Transaction</h2>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map((transaction: TransactionRecord) => (
            <tr key={transaction.timestamp}>
              <td>{transaction.symbol}</td>
              <td>{transaction.type}</td>
              <td>{transaction.quantity}</td>
              <td>{parseTimeStampToDate(transaction.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>History</h2>
      {/* <FormControl className="formInput">
        <Autocomplete
          value={selection.symbol}
          onChange={(_, value: any) =>
            setSelection((s) => ({ ...s, symbol: value }))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Rule's symbol"
              variant="standard"
            />
          )}
          options={
            (showOnlyExisting
              ? existingRuleSymbols
              : allSymbols?.map((s: Symbol) => s.symbol)) || []
          }
        />
      </FormControl> */}
    </section>
  );
};

export default Dashboard;
