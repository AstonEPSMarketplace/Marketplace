"use client";
// import Link from "next/link";
import { useState, useEffect } from "react";
import { insertProblems } from "./hereweland/hooks/calls";

const Home = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [render, setRender] = useState(0);
  const [posts, setPosts] = useState([{ problem: "", id: "" }]);
  const [submitPress, setSubmitPress] = useState(false);
  const [email, setEmail] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0; // Generate a random number between 0 and 15
        const v = c === "x" ? r : (r & 0x3) | 0x8; // Use 4 for the UUID version and other bits for `y`
        return v.toString(16); // Convert to hexadecimal
      }
    );
  };

  const handleInsertProblems = async () => {
    const filter = posts.filter((p) => p.problem !== "");
    if (email.length > 0) {
      if (email.includes("@")) {
        const res = await insertProblems({ problems: filter, email: email });
        if (res === true) {
          setSubmitPress(false);
          setShowComplete(true);
        }
      } else {
        setShowError(true);
        setErrorMessage("Not a valid email");
      }
    } else {
      setShowError(true);
      setErrorMessage("You must enter an email");
    }
  };

  const handleRemove = (id) => {
    if (posts.length > 1) {
      const updatedPosts = posts.filter((post) => post.id !== id);
      setPosts(updatedPosts);
    }
  };

  const addProblem = () => {
    const id = generateUUID();
    const problem = { problem: "", id: id };
    setPosts([...posts, problem]);
  };

  const handleChange = (id, event) => {
    const updatedPost = posts.find((p) => p.id === id);
    const updatedPostWithChanges = {
      ...updatedPost,
      problem: event.target.value,
    };

    const updatedPosts = posts.map((p) =>
      p.id === id ? updatedPostWithChanges : p
    );

    setPosts(updatedPosts);
  };

  const renderEnterProblems = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {showComplete && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 10,
            backgroundColor: "#171717",
            border: "1px solid #2e2e2e",
            position: "absolute",
            zIndex: 100,
            borderRadius: 4,
            width: 180,
          }}
        >
          <h1 style={{ color: "white", marginBottom: 10 }}>
            Thank your for submitting feedback. Return back to the homepage
          </h1>
          <button
            onClick={() => {
              setShowComplete(false);
              setRender(0);
            }}
            style={{
              backgroundColor: "#600164",
              borderRadius: 4,
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              width: "100%",
              height: 34,
            }}
          >
            <h1 style={{ color: "white" }}>Return</h1>
          </button>
        </div>
      )}
      {showError && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 10,
            backgroundColor: "#171717",
            border: "1px solid #2e2e2e",
            position: "absolute",
            zIndex: 100,
            borderRadius: 4,
            width: 180,
          }}
        >
          <h1 style={{ color: "white", marginBottom: 10 }}>{errorMessage}</h1>
          <button
            onClick={() => {
              setShowError(false);
            }}
            style={{
              backgroundColor: "#600164",
              borderRadius: 4,
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              width: "100%",
              height: 34,
            }}
          >
            <h1 style={{ color: "white" }}>Got it</h1>
          </button>
        </div>
      )}
      {submitPress && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: 10,
            backgroundColor: "#171717",
            border: "1px solid #2e2e2e",
            position: "absolute",
            zIndex: 2,
            borderRadius: 4,
          }}
        >
          <button
            style={{
              marginBottom: 10,
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
            }}
            onClick={() => {
              setSubmitPress(false);
            }}
          >
            <h1 style={{ color: "white" }}>Return</h1>
          </button>
          <input
            style={{
              width:
                dimensions.width <= 500
                  ? dimensions.width * 0.8
                  : dimensions.width * 0.2,
              border: "1px solid #2e2e2e",
              padding: 10,
              backgroundColor: "#e2e2e2",
              borderRadius: 4,
              marginBottom: 10,
            }}
            placeholder="Enter your email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
          />
          <button
            onClick={handleInsertProblems}
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: 34,
              backgroundColor: "#600164",
              display: "flex",
              borderRadius: 4,
            }}
          >
            <h1 style={{ color: "white" }}>Confirm</h1>
          </button>
        </div>
      )}
      <div
        className="hide-scrollbar"
        style={{
          display: "flex",
          flexDirection: "column",
          maxHeight: dimensions.height * 0.5,
          overflow: "auto",
          padding: 20,
          scrollbarColor: "white",
          alignItems: "center",
          border: "1px solid #2e2e2e",
          borderRadius: 4,
          marginBottom: 20,
        }}
      >
        {posts.map((post, index) => (
          <div
            key={index}
            style={{
              width: dimensions.width <= 400 ? dimensions.width * 0.6 : "auto",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: index + 1 < posts.length ? 10 : 0,
              borderRadius: 4,
              overflow: "clip",
              backgroundColor: "#e2e2e2",
              border: "1px solid #2e2e2e",
            }}
          >
            <div
              style={{
                padding: 10,
                backgroundColor: "#E2E2E2",
                borderTopLeftRadius: 4,
                borderBottomLeftRadius: 4,
              }}
            >
              <textarea
                style={{
                  color: "black",
                  width: 250,
                  backgroundColor: "#e2e2e2",
                  flexWrap: "wrap",
                  overflow: "auto",
                  resize: "none",
                  scrollbarColor: "#e2e2e2",
                  borderRight: "1px solid #2e2e2e",
                }}
                value={post.problem}
                placeholder="Enter your problem"
                onChange={(e) => {
                  handleChange(post.id, e);
                }}
              />
            </div>
            <button
              onClick={() => {
                handleRemove(post.id);
              }}
              style={{
                borderTopRightRadius: 4,
                borderBottomRightRadius: 4,
                backgroundColor: "#e2e2e2",
                display: "flex",
                marginRight: 10,
                // height: "100%",
                padding: 10,
              }}
            >
              <h1 style={{ color: posts.length === 1 ? "grey" : "black" }}>
                Remove
              </h1>
            </button>
          </div>
        ))}
      </div>
      <button
        style={{
          borderRadius: 4,
          padding: 10,
          marginBottom: 20,
          border: "1px solid #2e2e2e",
        }}
        onClick={addProblem}
      >
        <h1 style={{ color: "white" }}>Add problem</h1>
      </button>
      <button
        onClick={() => {
          setSubmitPress(true);
        }}
        style={{ backgroundColor: "#600164", padding: 10, borderRadius: 4 }}
      >
        <h1 style={{ color: "white" }}>Submit</h1>
      </button>
    </div>
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#171717",
        position: "fixed",
      }}
    >
      <div
        style={{
          width: "100%",
          height: 60,
          borderBottom: "1px solid #2e2e2e",
          display: "flex",
          flexDirection: "row",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "500",
          }}
        >
          Student CodeLab
        </h1>
        {/* <Link
          href="/hereweland"
          style={{
            position: "absolute",
            right: 40,
            width: 90,
            height: 32,
            borderRadius: 4,
            backgroundColor: "#2e2e2e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1 style={{ color: "white" }}>Login</h1>
        </Link> */}
      </div>
      {render === 0 ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <h1
            style={{
              color: "white",
              textAlign: "center",
              marginBottom: 40,
              fontSize: 26,
              fontWeight: "600",
            }}
          >
            Welcome to Student Code Lab.
          </h1>
          <div
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              padding: 30,
              borderRadius: 4,
              border: "1px solid #2e2e2e",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  color: "white",
                  textAlign: "center",
                  lineHeight: 2,
                  fontSize: 18,
                  fontWeight: "500",
                  width: 240,
                }}
              >
                Our mission is identify and provide solutions to any
                nuances/problems YOU run into at work.
              </p>
            </div>
            <button
              onClick={() => {
                setRender(1);
              }}
              style={{
                borderRadius: 4,
                padding: 20,
                border: "1px solid #2e2e2e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <h1 style={{ color: "white" }}>Submit your problems</h1>
            </button>
          </div>
        </div>
      ) : (
        renderEnterProblems()
      )}
    </div>
  );
};

export default Home;
