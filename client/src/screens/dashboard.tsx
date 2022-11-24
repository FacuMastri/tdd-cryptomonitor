import { useMemo, useState } from "react";
import useSWR from "swr";
import { fetcher, MarketStatus } from "../util/fetch";
import { accountAPI, pricesAPI } from "../util/requests";
import MarketStatusChip from "../util/statusChip";
import { Sparklines, SparklinesBars } from "react-sparklines";
import { Accordion } from "@mui/material";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "../styles/dashboard.css";

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
  type: 'BUY' | 'SELL';
  symbolStatus: MarketStatus;
  quantity: number;
  timestamp: number;
};

type RawPrices = Record<string, { value: number }[]>;
type Prices = Record<string, RawPrices>;

const transactions: TransactionRecord[] = [{
  symbol: "BNBETH",
  type: "BUY",
  symbolStatus: "ALZA",
  quantity: 5,
  timestamp: 1669261319047
},
{  symbol: "BNBETH",
type: "BUY",
symbolStatus: "BAJA",
quantity: 5,
timestamp: 1669261319047},
{  symbol: "BNBETH",
type: "BUY",
symbolStatus: "ESTABLE",
quantity: 5,
timestamp: 1669261319047}
];

const parseTimeStampToDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('es-AR', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestamp);
}

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

const Dashboard = ({ jwt }: Props) => {
  const { data: account } = useSWR(accountAPI, fetcher(jwt));
  const { data: raw_prices } = useSWR(pricesAPI, fetcher(jwt));
  const balances: balance[] = account?.balances;
  const symbols = balances?.map((b) => b.asset);
  const [symbol, setSymbol] = useState(symbols && symbols[0]);
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
          </tr>
        </thead>
        <tbody>
          {balances?.map((balance) => (
            <tr key={balance.asset}>
              <td>{balance.asset}</td>
              <td>{balance.free}</td>
              <td>{balance.locked}</td>
              {getPrice(balance.asset)}
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
              <th>Symbol Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.map((transaction) => (
              <tr key={transaction.timestamp}>
                <td>{transaction.symbol}</td>
                <td>{transaction.type}</td>
                <td>{transaction.quantity}</td>
                <td>{parseTimeStampToDate(transaction.timestamp)}</td>
                <td><MarketStatusChip status={transaction.symbolStatus}/></td>
              </tr>
            ))}
          </tbody>
        </table>
    </section>
  );
};

export default Dashboard;
