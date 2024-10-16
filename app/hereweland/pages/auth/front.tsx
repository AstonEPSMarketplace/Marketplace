"use client";
import { useEffect, useState } from "react";
import { signin, signup } from "./hooks";
import { useGlobal } from "../../context/global";
import SetCookie from "../../actions/setCookie";

const Front = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [render, setRender] = useState("one");
  const [email, setEmail] = useState("");
  const [option, setOption] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState(null);
  const [response, setResponse] = useState(null);
  const [displayError, setDisplayError] = useState(false);
  const { global, setGlobal } = useGlobal();

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setDimensions({ width: width, height: height });
  }, []);

  useEffect(() => {
    if (response !== null) {
      setDisplayError(true);
    }
  }, [response]);

  const callSignup = async ({ access }: { access: boolean }) => {
    const res = await signup({ email: email, access: access });
    if (res.data !== null) {
      await SetCookie(res.data);
      setGlobal({ ...global, isCookie: true });
    }
    setResponse(res.error);
  };

  const callSignin = async () => {
    const res = await signin({ email: email });
    setGlobal({ ...global, isCookie: res.data });
    setResponse(res.error);
  };

  const updateEmail = (event) => {
    setEmail(event.target.value);
  };

  const renderStepTwo = () => {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <button
          style={{ position: "absolute", left: 40, top: 40 }}
          onClick={() => {
            setRender("one");
            setEmail("");
          }}
        >
          <h1 style={{ color: "white" }}>Return</h1>
        </button>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <h1 style={{ paddingBottom: 20, color: "white" }}>
            Welcome to the EPS Market
          </h1> */}
          {/* <h2 style={{ paddingBottom: 20, color: "white" }}>Select</h2> */}
          <button
            style={{
              width: dimensions.width * 0.24,
              height: 60,
              border: "1px solid #2E2E2E",
              backgroundColor: "#171717",
              color: "white",
              borderRadius: 4,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
            onClick={() => {
              setRender("student");
            }}
          >
            <h2 style={{ color: "white" }}>Student</h2>
          </button>
          <button
            style={{
              width: dimensions.width * 0.24,
              height: 60,
              border: "1px solid #2E2E2E",
              backgroundColor: "#171717",
              color: "white",
              borderRadius: 4,
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setRender("staff");
            }}
          >
            <h2 style={{ color: "white" }}>Staff</h2>
          </button>
        </div>
      </div>
    );
  };

  const renderStudentLogin = () => {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          position: "relative",
        }}
      >
        <button
          style={{ position: "absolute", left: 40, top: 40 }}
          onClick={() => {
            setRender("two");
            setEmail("");
          }}
        >
          <h1 style={{ color: "white" }}>Return</h1>
        </button>
        <input
          style={{
            width: dimensions.width * 0.24,
            height: 60,
            border: "1px solid #2E2E2E",
            backgroundColor: "#171717",
            color: "white",
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 4,
          }}
          placeholder="Enter student email"
          onChange={updateEmail}
          value={email}
        />
        <button
          onClick={() => {
            option ? callSignin() : callSignup({ access: false });
          }}
          style={{
            position: "absolute",
            top: "69%",
            backgroundColor: "#600164",
            height: "6%",
            width: window.innerWidth * 0.08,
            zIndex: 1,
            borderRadius: 4,
          }}
        >
          <h2 style={{ color: "white" }}>{option ? "Login" : "Signup"}</h2>
        </button>
      </div>
    );
  };

  const renderStaffLogin = () => {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          position: "relative",
        }}
      >
        <button
          style={{ position: "absolute", left: 40, top: 40 }}
          onClick={() => {
            setRender("two");
            setEmail("");
          }}
        >
          <h1 style={{ color: "white" }}>Return</h1>
        </button>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            style={{
              width: dimensions.width * 0.24,
              height: 60,
              border: "1px solid #2E2E2E",
              backgroundColor: "#171717",
              color: "white",
              paddingLeft: 20,
              paddingRight: 20,
              borderRadius: 4,
              marginBottom: 20,
            }}
            onChange={updateEmail}
            placeholder="Enter university email"
            value={email}
            type="email"
          />
        </div>
        <button
          onClick={() => {
            callSignup({ access: true });
          }}
          style={{
            position: "absolute",
            top: "69%",
            backgroundColor: "#600164",
            height: "6%",
            width: window.innerWidth * 0.08,
            zIndex: 1,
            borderRadius: 4,
          }}
        >
          <h2 style={{ color: "white" }}>{option ? "Login" : "Signup"}</h2>
        </button>
      </div>
    );
  };

  const renderStepOne = () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}></div>
        <button
          onClick={() => {
            setOption(true);
            setRender("two");
          }}
          style={{
            width: dimensions.width * 0.12,
            height: 60,
            border: "1px solid #2E2E2E",
            backgroundColor: "#171717",
            color: "white",
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 4,
          }}
        >
          <h1>Login</h1>
        </button>
        <div style={{ width: 20 }} />
        <button
          onClick={() => {
            setOption(false);
            setRender("two");
          }}
          style={{
            width: dimensions.width * 0.12,
            height: 60,
            border: "1px solid #2E2E2E",
            backgroundColor: "#171717",
            color: "white",
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 4,
          }}
        >
          <h1>Signup</h1>
        </button>
      </div>
    );
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {displayError && (
        <div
          style={{
            position: "absolute",
            width: dimensions.width * 0.2,
            borderRadius: 4,
            backgroundColor: "#171717",
            border: "1px solid #2E2E2E",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            zIndex: 2,
            padding: 10,
            flexDirection: "column",
          }}
        >
          <h1 style={{ color: "white", marginBottom: 10 }}>
            <span style={{ color: "red" }}>ERROR: </span> {response}
          </h1>
          <button
            onClick={() => {
              setDisplayError(false);
              setResponse(null);
            }}
            style={{
              width: "100%",
              height: 30,
              borderRadius: 4,
              backgroundColor: "#600164",
            }}
          >
            <h1 style={{ color: "white" }}>Close</h1>
          </button>
        </div>
      )}
      {render === "one"
        ? renderStepOne()
        : render === "two"
        ? renderStepTwo()
        : render === "student"
        ? renderStudentLogin()
        : renderStaffLogin()}
    </div>
  );
};

export default Front;
