import { Event } from 'effector'
import { StoreFn, StoreProps } from './types'

export type Events<S extends (...args: any[]) => any, StoreReturnValue = ReturnType<S>> = {
  [key in keyof StoreReturnValue as StoreReturnValue[key] extends Event<any> ? key : never]: StoreReturnValue[key]
}

const eventProps: (keyof Event<any>)[] = ['watch', 'map', 'getType']

export function makeEvents<R, P extends StoreProps<any>>(storeInstance: R): Events<StoreFn<R, P>> {
  function isEvent(s: object): s is Event<any> {
    return eventProps.every((prop) => prop in s)
  }

  return Object.entries(storeInstance).reduce((events, [key, value]) => {
    if (isEvent(value)) {
      // @ts-ignore
      events[key as keyof Events<StoreFn<R, P>>] = value as Event<any>
    }

    return events
  }, {} as Events<StoreFn<R, P>>)
}
