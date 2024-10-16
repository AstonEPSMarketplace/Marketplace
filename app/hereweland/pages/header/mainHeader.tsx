"use client";
import GetCookie from "../../actions/getCookie";
import { useState, useEffect } from "react";

const Header = () => {
  const [id, setId] = useState(null);

  useEffect(() => {
    const func = async () => {
      await fetchCookie();
    };
    func();
  }, []);

  useEffect(() => {
    console.log(id);
  }, [id]);

  const fetchCookie = async () => {
    const cookie = await GetCookie();
    setId(cookie?.value);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: 60,
        borderBottom: "1px solid #2E2E2E",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 style={{ color: "white" }}>Code Lab</h1>
      </div>
      <div style={{ width: "100%" }} />
      <div
        style={{
          width: 180,
          borderLeft: "1px solid #2E2E2E",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <h1 style={{ color: "white" }}>{id}</h1>
      </div>
    </div>
  );
};

export default Header;
