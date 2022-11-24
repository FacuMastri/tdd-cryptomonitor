import {
  Autocomplete,
  Button,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import useSWR, { useSWRConfig } from "swr";
import { fetcher, postData } from "../util/fetch";
import { Policy } from "../util/policy";
import { policiesAPI } from "../util/requests";

type Props = {
  jwt: string;
};

type PoliciesType = {
  [policy: string]: {
    variationPerc: number;
    intervalInHours: number;
  };
};

const Policies = ({ jwt }: Props) => {
  const { data, error } = useSWR(policiesAPI, fetcher(jwt));
  const [local, setLocal] = useState<PoliciesType>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { mutate } = useSWRConfig();
  const postVar = postData(policiesAPI, jwt);

  useEffect(() => {
    if (data && (loading || !local)) {
      setLocal(data);
      setLoading(false);
    }
  }, [data]);

  const onSubmit = () => {
    setLoading(true);
    Promise.all(getDiff(local, data).map(postVar)).then(() => {
      console.debug("Done updating");
      toast.success("Policies saved");
      mutate(policiesAPI);
    });
  };

  const keysToShow = useMemo(() => {
    return Object.keys(local).filter((key) => shouldShowSymbol(key, search));
  }, [Object.keys(local), search]);

  return (
    <section>
      <h1>Policies settings</h1>

      <div className="header">
        <FormControl className="search">
          <Autocomplete
            inputValue={search}
            onInputChange={(_, value: any) => setSearch(value)}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} label="Search" variant="standard" />
            )}
            options={Object.keys(local)}
          />
        </FormControl>
        <Button
          className="saveButton"
          variant="contained"
          onClick={() => onSubmit()}
          disabled={loading}
        >
          Save
        </Button>
      </div>
      <div className="policiesContainer">
        {keysToShow.length > 0 ? (
          keysToShow.map((key) => (
            <Policy
              symbol={key}
              values={local[key]}
              onChange={(values) => {
                setLocal({
                  ...local,
                  [key]: values,
                });
              }}
              key={key}
              disabled={loading}
            />
          ))
        ) : (
          <Typography>No results</Typography>
        )}
      </div>
    </section>
  );
};

export default Policies;

type PostDataType = {
  symbol: string;
  intervalInHours: number;
  variationPerc: number;
};

const shouldShowSymbol = (symbol: string, search: string) => {
  return symbol
    .toLocaleUpperCase()
    .includes(search?.trim().toLocaleUpperCase());
};

const getDiff = (local: PoliciessType, data: PoliciessType): PostDataType[] => {
  return Object.keys(local)
    .filter((key) => {
      if (JSON.stringify(local[key]) !== JSON.stringify(data[key])) {
        console.debug("Updating " + key);
        return true;
      }
      return false;
    })
    .map((key) => {
      return {
        symbol: key,
        intervalInHours: local[key].intervalInHours,
        variationPerc: local[key].variationPerc,
      };
    });
};
