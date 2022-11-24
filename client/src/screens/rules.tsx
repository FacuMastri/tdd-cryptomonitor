import { useState, useEffect, useMemo } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Select,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";
import "../styles/rules.css";
import { Editor } from "../util/editor";
import {
  postRules,
  MarketStatus,
  MARKET_STATUSES,
  fetcher,
} from "../util/fetch";
import { toast } from "react-toastify";
import useSWR from "swr";
import { rulesAPI, symbolsAPI } from "../util/requests";
import MarketStatusChip from "../util/statusChip";

type Props = {
  jwt: string;
};

type Symbol = {
  symbol: string;
  marketStatus: MarketStatus;
};

type Rules = Record<string, Record<MarketStatus, any>>; // Symbol -> MarketStatus -> Rules

type Selection = {
  status: MarketStatus;
  symbol: string | null;
};

const INDENT_SIZE = 4;

const BASE_RULES = JSON.stringify(
  {
    requiredVariables: [],
    rules: [],
  },
  null,
  INDENT_SIZE
);

const Rules = ({ jwt }: Props) => {
  const [selection, setSelection] = useState<Selection>({
    status: MARKET_STATUSES[0],
    symbol: null,
  });
  const { data: rules, mutate } = useSWR(rulesAPI, fetcher(jwt));
  const { data: allSymbols } = useSWR(symbolsAPI, fetcher(jwt));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String | undefined>();
  const [text, setText] = useState(BASE_RULES);
  const [showOnlyExisting, setShowOnlyExisting] = useState(false);

  const existingRuleSymbols = useMemo(() => {
    return rules ? Object.keys(rules) : [];
  }, [rules]);

  useEffect(() => {
    if (allSymbols && rules) {
      setLoading(false);
    }
  }, [allSymbols, rules]);

  useEffect(() => {
    if (!rules || !selection.symbol) {
      setText(BASE_RULES);
      return;
    }
    const rule = rules[selection.symbol]?.[selection.status];
    console.log("rule", rule, rules);
    if (rule) setText(JSON.stringify(rule, null, INDENT_SIZE));
    else setText(BASE_RULES);
  }, [JSON.stringify(rules), selection]);

  const sendRules = () => {
    if (!selection.symbol) return;
    setLoading(true);
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      toast.error("Invalid JSON format");
      setLoading(false);
      return;
    }
    const payload = {
      rules: parsed,
      validFor: selection.symbol,
      validIn: selection.status,
    };
    postRules(jwt, payload)
      .then(async () => {
        setError(undefined);
        await mutate();
      })
      .catch((e: any) => {
        setError(e?.message ?? "Error");
      })
      .finally(() => setLoading(false));
  };

  const downloadRules = () => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${selection.symbol}-${selection.status}.json`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    element.remove();
  };

  const downloadAllRules = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(rules, null, INDENT_SIZE)], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `rules.json`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    element.remove();
  };

  return (
    <section>
      <Typography variant="h3">Rules</Typography>
      <div className="options">
        <Typography>Rule Options</Typography>
        <div className="form">
          <FormControl className="formInput">
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
          </FormControl>

          <FormControl className="formInput">
            <InputLabel>Rule's market status</InputLabel>
            <Select
              value={selection.status}
              onChange={(e) =>
                setSelection((s) => ({
                  ...s,
                  status: e.target.value as MarketStatus,
                }))
              }
              label="Rule's market status"
            >
              {MARKET_STATUSES.map((status) => (
                <MenuItem value={status} key={status}>
                  {status.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <FormControlLabel
          label="Show only symbols with existing rules"
          control={
            <Checkbox
              checked={showOnlyExisting}
              onChange={(event) => setShowOnlyExisting(event.target.checked)}
              size="small"
            />
          }
          disabled={
            loading ||
            Boolean(
              selection.symbol &&
                !existingRuleSymbols.includes(selection.symbol)
            )
          }
        />

        <div className="statusContainer">
          <Typography className="status">
            Current symbol market status: {selection.symbol ? "" : " - "}
          </Typography>
          {selection.symbol ? (
            <MarketStatusChip
              status={
                allSymbols.find((s: Symbol) => s.symbol === selection.symbol)
                  ?.status
              }
              className="status"
            />
          ) : null}
        </div>
        <div>
          <Button
            onClick={downloadRules}
            disabled={loading || !selection.symbol || !selection.status}
          >
            Download rules
          </Button>
          <Button onClick={downloadAllRules} disabled={loading}>
            Download all
          </Button>
        </div>
      </div>

      <Typography variant="h4">
        {selection.symbol && existingRuleSymbols.includes(selection.symbol)
          ? "Edit"
          : "Add new"}{" "}
        Rules
      </Typography>
      <div className="editor">
        <Editor
          value={selection.symbol ? text : " "}
          baseValue={BASE_RULES}
          indent={INDENT_SIZE}
          onChange={setText}
          disabled={loading || !selection.symbol}
        />
      </div>

      <Button
        variant="contained"
        onClick={sendRules}
        disabled={loading || !selection.symbol}
      >
        Set Rules
      </Button>

      <div>
        {error ? [<br />, <Alert severity="error">{error}</Alert>] : null}
      </div>
    </section>
  );
};

export default Rules;
