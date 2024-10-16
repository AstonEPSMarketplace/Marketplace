import axios from "axios";
import SetCookie from "../../actions/setCookie";

const signup = async ({
  email,
  access,
}: {
  email: string;
  access: boolean;
}) => {
  const res = await axios.get(
    `http://localhost:9900/api/signup/${email}/${access}`
  );
  return res.data;
};

const signin = async ({ email }: { email: string }) => {
  const split = email.split("@");
  console.log(split);
  if (split.length === 2) {
    if (split[1] === "aston.ac.uk") {
      console.log("length > 2");
      const local = "http://localhost:9900/api/signin";
      // const xTernal = "";
      const response = await axios.post(local, {
        id: split[0],
      });
      console.log("response", response.data.data);
      if (response.data.error === null) {
        const res = await SetCookie(split[0]);
        return { data: res, error: null };
      } else {
        return { data: null, error: "Unexpected Error" };
      }
    } else {
      return { data: null, error: "Not an Aston email address" };
    }
  } else {
    return { data: null, error: "Not a valid email" };
  }
};

export { signup, signin };
