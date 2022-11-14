import TextField from '@mui/material/TextField';
import { useState } from "react";
import Button from '@mui/material/Button';

type Props = {
  jwt: string;
};

const Rules = ({ jwt }: Props) => {

  const [rules, setRules] = useState("");

  const sendRules = () => {
    console.log(rules);
    //TODO post rules
  }
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
      <TextField
          id="rules-field"
          label="Add Rules"
          multiline
          rows={4}
          style={{"width": "100%"}}
          onChange={(e) => {
            setRules(e.target.value);
        }}
      />
      <Button variant="contained" onClick={sendRules} style={{"float": "right", "marginTop": "10px"}}>
        Set Rules
      </Button>
      <footer>{jwt}</footer>
    </section>
  );
};

export default Rules;
