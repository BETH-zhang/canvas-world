import React from 'react'
import PropTypes from 'prop-types'

import './index.less'

class Draw extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    this.initEle()
  }

  initEle = () => {
    const canvas = document.getElementById('canvas')
    canvas.width = this.props.style.width || 800 || document.body.clientWidth
    canvas.height = this.props.style.height || 800 || document.body.clientHeight
    this.ctx = canvas.getContext('2d')
  }

  render() {
    return (<div className="draw-container" style={this.props.style}>
      <canvas id="canvas" style={this.props.style} />
    </div>)
  }
}

Draw.defaultProps = {
  style: {},
}

Draw.propTypes = {
  style: PropTypes.object,
}

export default Draw