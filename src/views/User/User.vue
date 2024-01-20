<template>
  <div>
    <el-container class="main-container" :style="headerTitle">
      <div class="main-content">
        <el-header class="main-content-header">
          <div class="account-center-avatar">
            <img src="../../assets/image/user_default.png" alt="" />
          </div>
          <div class="account-center-user-info">
            <div class="account-center-user-info-header">
              <span>用户名</span>
              <el-button plain>编辑</el-button>
            </div>
            <div class="account-center-user-info-intro">个性签名</div>
            <div class="account-center-user-info-data"><span>333</span><span>获赞数</span></div>
          </div>
        </el-header>
        <el-main>
          <el-tabs @tab-click="changeTitle" tab-position="left" class="demo-tabs">
            <el-tab-pane label="我的发帖">
              <template #label>
                <div class="accountCenter-item">
                  <el-icon><i-ep-tickets /></el-icon><span>我的发帖</span>
                </div>
              </template>
              <div class="main-content-container">
                <div class="main-content-container-header">我的发帖</div>
                <el-card>
                  <ActicleCard />
                </el-card>
              </div>
            </el-tab-pane>
            <el-tab-pane label="我的评论"
              ><template #label>
                <div class="accountCenter-item">
                  <el-icon><i-ep-comment /></el-icon><span>我的评论</span>
                </div>
              </template>
              <div class="main-content-container">
                <div class="main-content-container-header">我的评论</div>
                <el-card>
                  <div class="main-content-container-list">
                    <div class="main-content-container-list-item">
                      <div class="main-content-container-list-item-header">时间</div>
                      <div class="main-content-container-list-item-reply-card">
                        <div class="main-content-container-list-item-reply-card-content">
                          回复内容
                        </div>
                        <div class="main-content-container-list-item-reply-card-origin">
                          回复帖子:xxx/回复评论:xxx
                        </div>
                      </div>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-tab-pane>
            <el-tab-pane label="编辑资料"
              ><template #label>
                <div class="accountCenter-item">
                  <el-icon><i-ep-user-filled /></el-icon><span>编辑资料</span>
                </div>
              </template>
              <div class="main-content-container">
                <div class="main-content-container-header">编辑资料</div>
                <div class="account-info-edit-content">
                  <div class="account-info-edit-avatar">
                    <el-upload limit="1" action="#" list-type="picture-card" :auto-upload="false">
                      <el-icon><i-ep-plus /></el-icon>
                      <template #file="{ file }">
                        <div>
                          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                          <span class="el-upload-list__item-actions">
                            <span
                              class="el-upload-list__item-preview"
                              @click="handlePictureCardPreview(file)"
                            >
                              <el-icon><i-ep-zoom-in /></el-icon>
                            </span>
                            <span
                              v-if="!disabled"
                              class="el-upload-list__item-delete"
                              @click="handleDownload(file)"
                            >
                              <el-icon><i-ep-download /></el-icon>
                            </span>
                            <span
                              v-if="!disabled"
                              class="el-upload-list__item-delete"
                              @click="handleRemove(file)"
                            >
                              <el-icon><i-ep-delete /></el-icon>
                            </span>
                          </span>
                        </div>
                      </template>
                    </el-upload>

                    <el-dialog v-model="dialogVisible">
                      <img w-full :src="dialogImageUrl" alt="Preview Image" />
                    </el-dialog>
                  </div>
                  <div class="account-info-edit-form">
                    <div class="account-form-nick-name account-info-edit-form-item">
                      <span>昵称</span>
                      <el-input
                        v-model="text"
                        maxlength="10"
                        placeholder="Please input"
                        show-word-limit
                        type="text"
                      >
                      </el-input>
                    </div>
                    <div class="account-form-sex account-info-edit-form-item">
                      <span>性别</span>
                      <el-radio-group v-model="radio">
                        <el-radio label="male">男</el-radio>
                        <el-radio label="female">女</el-radio>
                        <el-radio label="unknow">未知</el-radio>
                      </el-radio-group>
                    </div>
                    <div class="account-form-intro account-info-edit-form-item">
                      <span>个性签名</span>
                      <el-input
                        v-model="textarea"
                        maxlength="48"
                        placeholder="Please input"
                        show-word-limit
                        type="textarea"
                        resize="none"
                      >
                      </el-input>
                    </div>
                    <div class="account-form-birth account-info-edit-form-item">
                      <span>出生日期</span>
                      <el-date-picker
                        v-model="value1"
                        type="date"
                        placeholder="Pick a day"
                        :size="size"
                      />
                    </div>
                    <div class="account-form-location account-info-edit-form-item">
                      <span>地点</span>
                      <el-input
                        v-model="text"
                        maxlength="10"
                        placeholder="Please input"
                        show-word-limit
                        type="text"
                      >
                      </el-input>
                    </div>
                  </div>
                  <div class="account-info-edit-footer">
                    <el-button class="custom-button" plain>保存</el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="退出登录"
              ><template #label>
                <div class="accountCenter-item">
                  <el-icon><i-ep-switch-button /></el-icon><span>退出登录</span>
                </div>
              </template></el-tab-pane
            >
          </el-tabs>
        </el-main>
      </div>
    </el-container>
  </div>
