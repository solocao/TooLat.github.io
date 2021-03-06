import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './SateliteCloud.html?style=./SateliteCloud.scss'
import moment from 'moment'

let map, L, imgLayer
@WithRender
@Component
export default class SateliteCloud extends Vue {
  
  isComponetAlive: boolean = true
  sateliteDate: Date = new Date()   //初始化选中时间
  typeSelected: string = 'default'
  cloudBounds: any[] = [
    [53.55, 73.66],
    [3.86,150]
  ]
  urlCloud = {
    VIS: `可见光`,        
    IR1: `红外线`,            
    IR3: `水汽`                 
  }

  mounted() {
    map = window['map']
    L = window['L']
  }

  destroyed() {
    this.isComponetAlive = false
    map.removeLayer(imgLayer)
  }

  changeUrl(datetime, dataType) {
    datetime = moment(datetime).format('YYYY-MM-DD HH:mm:00')
    let url = `http://119.29.102.103:8111/Satelite/renderCloud?datetime=${datetime}&dataType=${dataType}&top=53.55&bottom=3.86&left=73.66&right=150&width=600&height=600`
    console.log(url)
    let img = new Image()
    img.onload = () => {
      if (this.isComponetAlive) {
        if (!imgLayer) {
          imgLayer = L.imageOverlay(url, this.cloudBounds)
          imgLayer.addTo(map)
        } else {
          imgLayer.setUrl(url)
        }
      } else {
        if (imgLayer) map.removeLayer(imgLayer)
      }
    }
    img.onerror = () => {
      if (this.isComponetAlive)
        Vue.prototype['$message']({
          type: 'warning',
          message: '该时暂无数据'
        })
    }
    img.src = url
  }

  @Watch('typeSelected')
  ontypeSelectedChanged (val: any, oldVal: any) {
    this.changeUrl(this.sateliteDate, val)
  }

  @Watch('sateliteDate')
  onsateliteDateChanged (val: any, oldVal: any) {
    if (this.typeSelected !== 'default')
      this.changeUrl(val, this.typeSelected)
  }
}