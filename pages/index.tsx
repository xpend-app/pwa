import { NextPage } from 'next'
import { useRouter } from 'next/router'
import useSWR from 'swr'

const Home: NextPage = () => {
  const { push } = useRouter()

  const { data } = useSWR('/checkouts')

  return (
    <div>
      <form
        onSubmit={async ev => {
          ev.preventDefault()
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_XPEND_API_URL}/checkouts`,
            {
              method: 'POST',
              headers: [
                ['Content-Type', 'application/json'],
                ['Authorization', `Bearer ${localStorage.getItem('jwt')}`],
              ],
              body: JSON.stringify({
                fiatAmount: Number(
                  new FormData(ev.currentTarget).get('fiatAmount')
                ),
              }),
            }
          )
          if (!res.ok) return

          const data = await res.json()
          push(`/checkouts/${data.id}`)
        }}
      >
        <input id="fiatAmount" name="fiatAmount" type="number" step="0.01" />
        <button type="submit">New checkout</button>

        {data?.map((checkout: any) => (
          <div key={checkout.id}>
            {checkout.id} - {checkout.merchantId}
          </div>
        ))}
      </form>
    </div>
  )
}

export default Home
