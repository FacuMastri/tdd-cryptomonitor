export const loginAPI = "http://localhost:8080/login";
export const rulesAPI = "http://localhost:8080/rules";
export const symbolsAPI = "http://localhost:8080/symbols";
export const varsAPI = "http://localhost:8080/vars";

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
