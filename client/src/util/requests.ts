export const loginAPI = "http://localhost:8080/login";

export const checkOk = (res: Response) => {
  if (res.status >= 300) {
    throw new Error(res.statusText);
  }
  console.log("checkOk", res);
  return res;
};

export const intoText = (res: Response) => res.text();
