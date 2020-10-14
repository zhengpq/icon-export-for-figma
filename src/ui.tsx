import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './ui.css'

declare function require(path: string): any

class App extends React.Component {

  copyContent = (text: string) => {
    if (typeof navigator.clipboard == 'undefined') {
      const textarea: HTMLTextAreaElement = window.document.querySelector("#copy-area")
      textarea.value = text
      textarea.focus()
      textarea.select()

      const successful = window.document.execCommand('copy')
      if (successful) {
        parent.postMessage({ pluginMessage: { type: 'success' } }, '*')
      } else {
        parent.postMessage({ pluginMessage: { type: 'fail' } }, '*')
      }
      return
    }
    navigator.clipboard.writeText(text).then(
      function() {
        parent.postMessage({ pluginMessage: { type: 'success' } }, '*')
      },
      function(err) {
        parent.postMessage({ pluginMessage: { type: 'fail' } }, '*')
      }
    )
  }

  componentDidMount() {
    // console.log('paki', parent)
    window.onmessage = (event: MessageEvent) => {
      this.copyContent(event.data.pluginMessage.pluginMessage.text)
    }
  }

  render() {
    return <div className="">
      <textarea id="copy-area"></textarea>
    </div>
  }
}

ReactDOM.render(<App />, document.getElementById('react-page'))
