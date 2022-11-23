import { Typography, TextField } from "@mui/material";
import "../styles/politic.css";

export type PoliticProps = {
  symbol: string;
  values: {
    variationPerc: number;
    intervalInHours: number;
  };
  onChange: (values: PoliticProps["values"]) => void;
  disabled: boolean;
};

export const Politic = (props: PoliticProps) => {
  return (
    <div className="politic">
      <Typography>{props.symbol}</Typography>
      <div className="poltiticFieldsContainer">
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
