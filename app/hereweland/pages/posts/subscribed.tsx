"use client";
import {
  individualAttempt,
  fetchSubscribed,
  fetchMySubmissions,
} from "../../hooks/calls";
import React, { useState, useEffect, use } from "react";
import Dropzone from "react-dropzone";
import supabase from "@/services/supabase";
import GetCookie from "../../actions/getCookie";
import { File } from "../../svgs/svg";
import Popup from "../../components/popup";
import { useGlobal } from "../../context/global";

const Subscribed = ({ pPosts }) => {
  const [posts, setPosts] = useState([]);
  const [splitArrays, setSplitArrays] = useState([]);
  const [hoveredElement, setHoveredElement] = useState("");
  const [showPopup, setShowPopup] = useState(false);
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
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadedFileURL, setUploadedFileURL] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [showError, setShowError] = useState(false);
  const [render, setRender] = useState(0);
  const { global, setGlobal } = useGlobal();
  const { closePopup, refreshAttempt } = global;
  const [submissions, setSubmissions] = useState([]);
  const [submissionPost, setSubmissionPost] = useState([]);

  useEffect(() => {
    const func = async () => {
      await fetchAttempted();
      await fetchSubmitted();
    };
    func();
    if (refreshAttempt) {
      setGlobal({ ...global, refreshAttempt: false });
    }
  }, [refreshAttempt]);

  useEffect(() => {
    if (closePopup) {
      const func = async () => {
        await fetchSubmitted();
      };
      func();
      setShowPopup(false);
      setGlobal({ ...global, closePopup: false });
    }
  }, [closePopup]);

  useEffect(() => {
    if (uploadStatus === "Complete") {
      setShowPopup(false);
    }
  }, [uploadStatus]);

  // useEffect(() => {
  //   const tempArrays = [[], [], [], []];
  //   posts.forEach((item, index) => {
  //     const arrayIndex = index % 4;
  //     tempArrays[arrayIndex].push(item);
  //   });
  //   setSplitArrays(tempArrays);
  // }, [posts]);

  useEffect(() => {
    if (render === 0) {
      let filtered = [];
      for (let i = 0; i < posts.length; i++) {
        const diff = submissions.filter((s) => s.post_id === posts[i].id);
        console.log(diff);
        if (diff.length === 0) {
          filtered.push(posts[i]);
        }
      }
      const tempArrays = [[], [], [], []];
      filtered.forEach((item, index) => {
        const arrayIndex = index % 4;
        tempArrays[arrayIndex].push(item);
      });
      setSplitArrays(tempArrays);
    } else {
      console.log(pPosts);
      let newFiltered = [];
      for (let i = 0; i < submissions.length; i++) {
        const diff = pPosts.filter((p) => p.id === submissions[i].post_id);
        if (diff.length > 0) {
          newFiltered.push(diff[0]);
        }
      }
      const tempArrays = [[], [], [], []];
      newFiltered.forEach((item, index) => {
        const arrayIndex = index % 4;
        tempArrays[arrayIndex].push(item);
      });
      setSplitArrays(tempArrays);
    }
  }, [render, posts]);

  useEffect(() => {
    console.log(uploadedFileURL);
  }, [uploadedFileURL]);

  const fetchAttempted = async () => {
    const res = await fetchSubscribed();
    if (res?.error === null) {
      setPosts(res.data);
    }
  };

  const fetchSubmitted = async () => {
    const res = await fetchMySubmissions();
    if (res.error === null) {
      setSubmissions(res.data);
    }
  };

  const handleExpandPress = (post) => {
    setShowPopup(true);
    setExpandedPost(post);
  };

  const handleOnDrop = async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFile(file);
    }
  };

  const handleSubmitFile = async () => {
    if (file !== null) {
      const id = await GetCookie();
      const fileName = `${expandedPost.id}$${Date.now()}$${id?.value}`;
      const filePath = `${fileName}`;
      setUploadStatus("Uploading...");

      const { data, error } = await supabase.storage
        .from("submissions")
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      const { publicURL } = supabase.storage
        .from("submissions")
        .getPublicUrl(filePath);

      setUploadedFileURL(publicURL);
      setUploadStatus("Complete");
    } else {
      setErrorMessage("You must select a file");
      setShowError(true);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        paddingLeft: 80,
        paddingRight: 80,
        paddingBottom: 80,
        // padding: 80,
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          alignItems: "center",
          height: 80,
          display: "flex",
          // justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            borderRadius: 4,
            overflow: "clip",
          }}
        >
          <button
            onClick={() => {
              setRender(0);
            }}
            style={{
              display: "flex",
              height: 34,
              marginRight: 10,
              // borderRadius: 4,
              alignItems: "center",
              justifyContent: "center",
              borderBottom: `1px solid ${render === 0 ? "white" : "#2E2E2E"}`,
            }}
          >
            <h3 style={{ color: "white" }}>Attempting</h3>
          </button>
          <button
            onClick={() => {
              setRender(1);
            }}
            style={{
              display: "flex",
              height: 34,
              // borderRadius: 4,
              alignItems: "center",
              justifyContent: "center",
              borderBottom: `1px solid ${render === 1 ? "white" : "#2E2E2E"}`,
            }}
          >
            <h3 style={{ color: "white" }}>Submitted</h3>
          </button>
        </div>
      </div>
      {/* <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          borderRadius: 4,
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        }}
      > */}
      {uploadStatus === "Complete" && (
        <div
          style={{
            position: "absolute",
            zIndex: 1000,
            width: "30%",
            borderRadius: 4,
            backgroundColor: "#191919",
            border: "1px solid #2E2E2E",
            display: "flex",
            flexDirection: "column",
            padding: 10,
          }}
        >
          <h1 style={{ color: "white", paddingBottom: 10, fontWeight: 600 }}>
            Submission recieved.
          </h1>
          <h2 style={{ color: "white", paddingBottom: 10 }}>
            We will review this file and provide a response as soon as possible
          </h2>
          <button
            onClick={() => {
              setUploadStatus(null);
            }}
            style={{
              backgroundColor: "#600164",
              borderRadius: 4,
              width: "100%",
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h1 style={{ color: "white" }}>Close</h1>
          </button>
        </div>
      )}
      {showPopup && (
        <Popup post={expandedPost} attempted={true} border={false} />
        // <div
        //   style={{
        //     width: "100%",
        //     height: "100%",
        //     position: "absolute",
        //     zIndex: 1,
        //     paddingTop: 40,
        //     paddingBottom: 40,
        //     alignItems: "center",
        //     justifyContent: "center",
        //     display: "flex",
        //   }}
        // >
        //   <div
        //     style={{ width: "100%", height: "100%", position: "absolute" }}
        //     onClick={() => {
        //       setShowPopup(false);
        //       setFile(null);
        //     }}
        //   />
        //   <div
        //     style={{
        //       backgroundColor: "#191919",
        //       border: "1px solid #2E2E2E",
        //       zIndex: 1,
        //       width: "54%",
        //       height: "100%",
        //       left: "20%",
        //       borderRadius: 4,
        //       padding: 20,
        //       display: "flex",
        //       flexDirection: "column",
        //       justifyContent: "space-between",
        //     }}
        //   >
        //     <div
        //       className="hide-scrollbar"
        //       style={{
        //         display: "flex",
        //         flexDirection: "column",
        //         overflow: "auto",
        //         marginBottom: 20,
        //         // border: "1px solid white",
        //       }}
        //     >
        //       <h1
        //         style={{
        //           color: "white",
        //           fontWeight: "600",
        //           marginBottom: 10,
        //         }}
        //       >
        //         {expandedPost.title}
        //       </h1>
        //       <p style={{ color: "white", marginBottom: 10 }}>
        //         {expandedPost.description}
        //       </p>
        //       <h4 style={{ color: "white", paddingBottom: 10 }}>
        //         <span style={{ color: "#B1B1B1" }}>Language: </span>
        //         {expandedPost.language}
        //       </h4>
        //       <h4 style={{ color: "white", paddingBottom: 10 }}>
        //         <span style={{ color: "#B1B1B1" }}>Client: </span>
        //         {expandedPost.client}
        //       </h4>
        //       <h4 style={{ color: "white" }}>
        //         <span style={{ color: "#B1B1B1" }}>Deadline: </span>
        //         {expandedPost.deadline}
        //       </h4>
        //     </div>
        //     <div style={{ display: "flex", flexDirection: "column" }}>
        //       <Dropzone onDrop={(acceptedFiles) => handleOnDrop(acceptedFiles)}>
        //         {({ getRootProps, getInputProps }) => (
        //           <section>
        //             <div
        //               {...getRootProps()}
        //               style={{
        //                 width: "100%",
        //                 height: 40,
        //                 backgroundColor: "#2E2E2E",
        //                 alignItems: "center",
        //                 justifyContent: "center",
        //                 display: "flex",
        //                 borderRadius: 4,
        //                 marginBottom: 20,
        //               }}
        //             >
        //               <input {...getInputProps()} />
        //               <div
        //                 style={{
        //                   display: "flex",
        //                   flexDirection: "row",
        //                   alignItems: "center",
        //                   justifyContent: "center",
        //                 }}
        //               >
        //                 {file !== null && <File />}
        //                 <h3 style={{ color: "grey", marginLeft: 10 }}>
        //                   {file !== null ? file.name : "Select file"}
        //                 </h3>
        //               </div>
        //             </div>
        //           </section>
        //         )}
        //       </Dropzone>
        //       <button
        //         onClick={handleSubmitFile}
        //         style={{
        //           width: "100%",
        //           height: 34,
        //           alignItems: "center",
        //           justifyContent: "center",
        //           backgroundColor: "#600164",
        //           borderRadius: 4,
        //         }}
        //       >
        //         <h1 style={{ color: "white" }}>Submit</h1>
        //       </button>
        //     </div>
        //   </div>
        // </div>
      )}
      <div
        style={{
          width: "100%",
          height: window.innerHeight - 220,
          overflow: "auto",
          scrollbarColor: "white",
          position: "relative",
          flexDirection: "row",
          display: "flex",
          backgroundColor: "#191919",
        }}
      >
        <div style={{ width: "200%", overflow: "scroll" }}>
          <div style={{ display: "flex", flexDirection: "row", padding: 20 }}>
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
                    return (
                      <div
                        key={item.id}
                        style={{
                          width: "100%",
                          padding: 10,
                          border: `1px solid #2e2e2e`,
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
          <div style={{ width: "50%", backgroundColor: "blue" }}></div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Subscribed;
