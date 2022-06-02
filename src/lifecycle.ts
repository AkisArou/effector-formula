export type LifecycleCallback = () => void

export function createLifecycle() {
  function onMount(cb: LifecycleCallback) {
    cb()
  }

  let onUnmountCallback: LifecycleCallback | undefined

  function onUnmount(cb: LifecycleCallback) {
    onUnmountCallback = cb
  }

  function triggerUnmount() {
    onUnmountCallback?.()
  }

  return {
    onMount,
    onUnmount,
    triggerUnmount,
  }
}
