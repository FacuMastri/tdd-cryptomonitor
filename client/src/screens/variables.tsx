import useSWR, { useSWRConfig } from "swr";
import { fetcher, postData } from "../util/fetch";

type Props = {
  jwt: string;
};

type Value = {
  type: string;
  value: any;
};

const Variables = ({ jwt }: Props) => {
  const endpoint = "http://localhost:8080/vars";
  const { data, error } = useSWR(endpoint, fetcher(jwt));
  const { mutate } = useSWRConfig();
  const postVar = postData(endpoint, jwt);

  let vars: Record<string, Value> = data?.vars;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    postVar(data).then((res) => {
      mutate(endpoint);
    });
  };

  return (
    <section>
      <h1>Variables</h1>

      <div id="setVarForm">
        <form onSubmit={onSubmit}>
          <input name="name" placeholder="Name" required />
          <input name="value" placeholder="Value" required />
          <button type="submit">Set</button>
        </form>
      </div>

      <table>
        <thead
          onClick={() => {
            console.log(vars);
          }}
        >
          <tr>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {vars &&
            Object.keys(vars).map((key) => (
              <tr key={key}>
                <td>{key}</td>
                <td className={typeof vars[key].value}>
                  {String(vars[key].value)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
};

export default Variables;
