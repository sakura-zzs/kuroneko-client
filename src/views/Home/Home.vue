<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import ActicleCard from './cpns/ActicleCard.vue'
import checkLogin from '@/utils/checkLogin'
import bannerImg from '@/assets/image/kuroneko.png'
import { useHomeStore } from '@/stores/useHome'
import { storeToRefs } from 'pinia'
const router = useRouter()
const homeStore = useHomeStore()
const { labelList } = storeToRefs(homeStore)
onBeforeMount(async () => {
  await homeStore.getLabelList()
})
const bannerRef = ref([bannerImg, bannerImg, bannerImg])
//日历数据
// const value = ref(new Date())

const publish = async () => {
  const loginStatus = await checkLogin()
  if (!loginStatus) return
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
        <!-- <div class="date-table">
          <el-calendar v-model="value" />
        </div> -->
        <div class="publish-btn">
          <el-button type="primary" @click="publish"
            ><el-icon><i-ep-editPen /></el-icon><span>发布</span
            ><el-icon><i-ep-arrowRight /></el-icon
          ></el-button>
        </div>
        <div class="label-list">
          <div class="aside-section">
            <div class="aside-section-header"><h2>标签列表</h2></div>
            <ul class="aside-section-list">
              <li v-for="item in labelList" :key="item.id" class="aside-section-list-item">
                {{ item.name }}
              </li>
            </ul>
          </div>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
.aside-section {
  background-color: #fff;
  border-radius: 4px;
}
.aside-section + .aside-section {
  margin-top: 20px;
}
.aside-section-header {
  display: flex;
  height: 50px;
  border-bottom: 1px solid #ebebeb;
  padding: 0 20px;
  align-items: center;
  h2 {
    font-size: 16px;
  }
}
.label-list {
  width: 100%;
  padding-top: 40px;
}
.aside-section-list {
  width: 100%;
  height: 300px;
  padding: 20px;
  margin: 0;
  list-style: none;
  overflow-y: auto;
  overflow-x: hidden;
}
.aside-section-list .aside-section-list-item {
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  margin: 10px;
  cursor: pointer;
}

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
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 20px;
    .date-table {
      .el-calendar {
        height: 227px;
        border-radius: 5px;
      }
    }
    .publish-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 234px;
      background-color: #fff;
      border-radius: 6px;
      .el-button {
        width: 160px;
        height: 40px;
        color: #663c00;
        background-color: #ffe14c;
        border: none;
        border-radius: 6px;
      }
      .el-icon {
        font-size: 20px;
      }
      span {
        margin: 0 20px 0 10px;
        font-size: 16px;
        font-weight: 600;
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
