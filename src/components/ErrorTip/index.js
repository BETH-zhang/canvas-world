import React, { useState, setState } from 'react'
import { Card } from 'antd'
/**
 * 图片的基本信息
 */

import './index.less'

export default class ErrorTip extends React.Component {
  state = { key: 'tab1', count: 0, style: { top: 0, left: 0, display: 'none' }, notation: {} }

  update = () => {
    this.setState({ count: this.state.count + 1 })
  }
  
  render() {
    console.log(this.state)
    const contentList = {
      tab1: (<div>
        {
          Object.keys(this.state.notation).map((key, index) => {
            if (['category', 'categoryHuman', 'categoryHumanText', 'impact', 'point', 'todo'].includes(key)) {
              return (<div key={index}><b>{key}</b>&nbsp;&nbsp;{this.state.notation[key]}</div>)
            } else if (['explanation', 'details'].includes(key)) {
              return (<div key={index} dangerouslySetInnerHTML={{ __html: this.state.notation[key]}} />)
            } else if (key === 'replacements') {
              return (<div key={index}>
                <b>{key}</b>&nbsp;&nbsp;{this.state.notation[key].map((item) => (<i>【{item}】</i>))}
              </div>)
            }
            return null
          })
        }
      </div>),
      tab2: (<div>
        {
          this.state.notation.cardLayout &&
          Object.keys(this.state.notation.cardLayout).map((key) => {
            return (<div><b>{key}</b>&nbsp;&nbsp;{this.state.notation.cardLayout[key]}</div>) 
          }) 
        }
      </div>)
    }
    return (<div className="error-tip" style={this.state.style}>
      <Card
        title={(<div dangerouslySetInnerHTML={{ __html: this.state.notation.title}} />)}
        tabList={[{ key: 'tab1', tab: 'category' }, { key: 'tab2', tab: 'cardLayout' }]}
        activeTabKey={this.state.key}
        onTabChange={key => this.setState({ key })}
      >
        {contentList[this.state.key]}
      </Card>
    </div>)
  }
}