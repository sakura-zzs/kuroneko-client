<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useCommentStore } from '@/stores/useComment'
import { debounce } from 'lodash'
import Reply from './Reply.vue'
const replyListIndex = ref(1)
const isShowAllCmt = ref(true)
const toggleReplyList = (index) => {
  if (index === 1) {
    isShowAllCmt.value = true
  } else {
    //筛选出楼主评论
    isShowAllCmt.value = false
  }
  if (index == replyListIndex.value) {
    return
  }
  replyListIndex.value = index
}
const props = defineProps({
  momentId: {
    type: String,
    default: ''
  },
  autherId: {
    type: Number
  }
})
//获取评论数据
const commentStore = useCommentStore()
const replyTextList = computed(() => commentStore.commentText)
let start = 0,
  end = 10
const loadList = ref([])
//更新loadList
watch(replyTextList, (newValue) => {
  loadList.value = [...newValue.slice(start, end)]
})
//下拉加载更多
const loadMore = () => {
  if (end < replyTextList.value?.length) {
    // start += 10
    end += 10
    //追加
    const loadData = replyTextList.value.slice(start, end)
    loadList.value = [...loadData]
  }
}

//页面滚动事件处理函数
const handleScroll = () => {
  //获取页面卷起的高度
  const scrollY = window.scrollY
  //获取窗口高度
  const windowHeight = window.innerHeight
  //获取文档总高
  const documentHeight = document.body.scrollHeight
  //文档总高减去页面卷起高度和窗口高度就能获取到页面剩余高度
  if (scrollY + windowHeight >= documentHeight - 100) {
    loadMore()
  }
}

onMounted(async () => {
  await commentStore.getCommentList(props.momentId)
  await commentStore.getCommentReplyList()
  //使用防抖函数对频繁触发进行优化
  window.addEventListener('scroll', debounce(handleScroll, 1000))
})
//筛选出作者评论
const autherComment = computed(() => commentStore.getAutherCmt(props.autherId))

//回复
const handleReply = (id, index) => {
  //同时只显示一个回复控件
  replyTextList.value.forEach((v, i) => {
    v.isShowReply = i === index ? !v.isShowReply : false
  })
}
</script>

<template>
  <div class="reply-list">
    <div class="reply-list-head">
      <div class="reply-filter">
        <span :class="{ active: replyListIndex == 1 }" @click="toggleReplyList(1)">全部评论</span>
        <span :class="{ active: replyListIndex == 2 }" @click="toggleReplyList(2)">只看楼主</span>
      </div>
    </div>
    <p class="reply-list-empty" v-if="!replyTextList?.length">暂时还没有评论哦~</p>
    <template v-for="(item, index) in isShowAllCmt ? loadList : autherComment" :key="item.id">
      <div class="reply-list-body">
        <div class="reply-detail">
          <div class="reply-detail-left">
            <!-- 跳转至用户空间 -->
            <a href="javascript:;">
              <div class="user-avatar">
                <img src="../../assets/image/user_default.png" alt="" />
              </div>
            </a>
          </div>
          <div class="reply-detail-container">
            <div class="reply-detail-header">
              <div class="reply-detail-account">用户名</div>
              <div class="reply-detail-operation-top">评论权限操作按钮</div>
            </div>
            <div class="reply-detail-content">
              <p v-for="c in item.content" :key="c">{{ c }}</p>
            </div>
            <div class="reply-detail-bottom">
              <div class="reply-detail-operation-bottom">
                <div class="reply-detail-time">{{ item.createTime }}</div>
                <div class="reply-detail-operation-bottom-right">
                  <div @click="handleReply(item.id, index)" class="reply-detail-bottom-reply-btn">
                    回复
                  </div>
                  <div class="heart-click">
                    点赞
                    <span>0</span>
                  </div>
                  <div class="down-click">点踩</div>
                </div>
              </div>
            </div>
            <div
              class="reply-detail-replies"
              v-if="item.isShowReply || item.commentReplyList?.length"
            >
              <reply v-if="item.isShowReply" :maxLength="500" />
              <template v-for="commentReply in item.commentReplyList" :key="commentReply.id">
                <div class="reply-detail-comment-reply">
                  <div class="reply-detail-comment-reply-header">
                    <div class="reply-detail-comment-reply-account">
                      <a href="javascript:;">
                        <img src="../../assets/image/user_default.png" alt="" />
                        <span>用户名</span>
                      </a>
                    </div>
                    <div class="reply-detail-comment-reply-operation-top">评论权限操作按钮</div>
                  </div>
                  <div class="reply-detail-comment-reply-content">{{ commentReply.content }}</div>
                  <div class="reply-detail-comment-reply-bottom">
                    <div class="reply-detail-comment-reply-time">{{ commentReply.createTime }}</div>
                    <div class="reply-detail-comment-reply-operation-bottom-right">
                      <div class="reply-detail-comment-reply-bottom-reply-btn">回复</div>
                      <div class="heart-click">
                        点赞
                        <span>0</span>
                      </div>
                      <div class="down-click">点踩</div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
    <p class="loading" v-if="loadList?.length < replyTextList?.length">加载中...</p>
    <p class="reachBottom" v-else>已经到底了哦~</p>
  </div>
