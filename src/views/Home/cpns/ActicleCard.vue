<script setup>
import { useHomeStore } from '@/stores/useHome'
import getContentText from '@/utils/getContentText'
import { storeToRefs } from 'pinia'

const homeStore = useHomeStore()
homeStore.getMomentList()
const { momentList } = storeToRefs(homeStore)
</script>

<template>
  <div class="acticle-list">
    <ul>
      <li class="acticle-card" v-for="item in momentList" :key="item.id">
        <div class="acticle-card-header">
          <div class="acticle-card__userinfo">
            <div class="user-card">
              <a href="" class="user-avatar">
                <img :src="item.avatar.url" alt="" />
              </a>
              <a href="" class="user-nickname">{{ item.profile?.nickName }}</a>
            </div>
          </div>
          <p class="acticle-card-time">{{ item.createTime }}</p>
        </div>
        <a :href="'/article/' + item.id" class="acticle-card-main">
          <h3 class="acticle-title">{{ item.title }}</h3>
          <div class="acticle--card__content">
            <div class="acticle-preview">
              <img src="@/assets/image/seaside-kuroneko.jpg" />
            </div>
            <div class="acticle-content">
              {{ getContentText(item.content) }}
            </div>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
.acticle-list ul .acticle-card {
  padding: 20px;
  border-bottom: 1px solid #a2a2a2;
  .acticle-card-header {
    display: flex;
    align-items: center;
    height: 24px;
    .acticle-card__userinfo {
      font-size: 12px;
      .user-card {
        display: flex;
        align-items: center;
        a {
          color: #666;
          margin-right: 10px;
        }
        a:hover {
          color: #4cd1e0;
        }
        a img {
          width: 24px;
        }
      }
    }
    p {
      font-size: 12px;
      color: #ccc;
    }
  }
  .acticle-card-main {
    display: flex;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    .acticle-title {
      height: 20px;
      margin-top: 8px;
      padding-right: 100px;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    .acticle--card__content {
      height: 130px;
      display: flex;
      margin-top: 10px;
      .acticle-preview {
        img {
          height: 130px;
          border-radius: 5px;
          margin-right: 10px;
        }
      }
      .acticle-content {
        height: 130px;
        //多行省略
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 8;
        color: #999;
        font-size: 14px;
      }
    }
  }
  .acticle-card-main:hover .acticle-title {
    color: #00c3ff;
  }
}
</style>
