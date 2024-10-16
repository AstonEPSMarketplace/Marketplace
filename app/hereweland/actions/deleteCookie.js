'use server'
import { cookies } from 'next/headers'
 
const deleteCookie = async () => {
  cookies().delete('front')
}

export default deleteCookie