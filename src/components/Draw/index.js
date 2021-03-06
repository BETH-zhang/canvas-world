import React from 'react'
import PropTypes from 'prop-types'
import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'
import Elves from '../../utils/elves/index'
import rough from '../../../node_modules/roughjs/dist/rough-async.umd'
import { formatOptions } from '../../utils/helper'

import './index.less'

class Draw extends React.PureComponent {
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
    this.initEle()
  }

  initEle = () => {
    this.canvas = document.getElementById(this.props.id || 'canvas')
    this.canvas.width = this.props.style.width || 800 || document.body.clientWidth
    this.canvas.height = this.props.style.height || 800 || document.body.clientHeight
    this.ctx = this.canvas.getContext('2d', this.props.canvasOptions)
    this.uc = new Elves(this.canvas)
    this.rc = rough.canvas(this.canvas, { async: this.props.async })
    this.startDraw(this.props.data)
  }

  startDraw = (data) => {
    if (this.props.render) {
      this.props.render(this.ctx, this.uc, this.canvas, this.rc)
    }
    if (!this.uc || !data) return null
    data.forEach((item, index) => {
      if (item) {
        if (item.render) {
          item.render(this.uc)
        } else if (isArray(item) && (isFunction(item[0]) || isFunction(item[1]))) {
          const func = isFunction(item[0]) ? item[0] : item[1]
          func(this.uc)
        } else if (isArray(item) && this.uc[item[0]]) {
          const options = formatOptions(index, item[0], item[1], this.state)
          this.draw(item[0], options)
        } else if (this.uc[item.type]) {
          const options = formatOptions(index, item.type, item.options, this.state)
          this.draw(item.type, options)
        }
      }
    }) 
  }

  draw = (type, options) => {
    console.log(type, options)
    this.uc[type](...options) 
  }

  render() {
    return (<div className="draw-container" style={this.props.style}>
      <canvas id={this.props.id || 'canvas'} style={this.props.style}>{this.props.children}</canvas>
    </div>)
  }
}

Draw.defaultProps = {
  style: {},
  canvasOptions: {},
  data: [],
  render: () => {},
  children: null,
}

Draw.propTypes = {
  style: PropTypes.object,
  canvasOptions: PropTypes.object,
  data: PropTypes.array,
  render: PropTypes.func,
  children: PropTypes.element,
}

export default Draw