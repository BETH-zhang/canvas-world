import React from 'react'
import PropTypes from 'prop-types'
import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'
import { random } from '../../utils/helper'

import './index.less'

class CanvasComponent extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      autoHeight: props.autoHeight || 60,
      lineHeight: props.lineHeight || 20,
    }
  }

  componentDidMount() {
    this.initEle(this.props.type)
  }

  initEle = (type) => {
    const canvas = document.getElementById('canvas')
    canvas.width = this.props.style.width || 800 || document.body.clientWidth
    canvas.height = this.props.style.height || 800 || document.body.clientHeight
    this.ctx = canvas.getContext('2d')
    this.startDraw(this.props.data)
  }

  startDraw = (data) => {
    if (this.props.showDemo) {
      this.drawDemo() 
    } else if (this.props.render) {
      this.props.render(this.ctx)
    }
    if (!this.ctx || !data) return null
    data.forEach((item, index) => {
      if (item) {
        if (item.render) {
          item.render(this.ctx)
        } else if (isArray(item) && (isFunction(item[0]) || isFunction(item[1]))) {
          const func = isFunction(item[0]) ? item[0] : item[1]
          func(this.ctx)
        } else if (isArray(item) && this.ctx[item[0]]) {
          const options = this.formatOptions(index, item[0], item[1])
          this.draw(item[0], options)
        } else if (this.ctx[item.type]) {
          const options = this.formatOptions(index, item.type, item.options)
          this.draw(item.type, options)
        }
      }
    }) 
  }

  draw = (type, options) => {
    // this.ctx[type](...options)
  }

  getRandomPointAry = () => {
    const count = random(2, 10)
    return Array(count).fill(0).map(() => [random(0, 500), random(0, 300)])
  }

  getDefaultOptions = (type, options) => {
    const defaultOptions = {
      circle: () => ([this.state.autoHeight / 2 + this.state.lineHeight, this.state.autoHeight / 2 + this.state.lineHeight, this.state.autoHeight, options]),
      ellipse: () => ([this.state.autoHeight * 1.5 / 2 + this.state.lineHeight, this.state.autoHeight / 2 + this.state.lineHeight, this.state.autoHeight * 1.5, this.state.autoHeight, options]),
      linearPath: () => ([this.getRandomPointAry()]),
      polygon: () => ([this.getRandomPointAry()]),
      curve: () => ([this.getRandomPointAry()]),
      arc: () => (
        // x,  y,   w,   h,  start,stop,     closed
        // [100, 100, 200, 200, -Math.PI * 2, -Math.PI / 2, true, options],
        [random(50, 500), random(50, 500), random(100, 200), random(100, 200), -Math.PI * (Math.random() * 2), Math.PI / (Math.random() * 2), random(0, 2) ? true : false, options]
      ),
    }
    if (defaultOptions[type]) {
      return defaultOptions[type]()
    }
    return [this.state.lineHeight, this.state.lineHeight, this.state.autoHeight, this.state.autoHeight, options]
  }

  getMainOptions = (index, type, options) => {
    const autoWidth = this.state.autoHeight
    const autoHeight = this.state.autoHeight
    const col = Math.floor(index % this.props.sortCount)
    const row = Math.floor(index / this.props.sortCount)
    const mainOptions = {
      circle: () => {
        const newOptions = isArray(options) ? options.slice(0) : this.getDefaultOptions(type, options)
        newOptions[0] = (autoWidth + this.state.lineHeight) * col + newOptions[2] / 2 + this.state.lineHeight
        newOptions[1] = (autoHeight + this.state.lineHeight) * row + newOptions[2] / 2 + this.state.lineHeight
        return newOptions
      },
      ellipse: () => {
        const newOptions = isArray(options) ? options.slice(0) : this.getDefaultOptions(type, options)
        newOptions[0] = (autoWidth + this.state.lineHeight) * col + newOptions[2] / 2 + this.state.lineHeight
        newOptions[1] = (autoHeight + this.state.lineHeight) * row + newOptions[3] / 2 + this.state.lineHeight
        return newOptions
      },
      linearPath: () => options || this.getDefaultOptions(type, options),
      polygon: () => options || this.getDefaultOptions(type, options),
      curve: () => options || this.getDefaultOptions(type, options),
      arc: () => options || this.getDefaultOptions(type, options)
    }
    if (mainOptions[type]) {
      return mainOptions[type]()
    }
    
    const newOptions = isArray(options) ? options.slice(0) : this.getDefaultOptions(type, options)
    newOptions[0] = (autoWidth + this.state.lineHeight) * col + this.state.lineHeight
    newOptions[1] = (autoHeight + this.state.lineHeight) * row + this.state.lineHeight
    return newOptions 
  }

  formatOptions = (index, type, options) => {
    if (!this.props.autoSort) return isArray(options) ? options : this.getDefaultOptions(type, options)
    return this.getMainOptions(index, type, options)
  }

  drawDemo = () => {
    this.ctx.fillStyle = 'red'
    this.ctx.fillRect(10, 10, 50, 50)

    this.ctx.strokeStyle = 'red'
    this.ctx.strokeRect(10, 70, 50, 50)

    this.ctx.fillStyle = 'red'
    this.ctx.strokeStyle = 'blue'
    this.ctx.rect(10, 130, 50, 50)
    this.ctx.fill()
    this.ctx.stroke()

    this.ctx.clearRect(25, 25, 20, 130)
  }

  render() {
    return (<div className="canvas-container" style={this.props.style}>
      <canvas id="canvas" style={this.props.style} />
    </div>)
  }
}

CanvasComponent.defaultProps = {
  style: {},
  data: [],
  showDemo: false,
  render: null,
  autoSort: false,
  sortCount: 1,
  autoHeight: 0,
  lineHeight: 0,
  async: false,
}

CanvasComponent.propTypes = {
  style: PropTypes.object,
  data: PropTypes.array,
  showDemo: PropTypes.bool,
  render: PropTypes.func,
  autoSort: PropTypes.bool,
  sortCount: PropTypes.number,
  autoHeight: PropTypes.number,
  lineHeight: PropTypes.number,
  async: PropTypes.bool,
}

export default CanvasComponent