"use client";
import { useState } from "react";
import GetCookie from "../actions/getCookie";
import { attempt, deleteAttempt } from "../hooks/calls";
import { useGlobal } from "../context/global";
import Dropzone from "react-dropzone";
import { File } from "../svgs/svg";
import supabase from "@/services/supabase";
import { FileWithPath } from "react-dropzone";

type post = {
  id: string;
  createdAt: string;
  title: string;
  description: string;
  language: string;
  deadline: string;
  client: string;
  client_id: number;
};

const Popup = ({
  post,
  attempted,
  border,
}: {
  post: post;
  attempted: boolean;
  border: boolean;
}) => {
  const { global, setGlobal } = useGlobal();
  const [file, setFile] = useState<FileWithPath>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showError, setShowError] = useState(false);

  const handleRemovePost = async () => {
    await deleteAttempt({ post_id: post.id });
    setGlobal({ ...global, closePopup: true, refreshAttempt: true });
  };

  const handleAttemptPress = async ({ id }: { id: string }) => {
    const cookie = await GetCookie();
    const valId = cookie?.value || "";
    const res = await attempt({ c_id: valId, p_id: id });
    if (res.data.data === null && res.data.error === null) {
    } else {
      return "Unexpected error";
    }
  };

  const handleSubmitFile = async () => {
    if (file !== null && file !== undefined) {
      const id = await GetCookie();
      console.log(id);
      const fileName = `${post.id}$${Date.now()}$${id?.value}`;
      const filePath = `${fileName}`;

      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("client_id", id?.value);

      const { error } = await supabase.storage
        .from("submissions")
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      const fileURL =
        "https://ptgxoqishsatvhumlmzb.supabase.co/storage/v1/object/public/submissions/" +
        fileName;

      if (user) {
        await supabase
          .from("submissions")
          .insert([
            { post_id: post.id, client_id: user[0].id, file_url: fileURL },
          ]);
      }
    } else {
      setErrorMessage("You must select a file");
      setShowError(true);
    }
  };

  const handleOnDrop = async (acceptedFiles: FileWithPath[]) => {
    console.log("accepted Files", acceptedFiles[0]);
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFile(file);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 1,
        paddingTop: 40,
        paddingBottom: 40,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      {showError && (
        <div
          style={{
            width: "20%",
            padding: 10,
            backgroundColor: "#191919",
            border: "1px solid #2E2E2E",
            position: "absolute",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            borderRadius: 4,
          }}
        >
          <h1 style={{ color: "white", paddingBottom: 10 }}>{errorMessage}</h1>
          <button
            onClick={() => {
              setShowError(false);
            }}
            style={{
              backgroundColor: "#600164",
              borderRadius: 4,
              width: "100%",
              height: 34,
            }}
          >
            <h1 style={{ color: "white" }}>Close</h1>
          </button>
        </div>
      )}
      <div
        style={{ width: "100%", height: "100%", position: "absolute" }}
        onClick={() => {
          setGlobal({ ...global, closePopup: true });
        }}
      />
      <div
        style={{
          backgroundColor: "#191919",
          border: `1px solid ${
            border ? "#2e2e2e" : attempted ? "#685309" : "#2E2E2E"
          }`,
          zIndex: 1,
          width: "44%",
          height: "84%",
          left: "20%",
          borderRadius: 4,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
            // border: "1px solid white",
          }}
        >
          <button
            style={{ display: "flex", justifyContent: "flex-start" }}
            onClick={() => {
              setGlobal({ ...global, closePopup: true });
            }}
          >
            <h1 style={{ color: "white", paddingBottom: 20 }}>Return</h1>
          </button>
          <h1
            style={{
              color: "white",
              fontWeight: "600",
              marginBottom: 10,
            }}
          >
            {post.title}
          </h1>
          <p style={{ color: "white", marginBottom: 10 }}>{post.description}</p>
          <h4 style={{ color: "white", paddingBottom: 10 }}>
            <span style={{ color: "#B1B1B1" }}>Language: </span>
            {post.language}
          </h4>
          <h4 style={{ color: "white", paddingBottom: 10 }}>
            <span style={{ color: "#B1B1B1" }}>Client: </span>
            {post.client}
          </h4>
          <h4 style={{ color: "white", paddingBottom: 10 }}>
            <span style={{ color: "#B1B1B1" }}>Deadline: </span>
            {post.deadline}
          </h4>
        </div>
        {attempted && (
          <Dropzone onDrop={(acceptedFiles) => handleOnDrop(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div
                  {...getRootProps()}
                  style={{
                    width: "100%",
                    height: 40,
                    backgroundColor: "#2E2E2E",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    borderRadius: 4,
                    marginBottom: 20,
                  }}
                >
                  <input {...getInputProps()} />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {file !== null && <File />}
                    <h3 style={{ color: "grey", marginLeft: 10 }}>
                      {file !== null && file !== undefined
                        ? file.name
                        : "Select file"}
                    </h3>
                  </div>
                </div>
              </section>
            )}
          </Dropzone>
        )}
        <div style={{ flexDirection: "row", display: "flex" }}>
          {attempted && (
            <button
              onClick={handleRemovePost}
              style={{
                width: "30%",
                backgroundColor: "#990202",
                height: 34,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h1 style={{ color: "black" }}>Remove</h1>
            </button>
          )}
          {attempted && <div style={{ width: 20 }} />}
          <button
            onClick={() => {
              if (attempted) {
                handleSubmitFile();
              } else {
                handleAttemptPress({ id: post.id });
              }
            }}
            style={{
              width: attempted ? "70%" : "100%",
              height: 34,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#600164",
              borderRadius: 4,
            }}
          >
            <h1 style={{ color: "white" }}>
              {attempted ? "Submit" : "Attempt"}
            </h1>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
