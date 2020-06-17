import React from 'react'
import { Events } from '../core/events'
import { Text, View, StyleSheet } from 'react-native'
import Theme from './Theme';

const formatTime = (x: Date) => x.getHours() + ":" + x.getMinutes() + ":" + x.getSeconds() + ':' + x.getMilliseconds()

function resize(arr: Array<any>, newSize: number, defaultValue: any) {
  return [...arr, ...Array(Math.max(newSize - arr.length, 0)).fill(defaultValue)];
}

const enabled = true

type OverlayState = {
  update: boolean
}

class DebugOverlay extends React.Component<any, OverlayState> {
  log: Array<{ time: Date, msg: string }> = []
  messages: Array<string> = []

  constructor(props: any) {
    super(props)
    this.state = { update: false }
    Events.addListener('debugoverlaylog', (msg: string) => {
      this.setState({ update: !this.state.update })
      this.log.push({ time: new Date(), msg: msg })
    })


    Events.addListener('debugoverlaymessage', (msgInfo: { slot: number, msg: string }) => {
      this.setState({ update: !this.state.update })
      if (msgInfo.slot >= this.messages.length) {
        resize(this.messages, msgInfo.slot + 1, '')
      }
      this.messages[msgInfo.slot] = msgInfo.msg
    })
  }

  getMessageLog() {
    let m = []


    if (this.messages.length > 0) {
      m.push(<Text key={`brs`}>Status</Text>)
      this.messages.forEach((x, i) => m.push(<Text key={`logi_${i}`}>{`${x}`}</Text>))
      m.push(<Text key={`br`}>{'\n'}</Text>)
    }
    for (let x = this.log.length; x >= Math.max(this.log.length - (this.props.maxMessages || 10), 0); x--) {
      if (this.log[x] == null) {
        continue
      }
      m.push(<Text key={`log_${x}`}>{`\n[${formatTime(this.log[x].time)}]: ${this.log[x].msg}`}</Text>)
    }
    return m
  }

  render() {
    if (!enabled) {
      return null
    }
    return <View style={styles.overlayBlock}><Text style={styles.text}>
      {this.getMessageLog()}
    </Text></View>
  }
}

const overlayLog = (msg: string) => Events.invoke('debugoverlaylog', msg)
const undoableOperationLog = (msg: string) => Events.invoke('debugoverlaylog', `W: Undoable operation(${msg})`)

const setOverlayMessage = (slot: number, msg: string) => {
  Events.invoke('debugoverlaymessage', { slot: slot, msg: msg })
}

const styles = StyleSheet.create({
  overlayBlock: {
    position: "absolute",
    backgroundColor: 'rgba(0,0,0,0.8)',
    maxWidth: 400,
    top: Theme.getStatusBarHeight(),
    left: 0,
    zIndex: 99
  },
  text: {
    fontSize: 12,
    color: 'white'
  }
})

export { DebugOverlay, overlayLog, setOverlayMessage, undoableOperationLog }
