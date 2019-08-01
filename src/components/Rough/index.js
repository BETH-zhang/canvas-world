import React from 'react'
import PropTypes from 'prop-types'
import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'
// import rough from '../../../node_modules/roughjs/dist/rough.umd'
import rough from '../../../node_modules/roughjs/dist/rough-async.umd'
import { formatOptions } from '../../utils/helper'
import './index.less'

class RoughComponent extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      autoHeight: props.autoHeight || 60,
      lineHeight: props.lineHeight || 20,
      sortCount: props.sortCount || 1,
      autoSort: props.autoSort,
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
      this.ctx = canvas.getContext('2d')
      this.rc = rough.canvas(canvas, { async: this.props.async })
      this.rc.curveTag = this.curveTag
      // console.log(this.rc, 'rc')
      this.startDraw(this.props.data)
    } else if (this.props.type === 'svg') {
      // const rc = rough.svg(svg);
      // let node = rc.rectangle(10, 10, 200, 200);
      // svg.body.appendChild(node);
    }
  }

  startDraw = (data) => {
    if (this.props.showDemo) {
      this.drawDemo() 
    }
    if (this.props.render) {
      this.props.render(this.ctx, this.rc)
    }
    if (!this.rc || !data) return null
    data.forEach((item, index) => {
      if (item) {
        console.log(item, index)
        if (item.render) {
          item.render(this.rc)
        } else if (isArray(item) && (isFunction(item[0]) || isFunction(item[1]))) {
          const func = isFunction(item[0]) ? item[0] : item[1]
          func(this.rc)
        } else if (isArray(item) && this.rc[item[0]]) {
          const options = formatOptions(index, item[0], item[1], this.state)
          this.draw(item[0], options)
        } else if (this.rc[item.type]) {
          const options = formatOptions(index, item.type, item.options, this.state)
          this.draw(item.type, options)
        }
      }
    }) 
  }

  draw = async (type, options) => {
    await this.rc[type](...options)
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

  curveTag = (x, y, x1, y1, options) => {
    let points = [];
    const interval = 100

    for (let i = 0; i < (x1 - x) / 7; i++) {
      let pointX = x + (x1 / interval) * i + 10;
      let xdeg = (30 * Math.PI / 180) * i * 20;
      let pointY = y + Math.round(Math.sin(xdeg) * 5);
      points.push([pointX, pointY]);
    }
    this.rc.curve(points, options)
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