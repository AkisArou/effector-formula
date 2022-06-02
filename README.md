# Effector formula

Simple and minimal "formula" creator for [effector](https://github.com/effector/effector) when working with React, built with TypeScript, for
reusable and scoped stores.

## Example

Create a function (e.g. CounterStore) that accepts StoreProps and returns effector stores and events and pass it to
createStoreFormula.
StoreProps include lifecycle "hooks" (onMount, onUnmount) and other desired stores.

You get back:

* React Provider: When placed in the desired component hierarchy, the function (e.g. CounterStore) gets executed
  and the effector stores are created. When the component gets out of scope, everything is cleaned up.

* Selector hooks for all the effector stores
* Events
* The functions' returned value itself
* Context to be used for getting current stores' reference in another store

"Store" definition:

```tsx
///// CounterStore.tsx

function CounterStore({ onMount, onUnmount }: StoreProps<[]>) {
  const count = createDomain("count")
  const increment = count.createEvent()
  const decrement = count.createEvent()
  const reset = count.createEvent()

  const $count = count.createStore(0)
          .on(increment, c => c + 1)
          .on(decrement, c => c - 1)
          .reset(reset)

  // ... other effector stores & events

  onMount(() => {
    console.log("Hi :)")
  })

  onUnmount(() => {
    console.log("Bye :)")
  })

  return {
    $count,
    increment,
    decrement,
    reset
  }
}


export const [
  CounterStoreProvider,
  useCounterStoreSelectors,
  useCounterStoreEvents,
  useCounterStore,
  CounterStoreContext
] = createStoreFormula(CounterStore)

```

Usage:

```tsx
///// App.tsx

function App() {
  return (
    <CounterStoreProvider>
      <Counter />
    </CounterStoreProvider>
  )
}

function Counter() {
  const { increment, decrement, reset } = useCounterStoreEvents()

  return (
    <div>
      <br /><br />

      <CountDisplay />

      <button onClick={() => increment()}>Add</button>
      <button onClick={() => decrement()}>Subtract</button>
      <button onClick={() => reset()}>Reset</button>
    </div>
  )
}

function CountDisplay() {
  const count = useCounterStoreSelectors().use$count()

  return (
    <h5>Count: {count}</h5>
  )
}
```

You can also pass another store to props:

```tsx
//// AnotherStore.tsx
type AnotherStoreProps = StoreProps<[StoreValue<typeof CounterStore>]>

export const anotherStoreDeps = [CounterStoreContext]

export function SecondStore({ onMount, onUnmount, stores: [counterStore] }) {
  const sub = counterStore.$count.watch((c: number) => {
    console.log("The count from SecondStore is: ", c)
  })

  onUnmount(() => {
    sub.unsubscribe()
  })

  //....
}


//// App.tsx
function App() {
  return (
    <CounterStoreProvider>
      <SecondStoreProvider contexts={anotherStoreDeps}>
        <Counter />
      </SecondStoreProvider>
    </CounterStoreProvider>
  )
}
```

## Installation

```
npm install effector-formula
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
