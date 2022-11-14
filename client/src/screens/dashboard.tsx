import useSWR from "swr";

type Props = {
  jwt: string;
};

const fetcher = (jwt: string) => (url: string) =>
  fetch(url, {
    headers: {
      jwt: jwt,
    },
  }).then((r) => r.json());

type balance = {
  asset: string;
  free: any;
  locked: any;
};

const Dashboard = ({ jwt }: Props) => {
  // fetch http://localhost:8080/binance/exchangeInfo
  const { data, error } = useSWR(
    "http://localhost:8080/binance/account",
    fetcher(jwt)
  );

  const balances: balance[] = data?.balances;

  return (
    <section>
      <h1>Dashboard</h1>

      <h2>Coins</h2>

      <table
        onClick={() => {
          console.log("balances", data);
        }}
      >
        <thead>
          <tr>
            <th>Asset</th>
            <th>Free</th>
            <th>Locked</th>
          </tr>
        </thead>
        <tbody>
          {balances?.map((balance) => (
            <tr key={balance.asset}>
              <td>{balance.asset}</td>
              <td>{balance.free}</td>
              <td>{balance.locked}</td>
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
