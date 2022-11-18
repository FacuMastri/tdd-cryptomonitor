export const loginAPI = "http://localhost:8080/login";
export const rulesAPI = "http://localhost:8080/rules";

export const checkOk = (errorMsg: string) => (res: Response) => {
  if (res.status >= 300) {
    console.log("checkOk", errorMsg, res.status, res.statusText);
    throw new Error(errorMsg ?? res.statusText);
  }
  console.log("checkOk", res);
  return res;
};

export const intoText = (res: Response) => res.text();

export const intoJson = (res: Response) => res.json();
