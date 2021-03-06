import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEventHandler } from 'react'

const Login: NextPage = () => {
  const { replace } = useRouter()

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async ev => {
    ev.preventDefault()

    const formData = new FormData(ev.currentTarget)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_XPEND_API_URL}/auth/login`,
        {
          method: 'POST',
          body: JSON.stringify({
            email: formData.get('email'),
            password: formData.get('password'),
          }),
          headers: [['Content-Type', 'application/json']],
        }
      )

      if (!res.ok) throw new Error(res.statusText)

      const data = await res.json()
      localStorage.setItem('jwt', data.token)
      replace('/')
    } catch (e) {
      if (e instanceof Error)
        alert('Something went wrong' + JSON.stringify(e.message))
      else alert('Something went wrong' + JSON.stringify(e))
    }
  }

  return (
    <div>
      <form onSubmit={onFormSubmit}>
        <input id="email" name="email" placeholder="Email" />
        <input id="password" name="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      <br />
      <Link href="/">
        <a>Checkouts</a>
      </Link>
    </div>
  )
}

export default Login
