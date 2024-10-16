"use client";
import supabase from "../../../services/supabase";
import axios from "axios";
import GetCookie from "../actions/getCookie";
import { error } from "console";

const fetchPosts = async () => {
  const { data, error } = await supabase.from("posts").select("*");
  if (!error) {
    return data;
  }
};

const attempt = async ({ c_id, p_id }: { c_id: String; p_id: String }) => {
  console.log(c_id, p_id);
  const local = "http://localhost:9900/api/attempt";
  const xTernal = "";
  const response = await axios.post(local, {
    client_id: c_id,
    post_id: p_id,
  });
  return response;
};

const individualAttempt = async () => {
  const cookie = await GetCookie();
  if (cookie !== undefined && cookie.value !== "") {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("client_id", cookie.value);
    console.log(user[0]);
    if (userError === null) {
      const { data: activity, error } = await supabase
        .from("activity")
        .select("*")
        .eq("client_id", user[0].id);
      if (activity?.length > 0) {
        return { data: activity, error: null };
      } else {
        return { data: null, error: "User has not subscribed to any posts" };
      }
    } else {
      return { data: null, error: "User cookie is not valid" };
    }
  }
};

const fetchSubscribed = async () => {
  let subscribed = [];
  const { data, error } = await individualAttempt();
  if (error === null) {
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("*");
    for (let i = 0; i < data.length; i++) {
      for (let x = 0; x < post?.length; x++) {
        if (post[x].id === data[i].post_id) {
          subscribed.push(post[x]);
        }
      }
    }
    return { data: subscribed, error: null };
  } else {
    return { data: null, error: error };
  }
};

const fetchMySubmissions = async () => {
  const id = (await GetCookie())?.value;
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("client_id", id);
  if (userError === null) {
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("client_id", user[0].id);
    console.log("d", data);
    if (error === null) {
      return { data, error };
    } else {
      return { data: null, error: "Could not fetch your submissions" };
    }
  }
};

const deleteAttempt = async ({ post_id }: { post_id: String }) => {
  const id = (await GetCookie())?.value;
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("client_id", id);
  if (user?.length > 0) {
    const { error } = await supabase
      .from("activity")
      .delete()
      .eq("post_id", post_id)
      .eq("client_id", user[0].id);
  }
};

const insertProblems = async ({
  problems,
  email,
}: {
  problems: [];
  email: string;
}) => {
  if (problems.length > 0) {
    for (let i = 0; i < problems.length; i++) {
      const { data, error } = await supabase
        .from("problems")
        .insert([{ problem: problems[i].problem, client_email: email }]);
      console.log(data, error);
    }
  }
};

export {
  fetchPosts,
  attempt,
  individualAttempt,
  fetchSubscribed,
  fetchMySubmissions,
  deleteAttempt,
  insertProblems,
};
