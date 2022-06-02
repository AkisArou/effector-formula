import { Store } from 'effector'
import { useStore } from 'effector-react'
import { StoreFn, StoreProps } from './types'

export type Selectors<S extends (...args: any[]) => any, StoreReturnValue = ReturnType<S>> = {
  [key in keyof StoreReturnValue as StoreReturnValue[key] extends Store<any>
    ? `use${Capitalize<string & key>}`
    : never]: () => StoreReturnValue[key]
}

const storeProps: (keyof Store<any>)[] = ['on', 'off', 'reset', 'getState']

export function makeSelectors<R, P extends StoreProps<any>>(storeInstance: R): Selectors<StoreFn<R, P>> {
  function makeUseStoreKey(p: string) {
    return `use${p.replace(/./, (c) => c.toUpperCase())}`
  }

  function isEffectorStore(s: object): s is Store<any> {
    return storeProps.every((prop) => prop in s)
  }

  return Object.entries(storeInstance).reduce((selectors, [key, value]) => {
    if (isEffectorStore(value)) {
      // @ts-ignore
      // eslint-disable-next-line
      selectors[makeUseStoreKey(key) as keyof typeof selectors] = () => useStore(value)
    }

    return selectors
  }, {} as Selectors<StoreFn<R, P>>)
}
