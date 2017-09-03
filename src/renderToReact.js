const React = require('react')
const ReactDOMServer = require('react-dom/server')
// const report = require('vfile-reporter')
// const guide = require('remark-preset-lint-markdown-style-guide')
// const html = require('remark-html')
const unified = require('unified')
const markdown = require('remark-parse')
const math = require('remark-math')
const emoji = require('remark-emoji')
const remark2rehype = require('remark-rehype')
const highlight = require('rehype-highlight')
const katex = require('rehype-katex')
const rehype2react = require('rehype-react')

const processor = unified()
  // markdown parser
  .use(markdown)
  .use(math)
  .use(emoji)
  // hast
  .use(remark2rehype)
  .use(highlight)
  .use(katex)

function renderToReact(text) {
  const { contents } = processor
    .use(rehype2react, {
      createElement: React.createElement
    })
    .processSync(text)
  return contents
}

module.exports = renderToReact
