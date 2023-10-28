// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import kuronekoRequest from '@/service/index'

export const useHomeStore = defineStore('home', {
  state: () => {
    return {
      momentList: []
    }
  },
  getters: {
    getMomentById(state) {
      return (id) => {
        return state.momentList.find((i) => i.id == id)
      }
    }
  },
  actions: {
    async getMomentList() {
      const { data } = await kuronekoRequest.get({ url: '/moment' })
      this.momentList = data
    }
  }
})
