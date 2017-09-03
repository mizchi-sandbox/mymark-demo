const React = require('react')
const ReactDOM = require('react-dom')
const renderToReact = require('./renderToReact')

const text = `
# hello

- a
- b

`

ReactDOM.render(
  <div>
    {renderToReact(text)}
  </div>,
  document.querySelector('main')
)