</template>

<style lang="less" scoped>
.loading,
.reachBottom {
  color: #ccc;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.heart-click,
.down-click {
  cursor: pointer;
}
.heart-click span {
  margin-left: 8px;
  margin-top: 1px;
  margin-right: 18px;
}
.reply-list-head {
  padding: 0 50px;
  height: 50px;
  display: flex;
  align-items: center;
  .reply-filter {
    display: flex;
    span {
      vertical-align: top;
      text-align: center;
      cursor: pointer;
      font-size: 16px;
      height: 50px;
      line-height: 50px;
      position: relative;
    }
    span + span {
      margin-left: 40px;
    }
  }
}
.reply-list-empty {
  color: #ccc;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.reply-list-body {
  border-bottom: 1px solid #eee;
  .reply-detail {
    display: flex;
    padding: 24px 50px;
    overflow: visible;
    background-color: #fff;
    font-size: 14px;
    color: #666;
    .reply-detail-left .user-avatar {
      width: 44px;
      height: 44px;
      margin-right: 10px;
    }
    .reply-detail-left .user-avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 1px solid #ebebeb;
      vertical-align: top;
    }
    .reply-detail-container {
      flex: 1;
      position: relative;
      width: 100%;
      overflow: visible;
      .reply-detail-header {
        display: flex;
        padding-top: 2px;
        .reply-detail-account {
          flex-grow: 1;
        }
      }
      .reply-detail-content {
        padding: 20px 0;
      }
      .reply-detail-operation-bottom {
        display: flex;
        justify-content: space-between;
        color: #ccc;
        .reply-detail-operation-bottom-right {
          display: flex;
          align-items: center;
          .reply-detail-bottom-reply-btn {
            line-height: 14px;
            margin-right: 15px;
            cursor: pointer;
            border-right: 1px solid #ccc;
            padding: 0 15px;
          }
        }
      }
      .reply-detail-replies {
        padding: 15px;
        background-color: #f7f8fc;
        border-radius: 8px;
        margin-top: 20px;
        overflow: hidden;
        .reply-detail-comment-reply-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .reply-detail-comment-reply-account a {
            display: flex;
            align-items: center;
            color: #00b2ff;
            img {
              width: 24px;
              height: 24px;
              margin: 0 8px 0 0;
            }
          }
        }
        .reply-detail-comment-reply-content {
          margin-top: 3px;
          font-size: 14px;
          padding-left: 32px;
          line-height: 24px;
          color: #666;
          overflow: hidden;
        }
        .reply-detail-comment-reply-bottom {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          color: #ccc;
          .reply-detail-comment-reply-operation-bottom-right {
            display: flex;
            align-items: center;
            .reply-detail-comment-reply-bottom-reply-btn {
              line-height: 14px;
              margin-right: 15px;
              cursor: pointer;
              border-right: 1px solid #ccc;
              padding: 0 15px;
            }
          }
        }
      }
    }
  }
}
.active {
  color: #00c3ff;
  font-weight: 600;
  border-bottom: 3px solid #00c3ff;
}
</style>
