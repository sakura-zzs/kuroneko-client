// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import kuronekoRequest from '@/service/index'

export const useHomeStore = defineStore('home', {
  state: () => {
    return {
      momentList: [],
      isSearch: false,
      searchList: [],
      labelList: []
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
    },
    async getLabelList() {
      const { data } = await kuronekoRequest.get({ url: '/label' })
      this.labelList = data
    },
    handleSearch(tagName) {
      const keywords = tagName.trim()
      this.isSearch = false
      this.searchList = []
      if (!this.isSearch && keywords?.length) {
        this.momentList.forEach((v) => {
          if (JSON.stringify(v.labelList).indexOf(keywords) !== -1) {
            this.searchList.push(v)
          }
        })
        if (this.searchList?.length) {
          this.isSearch = true
        }
      }
    }
  }
})
