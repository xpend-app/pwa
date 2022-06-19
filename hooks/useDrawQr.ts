import qr from 'qrcode'
import { useEffect, useRef } from 'react'

import genTxnUrl from '../lib/nano/genTxnUrl'

const useDrawQrCode = ({ raw, address }: { raw?: string; address: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (canvasRef.current === null) return

    qr.toCanvas(canvasRef.current, genTxnUrl({ address: address, raw }))
  }, [raw, address, canvasRef])

  return canvasRef
}

export default useDrawQrCode
