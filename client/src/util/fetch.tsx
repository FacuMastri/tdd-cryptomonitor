import { toast } from "react-toastify";
import { rulesAPI, checkOk, intoJson, symbolsAPI } from "./requests";

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

export const fetchRules = async (jwt: string): Promise<any> => {
  return await fetchData(jwt, rulesAPI, "Could not fetch rules");
};

export const fetchSymbols = async (jwt: string): Promise<any> => {
  return await fetchData(jwt, symbolsAPI, "Could not fetch symbols");
};

export const fetcher =
  (jwt: string, checkMsg = "error") =>
  (url: string) =>
    fetch(url, {
      headers: {
        jwt: jwt,
      },
    })
      .then(checkOk(checkMsg))
      .then(intoJson)
      .catch((error) => {
        console.log(error.message ?? error);
        toast.error(error.message ?? "Error");
      });

export const postData =
  (url: string, jwt: string, checkMsg = "error") =>
  async (data: any) => {
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        jwt: jwt,
      },
      body: JSON.stringify(data),
    })
      .then(checkOk(checkMsg))
      .then(intoJson)
      .catch((error) => {
        console.log(error.message ?? error);
        toast.error(error.message ?? "Error");
      });
  };

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
    toast.error(err);
    return;
  }

  try {
    checkOk("Could not post new rules")(res);
    toast.success("Rules updated successfully");
  } catch (error: any) {
    console.log(error.message ?? error);
    toast.error(error.message ?? "Error");
  }
};
