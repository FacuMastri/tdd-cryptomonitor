import { Typography, TextField } from "@mui/material";
import "../styles/policy.css";

export type PolicyProps = {
  symbol: string;
  values: {
    variationPerc: number;
    intervalInHours: number;
  };
  onChange: (values: PolicyProps["values"]) => void;
  disabled: boolean;
};

export const Policy = (props: PolicyProps) => {
  return (
    <div className="policy">
      <Typography>{props.symbol}</Typography>
      <div className="policiesFieldsContainer">
        <TextField
          className="field"
          label="Variation %"
          value={props.values.variationPerc}
          type="number"
          onChange={(e) =>
            props.onChange({
              ...props.values,
              variationPerc: Number(e.target.value),
            })
          }
          disabled={props.disabled}
        />
        <TextField
          className="field"
          label="Interval length (hrs.)"
          type="number"
          value={props.values.intervalInHours}
          onChange={(e) =>
            props.onChange({
              ...props.values,
              intervalInHours: Number(e.target.value),
            })
          }
          disabled={props.disabled}
        />
      </div>
    </div>
  );
};
