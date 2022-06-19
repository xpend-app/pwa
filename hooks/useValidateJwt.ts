import { decode } from 'jsonwebtoken'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { JwtPayload, JwtUserData } from '../lib/types'

const useLocalJwt = (
  {
    skip = false,
    redirectOnFail = false,
  }: { skip?: boolean; redirectOnFail?: boolean } = {
    skip: false,
    redirectOnFail: false,
  }
) => {
  const { replace } = useRouter()
  const [data, setData] = useState<{
    userData: JwtUserData | undefined
    checked: boolean
  }>({ userData: undefined, checked: false })
  useEffect(() => {
    const action = async () => {
      if (skip) return

      const token = localStorage.getItem('jwt')

      if (!token) {
        setData({ userData: undefined, checked: true })
        if (redirectOnFail) replace('/login')
      } else {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_XPEND_API_URL}/auth/refresh`,
            {
              method: 'POST',
              headers: [['Authorization', `Bearer ${token}`]],
            }
          )
          if (!res.ok) throw new Error(res.statusText)
          const { token: newToken } = await res.json()

          const { sub, ...userData } = decode(newToken) as JwtPayload
          setData({ userData: { ...userData, id: sub }, checked: true })
          localStorage.setItem('jwt', newToken)
          console.log('done')
        } catch {
          console.log('faile')
          setData({ userData: undefined, checked: true })
          localStorage.removeItem('jwt')

          if (redirectOnFail) replace('/login')
        }
      }
    }
    action()
  }, [skip, redirectOnFail, replace])
  return data
}

export default useLocalJwt
