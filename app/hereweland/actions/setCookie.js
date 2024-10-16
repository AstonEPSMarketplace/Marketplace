'use server'
import { cookies } from 'next/headers'
 
const SetCookie = async (data) => {
  cookies().set('front', data, { secure: true })
  return true;
}

export default SetCookie;