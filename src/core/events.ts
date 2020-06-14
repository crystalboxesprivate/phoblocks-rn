class EventsDef {
  callbacks: Map<string, any>
  constructor() {
    this.callbacks = new Map()
  }
  invoke(eventType: string, args?: any) {
    if (!this.callbacks.get(eventType)) {
      return
    }
    for (let ev of this.callbacks.get(eventType)) {
      ev(args)
    }
  }
  removeListener(eventType: string, cb: any) {
    let collection = this.callbacks.get(eventType)
    if (collection == null) {
      return
    }

    collection.splice(collection.indexOf(cb), 1)
  }
  addListener(eventType: string, cb: any) {
    let collection = this.callbacks.get(eventType)
    if (collection == null) {
      collection = []
    }
    if (!collection.includes(cb)) {
      collection.push(cb)
    }
    this.callbacks.set(eventType, collection)
  }
}

const EventType = {
  LayerAdded: 'LayerAdded',
  LayerHierarchyChanged: 'LayerHierarchyChanged',
}

let Events: EventsDef = new EventsDef()

let initializeEvents = () => {
  Events = new EventsDef()
}

export { Events, EventType, initializeEvents }
