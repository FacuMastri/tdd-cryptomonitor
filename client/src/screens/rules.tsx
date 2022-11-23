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
} from "@mui/material";
import "../styles/rules.css";
import { Editor } from "../util/editor";
import { capitalize } from "../util/text";
import {
  fetchRules,
  fetchSymbols,
  postRules,
  MarketStatus,
  MARKET_STATUSES,
} from "../util/fetch";
import { toast } from "react-toastify";

type Props = {
  jwt: string;
};

type Rules = Record<string, Record<MarketStatus, any>>; // Symbol -> MarketStatus -> Rules

const INDENT_SIZE = 4;

const BASE_RULES = JSON.stringify(
  {
    requiredVariables: [],
    rules: [],
  },
  null,
  INDENT_SIZE
);

const getExistingRuleSymbols = (
  rules: Rules,
  marketStatus: MarketStatus
): string[] => {
  return Object.keys(rules).filter((symbol) => {
    return Boolean(rules[symbol]?.[marketStatus]?.rules);
  });
};

const Rules = ({ jwt }: Props) => {
  const [marketStatus, setMarketStatus] = useState<MarketStatus>(
    MARKET_STATUSES[0]
  );
  const [symbol, setSymbol] = useState<string | null>(null);

  const [rules, setRules] = useState<Rules>({} as Rules);
  const [allSymbols, setAllSymbols] = useState([]);

  const [loading, setLoading] = useState(true);
  const [text, setText] = useState(BASE_RULES);
  const [showOnlyExisting, setShowOnlyExisting] = useState(false);

  const existingRuleSymbols = useMemo(() => {
    return getExistingRuleSymbols(rules, marketStatus);
  }, [rules, marketStatus]);

  useEffect(() => {
    setSymbol(null);
  }, [marketStatus]);

  useEffect(() => {
    Promise.all([
      fetchRules(jwt).then((rules) => {
        setRules(rules);
      }),
      fetchSymbols(jwt).then((symbols) => {
        setAllSymbols(symbols);
      }),
    ]).then(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!symbol) return;
    const rule = rules[symbol]?.[marketStatus];
    if (rule) setText(JSON.stringify(rule, null, INDENT_SIZE));
    else setText(BASE_RULES);
  }, [JSON.stringify(rules), marketStatus, symbol]);

  const sendRules = () => {
    if (!symbol) return;
    setLoading(true);
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      toast.error("Invalid JSON");
      setLoading(false);
      return;
    }
    const payload = {
      rules: parsed,
      validFor: symbol,
      validIn: marketStatus,
    };
    postRules(jwt, payload).then(() => {
      setLoading(false);
      fetchRules(jwt).then((rules) => {
        setRules(rules);
      });
    });
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
            <Autocomplete
              value={symbol}
              onChange={(_, value: any) => setSymbol(value)}
              renderInput={(params) => (
                <TextField {...params} label="Symbol" variant="standard" />
              )}
              options={showOnlyExisting ? existingRuleSymbols : allSymbols}
            />
          </FormControl>
        </div>
        <FormControlLabel
          label="Show only existing rules"
          control={
            <Checkbox
              checked={showOnlyExisting}
              onChange={(event) => setShowOnlyExisting(event.target.checked)}
              size="small"
            />
          }
          disabled={
            loading || !(!symbol || existingRuleSymbols.includes(symbol))
          }
        />
      </div>

      <Typography variant="h4">
        {existingRuleSymbols.includes(symbol) ? "Edit" : "Add new"} Rules
      </Typography>
      <div className="editor">
        <Editor
          value={symbol ? text : " "}
          baseValue={BASE_RULES}
          indent={INDENT_SIZE}
          onChange={setText}
          disabled={loading || !symbol}
        />
      </div>

      <Button
        variant="contained"
        onClick={sendRules}
        disabled={loading || !symbol}
      >
        Set Rules
      </Button>
    </section>
  );
};

export default Rules;
