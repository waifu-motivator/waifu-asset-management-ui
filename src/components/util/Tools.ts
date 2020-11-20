import {KeyboardEventHandler} from "react";


export const invokeOnEnter = (toInvoke: () => void): KeyboardEventHandler => (event) => {
  if (event.key === 'Enter') {
    toInvoke()
  }
}
