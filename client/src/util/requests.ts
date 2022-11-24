export const baseUrl =
  "http://localhost:" + (import.meta.env.VITE_SERVER_PORT || "8080");
export const accountAPI = `${baseUrl}/binance/account`;
export const loginAPI = `${baseUrl}/login`;
export const rulesAPI = `${baseUrl}/rules`;
export const symbolsAPI = `${baseUrl}/symbols`;
export const pricesAPI = `${baseUrl}/prices`;
export const policiesAPI = `${baseUrl}/politics`;
export const varsAPI = `${baseUrl}/vars`;
export const transactionsAPI = `${baseUrl}/transactions`;
export const opCriteriaAPI = `${baseUrl}/walletOpCriterias`;

export const checkOk = (errorMsg: string) => (res: Response) => {
  if (res.status >= 300) {
    console.debug("checkOk", errorMsg, res.status, res.statusText);
    throw new Error(errorMsg ?? res.statusText);
  }
  console.debug("checkOk", res);
  return res;
};

export const intoText = (res: Response) => res.text();

export const intoJson = (res: Response) => res.json();

export const intoRes = (res: Response) =>
  res
    .clone()
    .json()
    .catch(() => res.text());
