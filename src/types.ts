import { LifecycleCallback } from './lifecycle'

export type StoreProps<S extends [...any[]]> = {
  onMount: (cb: LifecycleCallback) => void
  onUnmount: (cb: LifecycleCallback) => void
  stores: S
}

export type StoreFn<R, P extends StoreProps<any>> = (props: P) => R

export type StoreValue<SC extends StoreFn<any, any>> = ReturnType<SC>
