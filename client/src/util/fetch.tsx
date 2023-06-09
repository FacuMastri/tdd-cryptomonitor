import { toast } from "react-toastify";
import { rulesAPI, checkOk, intoRes, intoJson, symbolsAPI } from "./requests";

export type PostRules = {
  rules: RulesType;
  validFor: string;
  validIn: MarketStatus;
};

export type RulesType = {
  requiredVariables: Array<String>;
  rules: Array<any>;
};

export const MARKET_STATUSES = ["ALZA", "BAJA", "ESTABLE"] as const;
export type MarketStatus = typeof MARKET_STATUSES[number];

export const fetcher =
  (jwt: string, checkMsg = "error") =>
  (url: string) =>
    fetch(url, {
      headers: {
        jwt: jwt,
      },
    })
      .then(checkOk(checkMsg))
      .then(intoRes)
      .catch((error) => {
        console.log(error.message ?? error);
        toast.error(error.message ?? "Error");
      });

export const postData =
  (url: string, jwt?: string, checkMsg = "error") =>
  async (data: any) =>
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(jwt && { jwt }),
      },
      body: JSON.stringify(data),
    })
      .then(checkOk(checkMsg))
      .then(intoRes)
      .catch((error) => {
        console.log(error.message ?? error);
        toast.error(error.message ?? "Error");
      });

export const fetchData = (
  jwt: string,
  url: string,
  checkMsg: string
): Promise<any> => {
  return fetcher(jwt, checkMsg)(url);
};

export const postRules = async (
  jwt: string,
  rules: PostRules
): Promise<any> => {
  const res = await fetch(rulesAPI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      jwt: jwt,
    },
    body: JSON.stringify(rules),
  });

  // This happens if the rule format is wrong
  if (res.status === 406) {
    const err = await res.text();
    throw new Error(err);
  }

  try {
    checkOk("Could not post new rules")(res);
    toast.success("Rules updated successfully");
  } catch (error: any) {
    console.log(error.message ?? error);
    toast.error(error.message ?? "Error");
  }
};
