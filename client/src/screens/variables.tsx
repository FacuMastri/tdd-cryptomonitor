import { useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import { fetcher, postData } from "../util/fetch";
import { varsAPI } from "../util/requests";

type Props = {
  jwt: string;
};

type Value = {
  type: string;
  value: any;
};

const Variables = ({ jwt }: Props) => {
  const { data: vars, error } = useSWR(varsAPI, fetcher(jwt));
  const { mutate } = useSWRConfig();
  const postVar = postData(varsAPI, jwt);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    postVar(data).then((res) => {
      mutate(varsAPI);
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
                <td className={typeof vars[key]}>{String(vars[key])}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
};

export default Variables;
