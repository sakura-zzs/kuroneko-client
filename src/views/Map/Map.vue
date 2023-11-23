<template>
  <!-- ak:api密钥 -->
  <!-- zoom:缩放等级 -->
  <!-- scroll-wheel-zoom:允许滚动缩放 -->
  <baidu-map
    class="map"
    ak="4X3Z3qITk1islBa19lBPMqfkMryPVBXu"
    v="3.0"
    type="API"
    :center="{ lng: 115.782, lat: 28.6596 }"
    :zoom="15"
    :min-zoom="1"
    :max-zoom="100"
    :scroll-wheel-zoom="true"
    @ready="handlePaint"
  >
    <!-- 比例尺控件 -->
    <bm-scale anchor="BMAP_ANCHOR_BOTTOM_LEFT"></bm-scale>
    <!-- 地图类型
      1.标准地图：BMAP_NORMAL_MAP
2.地球模式：BMAP_EARTH_MAP
3.普通卫星地图：BMAP_SATELLITE_MAP
4.BMAP_HYBRID_MAP:标准地图的标点加上卫星地图（混合模式）
     -->
    <bm-map-type
      :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
      anchor="BMAP_ANCHOR_TOP_LEFT"
    ></bm-map-type>
    <!-- 版权 -->
    <bm-copyright
      anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
      :copyright="[{ id: 1, content: 'made by sakura' }]"
    ></bm-copyright>
    <!-- 轨迹 -->
    <bm-control>
      <button class="guijiPlay" @click.stop="guiji">回放</button>
    </bm-control>
    <template v-if="powerShow">
      <bm-polyline
        :path="points"
        stroke-color="#F25C05"
        :stroke-opacity="0.7"
        :stroke-weight="5"
      ></bm-polyline>
      <!-- 步行路线规划
        panel：是否显示检索面板
        autoViewport：检索结束后是否自动调整地图视野
      -->
      <!-- <bm-walking :start="start" :end="end" :panel="false" :autoViewport="true"></bm-walking> -->
      <!-- 标点、信息窗口，同一时间只能打开一个信息窗口 -->
      <!-- 起始点 -->
      <!-- <bm-marker
        :icon="{ url: startImg, size: { width: 36, height: 59 } }"
        :position="{ lng: 115.793, lat: 28.6626 }"
        @click="infoWindowOpen"
      >
        <bm-info-window :show="show" @close="infoWindowClose" @open="infoWindowOpen"
          >江西工贸</bm-info-window
        >
      </bm-marker>
       终点
      <bm-marker
        :icon="{ url: endImg, size: { width: 30, height: 60 } }"
        :position="{ lng: 115.869, lat: 28.6881 }"
        @click="infoWindowOpen1"
      >
        <bm-info-window :show="itemList.show1" @close="infoWindowClose1" @open="infoWindowOpen1"
          >秋水广场</bm-info-window
        >
      </bm-marker> -->
      <bm-marker
        v-for="p in pointInfo"
        :key="p?.id"
        :position="{ lng: p?.lng, lat: p?.lat }"
        @click="showPointDetail(p)"
      >
      </bm-marker>
      <!-- 信息窗口只能存在一个，所以不能放进循环，只能动态改变其坐标和数据来实现点击不同的点显示详情 -->
      <bm-info-window
        :position="{ lng: infoWindow.lng, lat: infoWindow.lat }"
        :show="show"
        @close="infoWindowClose"
        @open="infoWindowOpen"
        >{{ infoWindow }}</bm-info-window
      >
      <!-- 轨迹回放
        rotation：icon随路径旋转朝向
        autoView：自动调整路线视野
       -->
      <bml-lushu
        :play="play"
        :autoView="true"
        :path="points"
        :icon="icon"
        :speed="speed"
        :content="powerSips"
      >
      </bml-lushu>
    </template>
  </baidu-map>
</template>

<script setup>
import {
  BaiduMap,
  BmScale,
  BmMapType,
  BmCopyright,
  BmMarker,
  BmInfoWindow,
  BmControl,
  BmPolyline,
  BmlLushu
} from 'vue-baidu-map-3x'
import { ref } from 'vue'
import startImg from '@/assets/image/startPoint.png'
import endImg from '@/assets/image/endPoint.png'
import kuronekoImg from '@/assets/image/kuroneko-wara_small.png'
import { gpsRequest } from '@/service'

const show = ref(false)

const infoWindow = ref({})

const infoWindowClose = () => {
  show.value = false
}
const infoWindowOpen = () => {
  show.value = true
}

const points = ref([])
const pointInfo = ref([])
const handlePaint = async ({ BMap }) => {
  // BMap,容器实例
  const res = await gpsRequest.get({ url: '/gps/down' })
  // console.log(res.data)
  const pointList = res.data.map((i) => {
    return { lng: i.lng, lat: i.lat }
  })
  pointInfo.value = res.data
  pointInfo.value.push({ lng: 115.932, lat: 28.6411 })
  points.value.push(...pointList, { lng: 115.932, lat: 28.6411 })
}
const powerShow = ref(true)
const play = ref(false)
const speed = ref(200)
const icon = ref({
  url: kuronekoImg,
  size: {
    width: 59,
    height: 86
  },
  opts: {
    anchor: {
      width: 26,
      height: 80
    }
  }
})
const powerSips = ref('测试中~')
const guiji = () => {
  play.value = true
}
const showPointDetail = (pointData) => {
  // console.log(pointData)
  show.value = true
  infoWindow.value = pointData
}
</script>

<style lang="less">
.map {
  position: absolute;
  top: 60px;
  width: 100%;
  //calc 使用时必须要加单位以及运算符左右需要空格
  height: calc(100vh - 60px);
}
.guijiPlay {
  margin-left: 100px;
  margin-top: 10px;
}
</style>
