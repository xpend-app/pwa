import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { SWRConfig } from 'swr'
import 'tailwindcss/tailwind.css'

import useLocalJwt from '../hooks/useValidateJwt'
import fetcher from '../lib/fetcher'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const { pathname } = useRouter()

  const onLoginPage = pathname === '/login'

  useLocalJwt({
    skip: onLoginPage,
    redirectOnFail: !onLoginPage,
  })

  return (
    <SWRConfig value={{ fetcher }}>
      <Component {...pageProps} />
    </SWRConfig>
  )
}

export default MyApp
