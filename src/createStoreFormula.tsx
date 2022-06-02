import React, { createContext, useContext, useRef, useState } from 'react'
import { StoreFn, StoreProps } from './types'
import { Selectors, makeSelectors } from './makeSelectors'
import { Events, makeEvents } from './makeEvents'
import { createLifecycle } from './lifecycle'
import { useUnmount } from './hooks'

export function createStoreFormula<R extends object, P extends StoreProps<any>>(storeFn: StoreFn<R, P>) {
  type CurrentSelectors = Selectors<StoreFn<R, P>>
  type CurrentEvents = Events<StoreFn<R, P>>
  type ContextValue = {
    store: R
    selectors: CurrentSelectors
    events: CurrentEvents
  }
  type ProviderParams<C> = { children: React.ReactNode; contexts?: React.Context<C>[] }

  const StoreContext = createContext<ContextValue | null>(null)
  const useCurrentContext = () => useContext<ContextValue>(StoreContext as React.Context<ContextValue>)
  const useCurrentStore = () => useCurrentContext().store
  const useSelectors = () => useCurrentContext().selectors
  const useEvents = () => useCurrentContext().events

  function Provider<C extends ContextValue>({ children, contexts }: ProviderParams<C>) {
    const { current: lifecycle } = useRef(createLifecycle())

    // TODO maybe find another way?
    const stores = (contexts ?? []).map(
      // eslint-disable-next-line react-hooks/rules-of-hooks
      (c) => useContext<ContextValue>(c as unknown as React.Context<ContextValue>).store,
    )

    const [currentStore] = useState(() =>
      storeFn({
        ...lifecycle,
        stores,
      } as unknown as P),
    )

    const [selectors] = useState(() => makeSelectors(currentStore))

    const [events] = useState(() => makeEvents(currentStore))

    const { current: value } = useRef<ContextValue>({ store: currentStore, selectors, events })

    useUnmount(() => {
      lifecycle.triggerUnmount()
    })

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  }

  return [Provider, useSelectors, useEvents, useCurrentStore, StoreContext as React.Context<ContextValue>] as const
}
