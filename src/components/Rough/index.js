import React from 'react'
import PropTypes from 'prop-types'
import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'
import rough from '../../../node_modules/roughjs/dist/rough.umd'
import { random } from '../../utils/helper'

import './index.less'

class RoughComponent extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      autoHeight: 50,
      lineHeight: 10,
    }
  }

  componentDidMount() {
    this.initEle(this.props.type)
  }

  initEle = (type) => {
    if (type === 'canvas') {
      const canvas = document.getElementById('canvas')
      canvas.width = this.props.style.width || 800 || document.body.clientWidth
      canvas.height = this.props.style.height || 800 || document.body.clientHeight
      this.rc = rough.canvas(canvas)
      this.canvasDraw(this.props.data)
    } else if (this.props.type === 'svg') {
      const rc = rough.svg(svg);
      let node = rc.rectangle(10, 10, 200, 200);
      svg.appendChild(node);
    }
  }

  canvasDraw = (data) => {
    if (this.props.showDemo) {
      this.drawDemo() 
    }
    if (!this.rc || !data) return null
    data.forEach((item, index) => {
      if (item) {
        if (item.render) {
          item.render(this.rc)
        } else if (isArray(item) && (isFunction(item[0]) || isFunction(item[1]))) {
          const func = isFunction(item[0]) ? item[0] : item[1]
          func(this.rc)
        } else if (isArray(item) && this.rc[item[0]]) {
          const options = this.formatPosition(index, item[0], item[1])
          console.log(options, '--')
          this.rc[item[0]](...options)
        } else if (this.rc[item.type]) {
          const options = this.formatPosition(index, item.type, item.options)
          this.rc[item.type](...options)
        }
      }
    }) 
  }

  getRandomPointAry = () => {
    const count = random(2, 10)
    return Array(count).fill(0).map(() => [random(0, 500), random(0, 300)])
  }

  getDefaultOptions = (type, options) => {
    const defaultOptions = {
      circle: () => ([0, 0, 50, options]),
      ellipse: () => ([75, 25, 150, 50, options]),
      linearPath: () => ([this.getRandomPointAry()]),
      polygon: () => ([this.getRandomPointAry()]),
      arc: () => (
        // x,  y,   w,   h,  start,stop,     closed
        // [100, 100, 200, 200, -Math.PI * 2, -Math.PI / 2, true, options],
        [random(50, 500), random(50, 500), random(100, 200), random(100, 200), -Math.PI * (Math.random() * 2), Math.PI / (Math.random() * 2), random(0, 2) ? true : false, options]
      ),
    }
    if (defaultOptions[type]) {
      return defaultOptions[type]()
    }
    return [0, 0, 50, 50, options]
  }

  getMainOptions = (index, type, options) => {
    const mainOptions = {
      circle: () => {
        const newOptions = isArray(options) ? options.slice(0) : this.getDefaultOptions(type, options)
        newOptions[0] = newOptions[2] / 2 + this.state.lineHeight
        newOptions[1] = (this.state.lineHeight + this.state.autoHeight) * index + this.state.lineHeight + newOptions[2] / 2
        return newOptions
      },
      ellipse: () => {
        const newOptions = isArray(options) ? options.slice(0) : this.getDefaultOptions(type, options)
        newOptions[0] = newOptions[2] / 2 + this.state.lineHeight
        newOptions[1] = (this.state.lineHeight + this.state.autoHeight) * index + this.state.lineHeight + newOptions[3] / 2 
        return newOptions
      },
      linearPath: () => options || this.getDefaultOptions(type, options),
      polygon: () => options || this.getDefaultOptions(type, options),
      arc: () => options || this.getDefaultOptions(type, options)
    }
    if (mainOptions[type]) {
      console.log(mainOptions[type](), '2')
      return mainOptions[type]()
    }
    
    const newOptions = isArray(options) ? options.slice(0) : this.getDefaultOptions(type, options)
    newOptions[0] = this.state.lineHeight
    newOptions[1] = (this.state.lineHeight + this.state.autoHeight) * index + this.state.lineHeight
    return newOptions 
  }

  formatPosition = (index, type, options) => {
    if (!this.props.autoSort) return isArray(options) ? options : this.getDefaultOptions(type, options)
    console.log(this.getMainOptions(index, type, options), '1')
    return this.getMainOptions(index, type, options)
  }

  drawDemo = () => {
    this.rc.rectangle(10, 10, 200, 200)

    this.rc.circle(50, 50, 80, { fill: 'red' })
    this.rc.rectangle(120, 15, 80, 80, { fill: 'red' })
    this.rc.circle(50, 150, 80, {
      fill: 'rgb(10, 150, 80)',
      fillWeight: 3,
    })
    this.rc.rectangle(220, 15, 80, 80, {
      fill: 'red',
      hachureAngle: 60,
      hachureGap: 8,
    })
    this.rc.rectangle(120, 105, 80, 80, {
      fill: 'rgba(255, 0, 200, 0.2)',
      fillStyle: 'solid'
    })
    this.rc.linearPath([[690, 10], [790, 20], [750, 120], [690, 100]]);
  }

  render() {
    return (<div className="rough-container" style={this.props.style}>
      {
        this.props.type === 'canvas' ?
          <canvas id="canvas" style={this.props.style} /> :
          <svg style={this.props.style} id="svg" />
      }
    </div>)
  }
}

RoughComponent.defaultProps = {
  style: {},
  type: 'canvas',
  data: [],
  showDemo: false,
  autoSort: false,
  sortCount: 1,
}

RoughComponent.propTypes = {
  style: PropTypes.object,
  type: PropTypes.string.isRequired,
  data: PropTypes.array,
  showDemo: PropTypes.bool,
  autoSort: PropTypes.bool,
  sortCount: PropTypes.number,
}

export default RoughComponent