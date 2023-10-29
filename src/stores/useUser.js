import { defineStore } from 'pinia'
import kuronekoRequest from '@/service/index'
import { localCache } from '@/utils/cache'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userProfile: {},
      loginStatus: false,
      isAvatarUrl: null
    }
  },
  getters: {},
  actions: {
    async getUserProfile() {
      const id = localCache.getItem('id')
      const { data } = await kuronekoRequest.get({ url: `/user/profile?id=${id}` })
      this.userProfile = data[0]
    }
  },
  //持久化
  persist: true
})
