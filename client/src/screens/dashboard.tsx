import { useMemo, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../util/fetch";
import { accountAPI, pricesAPI } from "../util/requests";
import { Sparklines, SparklinesBars } from "react-sparklines";

type Props = {
  jwt: string;
};

type balance = {
  asset: string;
  free: any;
  locked: any;
};

type RawPrices = Record<string, { value: number }[]>;
type Prices = Record<string, RawPrices>;

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
      <p>
        The year is 2036, you enter your local 7/11 to buy yourself a g fuel
        before your shift in the local crypto mine. The android working the
        counter says they only accept doge coin. You pull out your phone, draw a
        stick man in less than five seconds on a yellow back ground and then
        sell it as an NFT. From the sell you make 6 doge coin, about 5 million
        dollars in old world money. You go to buy the drink only to find out
        that from the time you closed your phone to the time you talked to the
        cashier the coins had dropped in value to only 3 dollars per coin and
        you now owe at least 10 doge coin to the robot for the gamer fuel. You
        leave the store, frustrated, and drive off in your Tesla
      </p>

      <footer>{jwt}</footer>
    </section>
  );
};

export default Dashboard;
