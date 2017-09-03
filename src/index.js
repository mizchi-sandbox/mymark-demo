const React = require('react')
const ReactDOM = require('react-dom')
const unified = require('unified')
const markdown = require('remark-parse')
const math = require('remark-math')
const emoji = require('remark-emoji')
const remark2rehype = require('remark-rehype')
const highlight = require('rehype-highlight')
const katex = require('rehype-katex')
const rehype2react = require('rehype-react')
const { Editor, EditorState } = require('draft-js')
import { stateFromMarkdown } from 'draft-js-import-markdown'
import { stateToMarkdown } from 'draft-js-export-markdown'

// renderer
const processor = unified()
  // markdown parser
  .use(markdown)
  .use(math)
  .use(emoji)
  // hast
  .use(remark2rehype)
  .use(highlight)
  .use(katex)
  .use(rehype2react, {
    createElement: React.createElement
  })

function renderToReact(text) {
  const { contents } = processor.processSync(text)
  return contents
}

const raw = `# markdown <=> wysiwyg

## やったこと

- remark
- Reactで差分プレビュー
- markdown <=> wysiwyg の相互変換

## やってないこと

- wysiwyg変換時に情報が欠落するので完全な可逆ではない
  - 空白ルールとか拡張分の math とか emoji とか
  - draft-js-import-markdown/draft-js-export-markdown を拡張すれば対応可能

気持ち大雑把に相互に持ち運べる程度
`

class WysiwygEditor extends React.Component {
  constructor(props) {
    super(props)
    const content = stateFromMarkdown(props.text)
    this.state = {
      editorState: EditorState.createWithContent(content)
    }
  }
  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        onChange={editorState => {
          this.setState({ editorState })
          this.props.onChangeText(
            stateToMarkdown(editorState.getCurrentContent())
          )
        }}
      />
    )
  }
}

class App extends React.Component {
  state = {
    text: raw,
    useWysiwyg: false
  }

  render() {
    return (
      <div>
        <button
          onClick={() => this.setState({ useWysiwyg: !this.state.useWysiwyg })}
        >
          toggle wysiwyg
        </button>
        <hr />
        {this.state.useWysiwyg
          ? <WysiwygEditor
              text={this.state.text}
              onChangeText={text => this.setState({ text })}
            />
          : <div style={{ display: 'flex' }}>
              <div style={{ flex: 1 }}>
                <div style={{ width: '100%' }}>
                  <textarea
                    value={this.state.text}
                    onChange={ev => this.setState({ text: ev.target.value })}
                    style={{ width: '100%', height: '600px' }}
                  />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ padding: '0 16px' }}>
                  {renderToReact(this.state.text)}
                </div>
              </div>
            </div>}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('main'))
