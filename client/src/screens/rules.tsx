type Props = {
  jwt: string;
};

const Rules = ({ jwt }: Props) => {
  return (
    <section>
      <h1>Rules</h1>

      <h2>Rules</h2>

      <table>
        <thead>
          <tr>
            <th>Rule</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Rule 1</td>
            <td>Value 1</td>
          </tr>
          <tr>
            <td>Rule 2</td>
            <td>Value 2</td>
          </tr>
        </tbody>
      </table>

      <h2>Add Rule</h2>
      <p>+++</p>

      <footer>{jwt}</footer>
    </section>
  );
};

export default Rules;
