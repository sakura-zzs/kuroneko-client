import { defineStore } from 'pinia'
import kuronekoRequest from '@/service/index'
import { localCache } from '@/utils/cache'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userProfile: {},
      loginStatus: false,
      isAvatarUrl: null,
      //控制登录窗口显示隐藏
      isLogin: false,
      userCommentList: []
    }
  },
  getters: {},
  actions: {
    async getUserProfile() {
      const id = localCache.getItem('id')
      const { data } = await kuronekoRequest.get({ url: `/user/profile?id=${id}` })
      this.userProfile = data[0]
      this.isAvatarUrl = this.userProfile.avatar.url
    },
    async getUserCommentList() {
      const id = localCache.getItem('id')
      const { data } = await kuronekoRequest.get({ url: `comment/user/${id}` })
      this.userCommentList = data
    }
  },
  //持久化
  persist: true
})
