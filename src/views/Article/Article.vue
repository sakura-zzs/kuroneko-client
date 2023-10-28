<script setup>
import { useRoute } from 'vue-router'
import { useHomeStore } from '@/stores/useHome'
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { ref, onMounted } from 'vue'
import { createEditor } from '@wangeditor/editor'
const route = useRoute()
const homeStore = useHomeStore()
const { id } = route.params
const editorRef = ref()
onMounted(async () => {
  await homeStore.getMomentList()
  const momentData = homeStore.getMomentById(id)
  const editor = createEditor({ content: JSON.parse(momentData.content) })
  editorRef.value.innerHTML = editor.getHtml()
})
</script>

<template>
  <div class="main-content">
    <el-container>
      <el-main>
        <el-card>
          <div class="wang-editor" ref="editorRef"></div>
        </el-card>
      </el-main>
      <el-aside> aside </el-aside>
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
    background-color: #fff;
    :deep(img) {
      width: 100%;
    }
    .el-card {
      width: 100%;
      padding: 40px 50px;
    }
  }
  .el-aside {
    margin-left: 20px;
  }
}
:deep(.el-card__body) {
  padding: 0;
}
</style>
