import { useState, useEffect } from "react";
import { rulesAPI, checkOk, intoJson } from "../util/requests";
import { toast } from "react-toastify";
import {
  Stack,
  Chip,
  TextField,
  Button,
  Select,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import "../styles/rules.css";
import { capitalize } from "../util/text";

const MARKET_STATUSES = ["ALZA", "BAJA", "ESTABLE"] as const;
type MarketStatus = typeof MARKET_STATUSES[number];

type Props = {
  jwt: string;
};

type RulesType = {
  requiredVariables: Array<String>;
  rules: Array<String>;
};

const fetchRules = async (jwt: string): Promise<any> => {
  return await await fetch(rulesAPI, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      jwt: jwt,
    },
  })
    .then(checkOk("Couldnt get current rules"))
    .then(intoJson)
    .catch((error) => {
      console.log(error.message ?? error);
      toast.error(error.message ?? "Error");
    });
};

const Rules = ({ jwt }: Props) => {
  const [marketStatus, setMarketStatus] = useState<MarketStatus>(
    MARKET_STATUSES[0]
  );
  const [symbol, setSymbol] = useState("");
  const [rules, setRules] = useState([]);
  const [requiredVariables, setRequiredVariables] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRules(jwt).then((rules) => {
      setRequiredVariables(rules.requiredVariables);
      setRules(rules.rules);
    });
  }, []);

  const sendRules = () => {
    //TODO post rules
  };

  return (
    <section>
      <Typography variant="h3">Rules</Typography>
      <div className="options">
        <Typography>Rule Options</Typography>
        <div className="form">
          <FormControl className="formInput">
            <InputLabel>Market Status</InputLabel>
            <Select
              value={marketStatus}
              onChange={(e) => setMarketStatus(e.target.value as MarketStatus)}
              label="Market Status"
            >
              {MARKET_STATUSES.map((status) => (
                <MenuItem value={status} key={status}>
                  {capitalize(status)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className="formInput">
            <TextField
              label="Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
          </FormControl>
        </div>
      </div>

      <h2>Required Variables</h2>

      <Stack
        direction="row"
        spacing={1}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {curr_rules?.requiredVariables
          ? curr_rules.requiredVariables.map((algo, idx) => {
              return <Chip key={idx} label={algo} variant="outlined" />;
            })
          : null}
      </Stack>

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
      <TextField
        id="rules-field"
        label="Add Rules"
        multiline
        rows={4}
        style={{ width: "100%" }}
        onChange={(e) => {
          setRules(e.target.value);
        }}
      />
      <Button
        variant="contained"
        onClick={sendRules}
        style={{ float: "right", marginTop: "10px" }}
      >
        Set Rules
      </Button>
      <footer>{jwt}</footer>
    </section>
  );
};

export default Rules;
