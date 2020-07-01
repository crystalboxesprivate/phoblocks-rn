import { Platform } from "react-native"

export const modifiers: Map<string, number> = new Map()

function getOSName() {
  const appVersion = navigator.appVersion

  let osName = 'Unknown'
  if (appVersion.indexOf("Win") != -1) osName = "Windows";
  if (appVersion.indexOf("Mac") != -1) osName = "macOS";
  if (appVersion.indexOf("X11") != -1) osName = "UNIX";
  if (appVersion.indexOf("Linux") != -1) osName = "Linux";
  return osName
}

function validateKeyCode(code: string) {
  if (getOSName() == 'macOS') {
    return code.replace('Meta', 'Control')
  } else { return code; }
}

export function configUserInput() {
  if (Platform.OS !== 'web') {
    return
  }

  window.addEventListener('keydown', (e) => {
    let code = validateKeyCode(e.code)
    if (code === 'Space' || code === 'ControlLeft' || code === 'AltLeft') {
      modifiers.set(code, 1)
    }
  })

  window.addEventListener('keyup', (e) => {
    let code = validateKeyCode(e.code)
    if (code === 'Space' || code === 'ControlLeft' || code === 'AltLeft') {
      modifiers.set(code, 0)
    }
  })
}