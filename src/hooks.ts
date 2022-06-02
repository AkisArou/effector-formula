import { useEffect, useRef } from 'react'

export function useEffectOnce(effect: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [])
}

export function useUnmount(fn: () => void) {
  const fnRef = useRef(fn)
  fnRef.current = fn

  useEffectOnce(() => () => fnRef.current())
}
