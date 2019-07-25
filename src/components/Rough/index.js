import React from 'react'
import PropTypes from 'prop-types'
import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'
// import rough from '../../../node_modules/roughjs/dist/rough.umd'
import rough from '../../../node_modules/roughjs/dist/rough-async.umd'
import { random } from '../../utils/helper'

import './index.less'

class RoughComponent extends React.PureComponent {
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
    if (type === 'canvas') {
      const canvas = document.getElementById('canvas')
      canvas.width = this.props.style.width || 800 || document.body.clientWidth
      canvas.height = this.props.style.height || 800 || document.body.clientHeight
      this.rc = rough.canvas(canvas)
      this.canvasDraw(this.props.data, { async: this.props.async })
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
          this.draw(item[0], options)
        } else if (this.rc[item.type]) {
          const options = this.formatPosition(index, item.type, item.options)
          this.draw(item.type, options)
        }
      }
    }) 
  }

  draw = async (type, options) => {
    await this.rc[type](...options)
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

  formatPosition = (index, type, options) => {
    if (!this.props.autoSort) return isArray(options) ? options : this.getDefaultOptions(type, options)
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
  autoHeight: 0,
  lineHeight: 0,
  async: false,
}

RoughComponent.propTypes = {
  style: PropTypes.object,
  type: PropTypes.string.isRequired,
  data: PropTypes.array,
  showDemo: PropTypes.bool,
  autoSort: PropTypes.bool,
  sortCount: PropTypes.number,
  autoHeight: PropTypes.number,
  lineHeight: PropTypes.number,
  async: PropTypes.bool,
}

export default RoughComponent