<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { localCache } from '@/utils/cache'
import { uploadRequest } from '@/service'
import kuronekoRequest from '@/service/index'
import { useRouter } from 'vue-router'
const router = useRouter()
const token = localCache.getItem('token')
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
//工具栏模式
const mode = ref('default')
//编辑器中插入过的所有图片
let insertedImageList = []
//最终要发布的图片列表
let publishImageList = []
//要删除的图片列表（差异）
let deleteImageList = []
// 内容 HTML
const valueHtml = ref('<p>hello</p>')

// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
  }, 1500)
})
/**
 * 菜单key获取方法
 * f12检查对应菜单，data-menu-key属性即为该菜单项的key
 */
//工具栏配置
const toolbarConfig = {
  excludeKeys: [
    'group-video', // 排除视频上传菜单
    'fullScreen' //排除全屏编辑
  ]
}
const editorConfig = { MENU_CONF: [], placeholder: '请输入内容...' }
//图片上传
editorConfig.MENU_CONF['uploadImage'] = {
  server: '/api/upload/moment',
  // form-data fieldName ，默认值 'wangeditor-uploaded-image'
  fieldName: 'momentImg',

  // 单个文件的最大体积限制，默认为 2M
  maxFileSize: 10 * 1024 * 1024, // 1M

  // 最多可上传几个文件，默认为 100
  maxNumberOfFiles: 9,

  // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
  allowedFileTypes: ['image/*'],

  // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
  // meta: {
  //     token: 'xxx',
  //     otherKey: 'yyy'
  // },

  // 将 meta 拼接到 url 参数中，默认 false
  metaWithUrl: false,

  // 自定义增加 http  header
  headers: {
    Accept: 'text/x-json',
    otherKey: 'xxx',
    authorization: token
  },

  // 跨域是否传递 cookie ，默认为 false
  withCredentials: true,

  // 超时时间，默认为 10 秒
  timeout: 5 * 1000, // 5 秒
  // 上传之前触发
  // onBeforeUpload(file) {
  //   // file 选中的文件，格式如 { key: file }
  //   return file

  //   // 可以 return
  //   // 1. return file 或者 new 一个 file ，接下来将上传
  //   // 2. return false ，不上传这个 file
  // },

  // // 上传进度的回调函数
  // onProgress(progress) {
  //   // progress 是 0-100 的数字
  //   console.log('progress', progress)
  // },

  // // 单个文件上传成功之后
  // onSuccess(file, res) {
  //   console.log(`${file.name} 上传成功`, res)
  // },

  // // 单个文件上传失败
  // onFailed(file, res) {
  //   console.log(`${file.name} 上传失败`, res)
  // },

  // // 上传错误，或者触发 timeout 超时
  // onError(file, err, res) {
  //   console.log(`${file.name} 上传出错`, err, res)
  // },
  // 自定义上传
  async customUpload(file, insertFn) {
    // file 即选中的文件
    // 自己实现上传，并得到图片 url alt href
    // 最后插入图片
    // console.log(file)
    const { data } = await uploadRequest.post({
      url: '/upload/moment',
      data: {
        momentImg: file
      }
    })
    console.log(data)
    //将图片id保存在alt中
    const { url, id } = data.imgLinks[0]
    console.log(url)
    insertFn(url, id, url)
  }
}

//插入图片监听
editorConfig.MENU_CONF['insertImage'] = {
  //插入图片后进行图片记录，最后发布时，比对图片记录，将多余图片从服务器删除
  onInsertedImage(imageNode) {
    if (imageNode == null) return
    insertedImageList.push(imageNode)
  }
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const publishing = async () => {
  //编辑完成，点击发布按钮获取编辑器中插入的所有图片
  publishImageList = editorRef.value.getElemsByType('image')
  //将要删除的图片筛选出来
  deleteImageList = insertedImageList.filter((i) => !publishImageList.some((p) => i.alt == p.alt))
  //删除服务器中要删除的图片
  if (deleteImageList.length) {
    deleteImageList.forEach(async (item) => {
      const id = item.alt
      await kuronekoRequest.delete({ url: '/upload/moment', params: { id } })
    })
  }
  //获取编辑器json格式数据保存到数据库（将动态数据保存）
  //todo:验证数据有效性
  const content = editorRef.value.children
  const title = '测试标题'
  const { data } = await kuronekoRequest.post({ url: '/moment', data: { title, content } })
  //获取动态id
  const momentId = data.insertId
  //将插入的图片与动态进行绑定
  if (publishImageList.length) {
    publishImageList.forEach(async (item) => {
      const id = item.alt
      await kuronekoRequest.patch({ url: '/upload/moment', data: { momentId }, params: { id } })
    })
  }
  //重置
  insertedImageList = []
  ElMessage({
    showClose: true,
    message: '发布成功！',
    center: true,
    type: 'success'
  })
  router.push('/home')
}
</script>

<template>
  <el-card>
    <div class="wang-editor" style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 500px; overflow-y: hidden"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
      />
    </div>
    <el-button type="primary" @click="publishing">发布</el-button>
  </el-card>
</template>

<style lang="less" scoped>
.wang-editor {
  width: 740px;
}
</style>
