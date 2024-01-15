
<script setup>
import { ref, watch } from 'vue';
import { sessionStore, setupStore } from '../store/index'
const session = sessionStore()
const setup = setupStore()
const version = ref(1)
const show = ref(false)
const checked = ref('1')
const props = defineProps({
  isOpen: Boolean,
  sessionList: Array,
  userInfo: Object,
  lineData: Array,
  isAdmin: Boolean
})
const is_continued = ref(true)
const emits = defineEmits(['switchSession', 'edit', 'close', 'change', 'switchVersion', 'report', 'update:isOpen'])
watch(
  () => props.isOpen,
  () => {
    version.value = setup.version
    is_continued.value = setup.continuity
  },
  { immediate: true }
)
const checkedSession = (item) => {
  session.switchSess(item)
  emits('update:showSidebar', false)
  emits('switchSession', item.talk_id)
}
// 切换版本
const switchVersion = (current) => {
  version.value = current
  emits('switchVersion', current)
}

const editSession = (item) => {
  emits('edit', item)
}
const closeSession = (item) => {
  emits('close', item)
}
function openLineModel() {
  const row = props.lineData.find(item => item.flag === '1')
  if (row)
    checked.value = row.key
  show.value = true
}
function confirm() {
  emits('change', checked.value)
}
</script>
<template>
  <div>

  </div>
  <div class="sidebar  color-white" :class="isOpen ? 'sidebar-enter-active' : 'sidebar-leave-activ'">
    <div class="flex text-sm leading-60px justify-between px-4 border-b-1 border-b-#ffffff36 border-b-solid">
      <div class="flex">
        <div i-material-symbols:account-circle class="m-a w-7 h-7 mr-2"></div>
        <span>{{ userInfo.name }}</span>
      </div>

      <div class="flex">连续对话
        <van-switch v-model="is_continued" @change="setup.switchC(is_continued)" size="15px"
          class="m-a ml-2"></van-switch>
      </div>
    </div>
    <!-- 版本切换 -->
    <div class="flex justify-center mx-20px items-center bg-#1F2022 my-20px text-sm">
      <div class="px-30px py-5px flex" :class="version === 1 && 'bg-#353942 color-#4096ff font-bold'"
        @click="switchVersion(1)">
        <div i-material-symbols:navigation class="m-a mr-2" :class="version === 1 && 'color-[#00FF5E]'"></div>普通版
      </div>
      <div class="px-30px py-5px flex" :class="version === 2 && 'bg-#353942 color-#4096ff font-bold'"
        @click="switchVersion(2)">
        <img src=" ../assets/images/horn.png" class="m-a mr-2" v-if="version === 2" />
        <img src="../assets/images/horn_d.png" class="m-a mr-2" v-else />
        旗舰版
      </div>
    </div>
    <!-- 会话 -->
    <div class="text-start px-10px">
      <div class="color-#ffffff82 text-xs py-15px">会话列表</div>
      <div class="h-61vh overflow-auto">
        <div class=" p-2 rounded-md flex justify-between mt-10px" v-for="item in sessionList"
          :class="item.talk_id === session.select && 'bg-#353942'" @click="checkedSession(item)">
          <div class="flex">
            <img src="../assets/images/session.png" class="mr-2 h-25px" />
            <span class="w-[45vw] text-sm text-left truncate ...">{{
              item.talk_name }}</span>
          </div>
          <div class="flex">
            <div i-ri:edit-line class="mr-10px" @click.stop="editSession(item)"></div>
            <div i-material-symbols-light:delete-outline @click.stop="closeSession(item)"></div>
          </div>
        </div>
      </div>

    </div>
    <!-- 操作 -->
    <div class="absolute bottom-0 grid grid-cols-2 text-sm  py-15px px-2 bg-#222324 w-100% flex justify-center">
      <div class="flex items-center" @click="openLineModel" v-if="isAdmin">
        <div i-gis:globe-o class="mr-2"></div>线路管理
      </div>
      <div class="ml-4" v-if="isAdmin">|</div>
      <div class="flex items-center" @click="emits('report', item)">
        <img src="../assets/images/error_icon.png" class="w-23px h-20px ml-25px mr-5px" @click="clearMessage" />
        异常上报
        <!-- <div i-material-symbols-light:work-alert-outline class="mr-2 ml-5"></div> -->
      </div>
    </div>
  </div>
  <van-dialog class="dialog-t" v-model:show="show" title="V3.5版本-配置信息" @confirm="confirm" message-align="left"
    show-cancel-button>
    <div class="px-20px py-10px text-sm">
      <van-radio-group v-model="checked" shape="dot">
        <template v-for="item in lineData">
          <van-radio :name="item.key" checked-color="#fff" class="p-10px color-#FFFFFF rounded"
            :class="checked == item.key && 'bg-#353942'">{{
              item.name }}</van-radio>
        </template>

      </van-radio-group>
    </div>

  </van-dialog>
</template>
<style>
.sidebar {
  position: fixed;
  overflow: hidden;
  top: 0;
  left: -80vw;
  /* 初始位置在左侧屏幕外 */
  width: 80vw;
  height: 100vh;
  background-color: #141516;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  transform: translateX(0);
  /* 动画开始前的位置 */
  transition: transform 0.5s ease-out;
  z-index: 99;
  /* 过渡效果 */
}

/* 在侧边栏显示时，将其移动到屏幕内 */
.sidebar-enter-active {
  transform: translateX(80vw);
}

/* 在侧边栏隐藏时，将其移出屏幕 */
.sidebar-leave-active {
  transform: translateX(0);
}

.van-radio__label {
  color: #fff
}

.van-dialog__header {
  padding-top: 10px;
  padding-left: 20px;
  text-align: start;
}
</style>