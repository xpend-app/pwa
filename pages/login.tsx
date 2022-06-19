import { NextPage } from 'next'
import Link from 'next/link'

const Login: NextPage = () => {
  return (
    <div>
      <button
        onClick={() =>
          fetch(`${process.env.NEXT_PUBLIC_XPEND_API_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
              email: 'test@merchant.com',
              password: 'merchant-password',
            }),
            headers: [['Content-Type', 'application/json']],
          })
            .then(res => res.json())
            .then(({ token }) => {
              localStorage.setItem('jwt', token)
            })
        }
      >
        login
      </button>
      <br />
      <Link href="/">
        <a>Checkouts</a>
      </Link>
    </div>
  )
}

export default Login
