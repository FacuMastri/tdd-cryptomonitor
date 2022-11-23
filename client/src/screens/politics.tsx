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
import { Politic } from "../util/politics";
import { politicsAPI } from "../util/requests";

type Props = {
  jwt: string;
};

type PoliticsType = {
  [politic: string]: {
    variationPerc: number;
    intervalInHours: number;
  };
};

const Politics = ({ jwt }: Props) => {
  const { data, error } = useSWR(politicsAPI, fetcher(jwt));
  const [local, setLocal] = useState<PoliticsType>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { mutate } = useSWRConfig();
  const postVar = postData(politicsAPI, jwt);

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
      toast.success("Politics saved");
      mutate(politicsAPI);
    });
  };

  const keysToShow = useMemo(() => {
    return Object.keys(local).filter((key) => shouldShowSymbol(key, search));
  }, [Object.keys(local), search]);

  return (
    <section>
      <h1>Politics settings</h1>

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
      <div className="politicsContainer">
        {keysToShow.length > 0 ? (
          keysToShow.map((key) => (
            <Politic
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

export default Politics;

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

const getDiff = (local: PoliticsType, data: PoliticsType): PostDataType[] => {
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