</template>

<script setup>
import ActicleCard from '../Home/cpns/ActicleCard.vue'
import { ref } from 'vue'
const changeTitle = ({ props }) => {
  console.log(props.label)
}

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

const handleRemove = (file) => {
  console.log(file)
}

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}

const handleDownload = (file) => {
  console.log(file)
}
const radio = ref('male')
</script>

<style lang="less" scoped>
.el-button {
  border-color: #00d5ff;
  color: #00d5ff;
}
.custom-button {
  line-height: 32px;
  width: 106px;
  font-size: 16px;
}
:deep(.el-date-editor--date) {
  margin-left: -10px;
}
.account-info-edit-content {
  padding: 40px 30px 100px;
  .account-info-edit-avatar {
    width: 120px;
    margin: 0 auto 23px;
  }
  .account-info-edit-form {
    line-height: 44px;
    overflow: hidden;
    .account-info-edit-form-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      span {
        display: flex;
        width: 66px;
        color: #999;
        margin-right: 30px;
        font-size: 14px;
      }
    }
  }
  .account-info-edit-footer {
    text-align: center;
    margin-top: 30px;
  }
}
.main-content-container-list-item {
  padding-top: 24px;
  .main-content-container-list-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    color: #999;
  }
  .main-content-container-list-item-reply-card {
    cursor: pointer;
    flex-grow: 1;
    padding: 24px 30px;
    overflow: hidden;
    .main-content-container-list-item-reply-card-content {
      font-size: 16px;
      font-weight: 600;
      line-height: 20px;
    }
    .main-content-container-list-item-reply-card-origin {
      padding: 15px;
      background-color: #f7f8fc;
      border-radius: 4px;
      margin-top: 12px;
      color: #999;
      line-height: 18px;
    }
  }
}
.main-container {
  display: flex;
  justify-content: center;
  // padding: 62px 0;
  .main-content {
    width: 1200px;
    padding: 30px 100px 0;
    color: #333;
    border: none;
    .main-content-header {
      padding: 20px 50px 24px 90px;
      display: flex;
      margin-bottom: 20px;
      .account-center-avatar {
        width: 120px;
        height: 120px;
        margin-right: 24px;
      }
      .account-center-user-info {
        flex-grow: 1;
        .account-center-user-info-header {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          line-height: 21px;
          font-weight: 600;
        }
        .account-center-user-info-intro {
          display: flex;
          margin-top: 12px;
          color: #666;
          line-height: 18px;
        }
        .account-center-user-info-data {
          display: flex;
          padding-top: 19px;
          align-items: center;
          margin-top: 20px;
          border-top: 1px solid #f0f0f0;
          span {
            font-size: 20px;
            color: #333;
          }
          span + span {
            font-size: 14px;
            color: #ccc;
            margin-left: 10px;
          }
        }
      }
    }
    .main-content-container {
      background-color: #fff;
      border-radius: 4px;
      .main-content-container-header {
        width: 100%;
        padding: 0 30px;
        line-height: 50px;
        border-bottom: 1px solid #ebebeb;
        font-size: 16px;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
:deep(.el-card__body) {
  padding: 0;
}
:deep(.el-card.is-always-shadow) {
  box-shadow: none;
}
:deep(.el-card) {
  border: none;
  border-radius: none;
}
:deep(.el-icon) {
  width: 18px;
  font-size: 18px;
  vertical-align: top;
  display: inline-block;
  color: #d9d9d9;
  margin-right: 15px;
}
:deep(.el-tabs--left .el-tabs__active-bar.is-left) {
  right: -140px;
}
:deep(.el-tabs__header) {
  width: 280px;
  margin: 0 30px 10px;
  background-color: #fff;
  border-radius: 4px;
}
.accountCenter-item {
  padding: 0 20px;
  line-height: 50px;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    color: #00c3ff;
    .el-icon {
      color: #00c3ff;
    }
  }
}

:deep(.el-tabs--left .el-tabs__header.is-left) {
  margin-right: 20px;
}
:deep(.el-tabs__nav-wrap) {
  padding: 0 30px 10px;
}
:deep(.el-tabs__header::before) {
  content: '个人中心';
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  padding: 0 30px;
  line-height: 50px;
  border-bottom: 1px solid #ebebeb;
  font-size: 16px;
}
:deep(.el-header) {
  height: auto;
}
</style>
