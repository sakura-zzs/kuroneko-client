<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ActicleCard from './cpns/ActicleCard.vue'
const router = useRouter()
const bannerRef = ref([
  '/src/assets/image/kuroneko.png',
  '/src/assets/image/kuroneko.png',
  '/src/assets/image/kuroneko.png'
])
const value = ref(new Date())
//todo:验证登录状态
const publish = () => {
  router.push({ path: '/publish' })
}
</script>

<template>
  <div class="main-content">
    <el-container>
      <el-main>
        <el-carousel
          :interval="4000"
          type="card"
          height="200px"
          arrow="always"
          indicator-position="outside"
        >
          <el-carousel-item v-for="item in bannerRef" :key="item">
            <img :src="item" />
          </el-carousel-item>
        </el-carousel>
        <el-card>
          <acticle-card />
        </el-card>
      </el-main>
      <el-aside>
        <div class="date-table">
          <el-calendar v-model="value" />
        </div>
        <button @click="publish">发布</button>
      </el-aside>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
.main-content {
  width: 1200px;
  padding: 30px 100px 0;
  color: #333;
  border: none;
  .el-main {
    padding: 0;
    .el-carousel {
      margin-bottom: 30px;
      .el-carousel__item {
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .el-aside {
    margin-left: 20px;
    .date-table {
      .el-calendar {
        height: 227px;
        border-radius: 5px;
      }
    }
  }
}
:deep(.el-calendar-table thead th) {
  padding: 0 0 5px;
}
:deep(.el-calendar-table .el-calendar-day) {
  height: 20px;
  line-height: 20px;
  text-align: center;
  padding: 0;
}
:deep(.el-card__body) {
  padding: 0;
}
:deep(.el-carousel__arrow) {
  background-color: rgba(0, 0, 0, 0.5);
}
:deep(.el-carousel__arrow:hover) {
  background-color: #00c3ff;
}
:deep(.el-carousel__item) {
  border-radius: 10px;
}
:deep(.el-carousel__indicator.is-active .el-carousel__button) {
  background-color: #00c3ff;
}
:deep(.el-carousel__mask) {
  background-color: #000;
  opacity: 0.5;
}
</style>
