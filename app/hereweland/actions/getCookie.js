"use server";
import { cookies } from 'next/headers'
 
const GetCookie = async() => {
  const cookieStore = cookies()
  const res = cookieStore.get('front')
  console.log(res);
  return res;
}

export default GetCookie;

