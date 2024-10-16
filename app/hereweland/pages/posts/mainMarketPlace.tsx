"use client";
import { useState, useEffect } from "react";
import { useGlobal } from "../../context/global";
import Posts from "./posts";
import Subscribed from "./subscribed";
import { fetchPosts } from "../../hooks/calls";

const MarketPlace = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [locRender, setLocRender] = useState(0);
  const [posts, setPosts] = useState([]);
  const { global, setGlobal } = useGlobal();
  const { render, refreshAttempt } = global;

  const updateGlobalRender = (res: string) => {
    setGlobal({ ...global, render: res });
  };

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    const func = async () => {
      const res = await fetchPosts();
      setPosts(res);
    };

    func();
  }, [refreshAttempt]);

  return (
    <div
      style={{
        width: dimensions.width,
        height: dimensions.height - 60,
        display: "flex",
        flexDirection: "row",
      }}
    >
      {render === "market" ? (
        <Posts array={posts} />
      ) : (
        <Subscribed pPosts={posts} />
      )}
      <div
        style={{
          width: 180,
          borderLeftWidth: 1,
          borderColor: "#2E2E2E",
          borderStyle: "solid",
          alignItems: "baseline",
          display: "flex",
          flexDirection: "column",
          paddingTop: 20,
          paddingLeft: 20,
        }}
      >
        <button
          onClick={() => {
            updateGlobalRender("market");
          }}
          style={{
            marginBottom: 40,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
          onMouseEnter={() => {
            setLocRender(0);
          }}
          onMouseLeave={() => {
            setLocRender(-1);
          }}
        >
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: 100,
              backgroundColor: render === "market" ? "white" : "#2E2E2E",
              marginRight: 10,
            }}
          />
          <h1 style={{ color: "white" }}>Explore</h1>
        </button>
        <button
          onClick={() => {
            updateGlobalRender("subscribed");
          }}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 40,
          }}
          onMouseEnter={() => {
            setLocRender(1);
          }}
          onMouseLeave={() => {
            setLocRender(-1);
          }}
        >
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: 100,
              backgroundColor: render === "subscribed" ? "white" : "#2E2E2E",
              marginRight: 10,
            }}
          />
          <h1 style={{ color: "white" }}>Library</h1>
        </button>
      </div>
    </div>
  );
};

export default MarketPlace;
