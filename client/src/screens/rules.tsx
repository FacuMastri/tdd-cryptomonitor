import TextField from '@mui/material/TextField';
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import { rulesAPI, checkOk, intoJson } from "../util/requests";
import { toast } from "react-toastify";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

type Props = {
  jwt: string;
};

type RulesType = {
  requiredVariables: Array<String>;
  rules: Array<String>;
}

const Rules = ({ jwt }: Props) => {

  const [rules, setRules] = useState("");
  const [curr_rules, setCurrRules] = useState({
      requiredVariables: [],
      rules: [],
    });
  // let curr_rules: RulesType = {
  //   requiredVariables: [],
  //   rules: [],
  // };
  let isLoaded: boolean = false;

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await   fetch(rulesAPI, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "jwt": jwt,
          },
        })
          .then(checkOk("couldnt get current rules"))
          .then(intoJson)
          .catch((error) => {
            console.log(error.message ?? error);
            toast.error(error.message ?? "Error");
          }).then((rules) => {
            if (typeof rules[0].requiredVariables === 'string' || rules[0].requiredVariables instanceof String) {
              rules[0].requiredVariables = [rules[0].requiredVariables];
            }
            // curr_rules = rules[0];
            setCurrRules(rules[0]);
            isLoaded = true;
          }));
    };


    dataFetch();
  }, []);

    const sendRules = () => {
      console.log(rules);
      console.log(curr_rules?.requiredVariables);
      //TODO post rules
    };

  return (
    <section>
      <h1>Rules</h1>

      <h2>Required Variables</h2>

      <Stack direction="row" spacing={1} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {curr_rules.requiredVariables ? curr_rules.requiredVariables.map((algo, idx) => {
          return <Chip key={idx} label={algo} variant="outlined" />;
        }) : null}
      </Stack>

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
