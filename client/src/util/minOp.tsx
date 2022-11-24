import useSWR from "swr";
import { fetcher, postData } from "./fetch";
import { opCriteriaAPI } from "./requests";
import "../styles/index.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type OpCriteria = {
  symbol: string;
  minOpValue: number;
};

const MinOpValue = ({ jwt, symbols }: { jwt: string; symbols: string[] }) => {
  const { data } = useSWR(opCriteriaAPI, fetcher(jwt));
  const [selection, setSelection] = useState<OpCriteria | undefined>();
  const postVar = postData(opCriteriaAPI, jwt);

  useEffect(() => {
    if (data) {
      setSelection(data);
    }
  }, [data]);

  return (
    <div className="minValueContainer">
      <span>Minimum value to operate: </span>
      <input
        value={selection?.minOpValue || ""}
        onChange={(e) => {
          setSelection({
            symbol: selection?.symbol ?? "",
            minOpValue: parseFloat(e.target.value),
          });
        }}
        type="number"
      ></input>
      <select
        onChange={(e) => {
          setSelection({
            symbol: e.target.value,
            minOpValue: selection?.minOpValue ?? 0,
          });
        }}
        value={selection?.symbol}
      >
        {symbols?.map((symbol) => (
          <option value={symbol} key={symbol}>
            {symbol}
          </option>
        ))}
      </select>
      <button
        onClick={() => {
          postVar(selection).then(() => {
            toast.success("Minimum value saved");
          });
        }}
      >
        Save
      </button>
    </div>
  );
};
export default MinOpValue;
