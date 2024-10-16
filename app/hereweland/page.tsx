"use client";
import Front from "./pages/auth/front";
import Header from "./pages/header/mainHeader";
import MarketPlace from "./pages/posts/mainMarketPlace";
import { useEffect, useState } from "react";
import GetCookie from "./actions/getCookie";
import DeleteCookie from "./actions/deleteCookie";
import { useGlobal } from "./context/global";

//I will have a file imported here, and on the useEffect will check the users session.
// And will either refresh or will send the user to the login screen

const Home = () => {
  const [cookie, setCookie] = useState(false);
  const [render, setRender] = useState(null);
  const { global, setGlobal } = useGlobal();
  const { isCookie } = global;

  useEffect(() => {
    const func = async () => {
      const res = await GetCookie();
      if (res !== undefined) {
        setCookie(res?.value === "" ? false : true);
        return res;
      }
    };
    func();
    // DeleteCookie();
  }, [isCookie]);

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#171717",
        flexDirection: "column",
        position: "fixed",
      }}
    >
      {cookie ? (
        <div>
          <Header />
          <MarketPlace />
        </div>
      ) : (
        <Front />
      )}
    </div>
  );
};

export default Home;
