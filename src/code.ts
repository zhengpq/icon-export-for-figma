const svgToBase64 = require('svg64')

const svgToDataURL = (fileContent) => {
  const bg = fileContent.replace('<svg', (fileContent.indexOf('xmlns') ? '<svg' : '<svg xmlns="http://www.w3.org/2000/svg"'))
    .replace(/"/g, '\'')
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/{/g, '%7B')
    .replace(/}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/\s+/g, ' ')
  return `data:image/svg+xml,${bg}`
}

figma.showUI(__html__, {width: 0, height: 0})
// figma.ui.hide()
figma.ui.onmessage = (event: MessageEvent) => {
  const { type } = event
  switch (type) {
    case 'success':
      figma.notify('copy successfully')
      figma.closePlugin()
      break;
    default:
      figma.notify('copy unsuccessfully')
      figma.closePlugin()
      break;
  }
}

const formatData = (type: string, selection: readonly SceneNode[]) => {
  const promiseArray = selection.map((item: SceneNode) => {
    return item.exportAsync({
      format: 'SVG'
    })
  })
  Promise.all(promiseArray).then((values) => {
    const svgDataURL = values.map((item: Uint8Array) => {
      if (type === 'dataurl') {
        return `background-image: url("${svgToDataURL(String.fromCharCode.apply(null, item))}");`
      }
      if (type === 'base64') {
        return `background-image: url("${svgToBase64(String.fromCharCode.apply(null, item))}");`
      }
    })
    figma.ui.postMessage({ pluginMessage: { type: 'copy', text: svgDataURL.join('\n')} }, { origin: '*'})
  }).catch((err: string) => {
    figma.notify(err)
    figma.closePlugin()
  })
}

const svgExport = (type: string, currentPage: PageNode) => {
  const { selection } = currentPage
  if (selection.length > 0 ) {
    formatData(type, selection)
  } else {
    figma.notify('please select a node first')
  }
}

const { command, currentPage } = figma

svgExport(command, currentPage)