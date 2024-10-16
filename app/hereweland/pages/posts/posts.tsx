"use client";
import { useState, useEffect } from "react";
import { useGlobal } from "../../context/global";
import { individualAttempt } from "../../hooks/calls";
import Popup from "../../components/popup";

const Posts = ({ array }) => {
  const { global, setGlobal } = useGlobal();
  const [splitArrays, setSplitArrays] = useState([[], [], [], []]);
  const [hoveredElement, setHoveredElement] = useState("");
  const [localPopup, setLocalPopup] = useState(false);
  const [expandedPost, setExpandedPost] = useState({
    id: "",
    createdAt: "",
    title: "",
    description: "",
    language: "",
    deadline: "",
    client: "",
    client_id: 0,
  });
  const [refresh, setRefresh] = useState(false);
  const [attempted, setAttempted] = useState([]);
  const { closePopup, refreshAttempt } = global;

  useEffect(() => {
    if (closePopup === true) {
      setLocalPopup(false);
      setGlobal({ ...global, closePopup: false });
    }
  }, [closePopup]);

  useEffect(() => {
    const tempArrays = [[], [], [], []];
    array.forEach((item, index) => {
      const arrayIndex = index % 4;
      tempArrays[arrayIndex].push(item);
    });
    setSplitArrays(tempArrays);
  }, [array]);

  useEffect(() => {
    if (refresh || refreshAttempt) {
      console.log("refreshing in posts");
      const func = async () => {
        await fetchAttempted();
      };
      func();
      setRefresh(false);
      setGlobal({ ...global, refreshAttempt: false });
    }
  }, [refresh, refreshAttempt]);

  const fetchAttempted = async () => {
    const res = await individualAttempt();
    if (res?.error === null) {
      setAttempted(res.data);
    }
  };

  useEffect(() => {
    const func = async () => {
      await fetchAttempted();
    };
    func();
  }, []);

  const handleExpandPress = (post) => {
    setLocalPopup(true);
    setExpandedPost(post);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        paddingBottom: 80,
        paddingLeft: 80,
        paddingRight: 80,
        // padding: 80,
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div style={{ width: "100%", height: 80 }} />
      {localPopup && (
        <Popup
          post={expandedPost}
          attempted={attempted.find((a) => a.post_id === expandedPost.id)}
          border={false}
        />
      )}
      <div
        style={{
          width: "100%",
          height: window.innerHeight - 220,
          padding: 20,
          overflow: "auto",
          scrollbarColor: "white",
          position: "relative",
          flexDirection: "row",
          display: "flex",
          backgroundColor: "#191919",
        }}
      >
        {splitArrays.map((array, index) => {
          return (
            <div
              key={index}
              style={{
                width: "25%",
                flexDirection: "column",
                display: "flex",
                marginRight: index < 3 ? 20 : 0,
              }}
            >
              {array.map((item) => {
                const present = attempted.find((a) => a.post_id === item.id);
                return (
                  <div
                    key={item.id}
                    style={{
                      width: "100%",
                      padding: 10,
                      border: `1px solid ${present ? "#685309" : "#2E2E2E"}`,
                      borderRadius: 4,
                      marginBottom: 20,
                      alignItems: "baseline",
                      justifyContent: "flex-start",
                    }}
                    onMouseEnter={() => {
                      setHoveredElement(item.id);
                    }}
                    onMouseLeave={() => {
                      setHoveredElement("");
                    }}
                  >
                    <h1
                      style={{
                        paddingBottom: 10,
                        color: "white",
                        fontWeight: "600",
                      }}
                    >
                      {item.title}
                    </h1>
                    <p
                      style={{
                        marginBottom: 10,
                        color: "white",
                        height: hoveredElement === item.id ? "auto" : 24,
                        overflow: "clip",
                        fontSize: 16,
                      }}
                    >
                      {item.description}
                    </p>
                    <h4 style={{ color: "white", paddingBottom: 10 }}>
                      <span style={{ color: "#B1B1B1" }}>Language: </span>
                      {item.language}
                    </h4>
                    <h4 style={{ color: "white", paddingBottom: 10 }}>
                      <span style={{ color: "#B1B1B1" }}>Client: </span>
                      {item.client}
                    </h4>
                    <h4 style={{ color: "white", paddingBottom: 10 }}>
                      <span style={{ color: "#B1B1B1" }}>Deadline: </span>
                      {item.deadline}
                    </h4>
                    {hoveredElement === item.id && (
                      <button
                        onClick={() => {
                          handleExpandPress(item);
                        }}
                        style={{
                          width: "100%",
                          backgroundColor: "#600164",
                          padding: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 4,
                        }}
                      >
                        <h1 style={{ color: "white" }}>Expand</h1>
                      </button>
                    )}
                  </div>
                );
              })}
              ;
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Posts;
