import { Store } from "redux"
import { LayerType, LayerActions } from "./core/application/redux/layer"
import { DocumentActions } from "./core/application/redux/document"
import { ViewportActions } from "./core/application/redux/ui/viewport"
import { UIAction } from "./core/application/redux/ui"

export function constructTestDocument(store: Store<any>) {
  let id = 0
  const makeLayer = (type: LayerType, parent?: number) => {
    store.dispatch(DocumentActions.addLayer(type, parent))
    return id++
  }
  // initialize the state here
  store.dispatch(DocumentActions.setName('Untitled'))
  store.dispatch(ViewportActions.setZoom(1.05))

  const l = makeLayer(LayerType.LAYER)
  store.dispatch(LayerActions.setName(l, 'my layer'))
  store.dispatch(LayerActions.setOpacity(l, 0.5))
  const l2 = makeLayer(LayerType.LAYER)

  // makeLayer(LayerType.LAYER)
  // makeLayer(LayerType.LAYER)
  // makeLayer(LayerType.LAYER)
  // makeLayer(LayerType.LAYER)
  // makeLayer(LayerType.LAYER)
  // makeLayer(LayerType.LAYER)
  // makeLayer(LayerType.LAYER)
  // makeLayer(LayerType.LAYER)

  const g = makeLayer(LayerType.GROUP)
  makeLayer(LayerType.LAYER, g)
  store.dispatch(DocumentActions.parentLayer(l2, g))

  const g2 = makeLayer(LayerType.GROUP, g)
  makeLayer(LayerType.LAYER, g2)

  store.dispatch(LayerActions.toggleGroupClosed(g2))

  const l3 = makeLayer(LayerType.LAYER)
  store.dispatch(LayerActions.setClippingMask(l3, true))

  store.dispatch(LayerActions.addLayerMask(l3))
  store.dispatch(LayerActions.toggleVisible(l3))

  store.dispatch(UIAction.layersListButton())
  // store.dispatch(UIAction.layerPropertiesButton())
}