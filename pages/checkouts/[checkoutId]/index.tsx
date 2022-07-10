import { Unit, convert } from 'nanocurrency'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { memoryUsage } from 'process'
import { useEffect } from 'react'
import useSWR from 'swr'

import useDrawQrCode from '../../../hooks/useDrawQr'

const Checkout: NextPage = () => {
  const {
    query: { checkoutId },
  } = useRouter()

  const { data, mutate } = useSWR(`/checkouts/${checkoutId}`)

  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_XPEND_WS_URL}`)

    ws.onopen = () => {
      console.log('Connected')
      ws.send(
        JSON.stringify({
          event: 'checkoutEvents',
          data: { checkoutId },
        })
      )
      ws.onmessage = data => {
        mutate()
      }
    }
  }, [checkoutId, mutate])

  const rawPrice = !data
    ? undefined
    : convert(
        (
          data.fiatAmount *
          +data.pricingData.find(
            (p: { digitalCurrency: string }) => p.digitalCurrency === 'XNO'
          ).exchangeRate
        ).toString(),
        { from: Unit.NANO, to: Unit.raw }
      )

  const qrRef = useDrawQrCode({
    raw: rawPrice,
    address: data?.currentReceivingAddresses.find(
      (a: { digitalCurrency: string }) => a.digitalCurrency === 'XNO'
    )?.address,
  })

  return (
    <>
      {JSON.stringify(data)}

      <canvas
        className="rounded shadow !w-40 !h-40 xs:!w-48 xs:!h-48 sm:!w-80 sm:!h-80"
        ref={qrRef}
      />

      {data?.state === 'CONFIRMED' && <span>Confirmed checkout</span>}
    </>
  )
}

export default Checkout
