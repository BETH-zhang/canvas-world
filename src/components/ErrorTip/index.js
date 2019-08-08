import React, { useState, setState } from 'react'
import { Card } from 'antd'

import './index.less'

export default class ErrorTip extends React.Component {
  state = { count: 0, style: { top: 0, left: 0, display: 'none' }, notation: {} }

  update = () => {
    this.setState({ count: this.state.count + 1 })
  }
  
  render() {
    console.log(this.state)
    return (<div className="error-tip" style={this.state.style}>
      <Card title={(<div dangerouslySetInnerHTML={{ __html: this.state.notation.title}} />)}>
        {
          Object.keys(this.state.notation).map((key) => {
            if (['category', 'categoryHuman', 'categoryHumanText', 'impact', 'point', 'todo', 'explanation'].includes(key)) {
              if (this.state.notation[key].indexOf('<') > -1) {
                return (<div dangerouslySetInnerHTML={{ __html: this.state.notation[key]}} />)
              }
              return (<div><b>{key}</b>&nbsp;&nbsp;{this.state.notation[key]}</div>)
            } else if (key === 'replacements') {
              return (<div>
                <b>{key}</b>&nbsp;&nbsp;{this.state.notation[key].map((item) => (<i>【{item}】</i>))}
              </div>)
            }
            return null
          })
        }
      </Card>
    </div>)
  }
}