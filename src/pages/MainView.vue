
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Answer from '../components/Answer.vue'
import Question from '../components/Question.vue'
import Sidebar from '../components/Sidebar.vue';

import { userStore, sessionStore, sessionListStore, setupStore } from '../store/index.js'
import { getUserInfoApi } from "../api/user/index";
import { createWindowApi, errorReport } from '../api/system/index'
import { getSetkeyList, createSetkey, delectSetkey, updateSetkey } from '../api/setkey/index'
import { getWindowApi, deleteSeesion, getHistorySessionApi, askQuestion, editSeesion } from "../api/system/index";
import {
  showToast,
  showConfirmDialog, showDialog,
  showSuccessToast, showFailToast
} from 'vant';
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
//boolean
const isInputing = ref(false)
const isLoading = ref(false)
const show = ref(false)
const isSending = ref(false)
// store
const user = userStore()
const session = sessionStore()
const sesslist = sessionListStore()
const setup = setupStore()
// value
const confirmText = ref('确认')
const isAdmin = ref(false)
const messageRef = ref('')
const showSidebar = ref(false)
const chatList = ref([])
const sessionList = ref([])
const title = ref('')
const questionText = ref('')
const lineApiKey = ['list', 'list4']
const lineData = ref([])
// params
let lineParams = ref({
  code: '',
  action: 'list'
})
const userParams = ref({
  code: '',
  state: 'STATE',
  act: 'get_login'
})
const userInfo = ref({ name: '', union_id: '' })
const wParams = ref({
  code: '',
  state: 'STATE',
  act: 'get_cate'
})
const historyParams = ref({
  union_id: '',
  talk_id: '',
  act: 'history'
})
const sessionParams = ref({
  union_id: '',
  talk_name: '',
  act: 'edit_cate',
  talk_id: '',
})
const askParmas = ref({
  message: '',
  context: '',
  union_id: '',
  talk_id: ''
})
const delectParams = ref({
  union_id: '',
  talk_id: '',
  act: 'del_cate'
})
const reportParams = ref({
  union_id: '',
  act: 'report'
})
const openlineParams = ref({
  code: '',
  pkey: '',
  action: 'enable'
})

function getHtml(text, icon) {
  let bg = '#fff'
  let color = '#000'
  if (icon === 'close') {
    bg = '#E60C00'
    color = '#fff !important'
  }
  if (icon === 'passed') {
    bg = '#008407'
    color = '#fff !important'
  }
  const toast = document.getElementsByClassName('van-toast')
  if (toast.length) {
    for (let i = 0; i < toast.length; i++) {
      toast[i].style.backgroundColor = bg;
      toast[i].style.Color = color;
    }
  }
  if (icon) {
    return `<div style="height:22px;display:flex;justify-content: center;align-items: center;">
    <i class="van-icon van-icon-${icon}" style="font-size:16px;margin-right:5px;color:${color}"></i>
    <span style="color:${color}">${text}</span></div>`
  } else {
    return `<div style="height:22px;display:flex;justify-content: center;align-items: center;"><span style="color:${color}">${text}</span></div>`
  }

}

function scrollY() {
  if (messageRef.value) {
    messageRef.value.scrollTo(0, messageRef.value.scrollHeight);

  }
}

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

const getUser = async () => {
  userParams.value.code = user.code
  const res = await getUserInfoApi(userParams)
  const { data } = res
  if (data) {
    userInfo.value = data
    user.getUnionId(data.union_id)

    getWindowList()
  } else {
    isLoading.value = false
  }
}

// 获取窗口列表
const getWindowList = async (type) => {
  wParams.value.code = user.code
  getWindowApi(wParams).then((res) => {
    if (res.data) {
      let selected = res.data[0].talk_id
      let sessName = res.data[0].talk_name
      // 删除当前的窗口，获取第一个
      if (historyParams.value.talk_id == session.select) {
        // 永远获取第一个
        selected = res.data[0].talk_id
        sessName = res.data[0].talk_name
      }
      let row = res.data.find(o => o.talk_id === session.select)
      if (row) {
        selected = session.select
      }
      session.switchSess({
        talk_id: selected,
        talk_name: sessName
      })
      sesslist.sessionList = res.data
      // 给所有对话消息内容创建一个空的数据
      for (let i = 0; i < sesslist.sessionList.length; i++) {
        // 历史记录
        setup.setMessage({ talk_id: sesslist.sessionList[i].talk_id, data: [] })
        // 当前问答的内容
        setup.setContentList({ talk_id: sesslist.sessionList[i].talk_id, data: [] })
      }
      if (session.select && type !== 'edit')
        getHistoryByTalkId(selected)

    } else {
      isLoading.value = false
      showToast({
        message: getHtml('获取窗口列表失败', 'close'),
        type: 'html'
      })
    }
  });
}
// 获取talk_id对话的历史记录
async function getHistoryByTalkId(talk_id) {
  // 每次查询前先清除之前遗留的问答
  // setup.clearContentList()
  historyParams.value.union_id = user.union_id
  historyParams.value.talk_id = talk_id
  await getHistorySessionApi(historyParams).then((res) => {
    if (res.data) {
      const item = setup.message.find(o => o.talk_id === talk_id)
      item.data = res.data.data
      getHistory(talk_id)
    }
  })
}

// 获取历史记录-查询会话信息列表
const getHistory = (ssid) => {
  chatList.value = []
  let currentSession = setup.message.find(item => item.talk_id == ssid)
  if (!isSending.value) {
    const row = setup.contentList.find(item => item.talk_id === session.select)
    if (row && row.data) {
      row.data = []
    }
    chatList.value = [...currentSession.data]
  } else {
    let dataMsg = setup.contentList && setup.contentList.find(item => item.talk_id == ssid)
    if (dataMsg) {
      chatList.value = [...chatList.value, ...dataMsg.data]
    }
  }
  isLoading.value = false
  setTimeout(() => {
    scrollY()
  }, 20)
}

const deleteSess = (item) => {
  if (isInputing.value) {
    showToast({
      message: getHtml('智能工作助手还在回答，请稍等'),
      type: 'html'
    })
    return
  }
  delectParams.value.talk_id = item.talk_id
  delectParams.value.union_id = user.union_id
  showConfirmDialog({
    title: '提示',
    message: '确认要删除"' + item.talk_name + '"对话窗口吗？',
  })
    .then(() => {
      // on confirm
      if (sesslist.sessionList.length == 1) {
        showToast({
          message: getHtml('至少保留一个对话窗口'),
          type: 'html'
        })
        return
      }
      deleteSeesion(delectParams).then((res) => {
        if (res.data.success) {
          showSidebar.value = false
          showToast({
            message: getHtml('删除成功', 'passed'),
            type: 'html'
          })
          getWindowList()
        } else {
          showToast({
            message: getHtml(res.data.message, 'close'),
            type: 'html'
          })
        }
      })
    })
    .catch(() => {
      // on cancel
    });
}
const openEditModal = (item) => {
  show.value = true
  title.value = '编辑对话'
  sessionParams.value.talk_name = item.talk_name
  sessionParams.value.act = 'edit_cate'
  sessionParams.value.talk_id = item.talk_id
  sessionParams.value.union_id = user.union_id
}

const createSession = () => {
  show.value = true
  title.value = '新建对话'
  sessionParams.value.talk_name = ''
  sessionParams.value.act = 'add_cate'
  sessionParams.value.talk_id = ''
  sessionParams.value.union_id = user.union_id
}

const confirm = () => {
  if (sessionParams.value.talk_name == '') {
    showToast({
      message: getHtml('请输入会话名称'),
      type: 'html'
    })
    return
  }

  if (sessionParams.value.act == 'add_cate') {
    createWindowApi(sessionParams).then(res => {
      if (res.data.success) {
        if (sesslist.sessionList.length + 1 > 10) {
          showDialog({
            confirmButtonText: 'OK',
            message: '已超出创建聊天窗口限制',
          }).then(() => {
            // on close
          });
          return
        }
        showToast({
          message: getHtml('创建成功', 'passed'),
          type: 'html'
        })
        showSidebar.value = false
        getWindowList('edit')
      } else {
        showToast({
          message: getHtml(res.data.message, 'close'),
          type: 'html'
        })
      }
    })
  } else {
    editSeesion(sessionParams).then((res) => {
      if (res.data.success) {
        showToast({
          message: getHtml('修改成功', 'passed'),
          type: 'html'
        })
        showSidebar.value = false
        getWindowList('edit')
      } else {
        showToast({
          message: getHtml(res.data.message, 'close'),
          type: 'html'
        })
      }
    })
  }
}
// 切换版本
const switchVersion = (key) => {
  setup.switchV(key)
}

// 清屏
const clearMessage = () => {
  if (!isInputing.value) {
    console.log('清屏')
    setup.clear(session.select)
    setup.setMessage({ talk_id: session.select, data: [] })
    console.log('contentList---', setup.contentList)

    const row = setup.contentList.find(item => item.talk_id === session.select)
    if (row && row.data) {
      row.data = []
    }
    console.log('message---', setup.message)
    console.log('contentList---', setup.contentList)
    // setup.setContentList({ talk_id: session.select, data: [] })
    // let currentSession = setup.message.find(item => item.talk_id == session.select)
    // let dataMsg = setup.contentList.find(item => item.talk_id == session.select)
    chatList.value = []
  } else {
    showToast({
      message: getHtml('智能工作助手还在回答，请稍等'),
      type: 'html'
    })
  }
}


// 发送--提问
const send = async () => {
  if (!questionText.value.trim()) {
    showToast({
      message: getHtml('请输入提问内容后再发送'),
      type: 'html'
    })
    questionText.value = ''
    return
  }
  let messageArray = []
  let historyArray = []
  if (setup.message.length) {
    let rowM = setup.message.find(o => o.talk_id === session.select)
    if (rowM.data) historyArray = rowM.data
    let rowContent = setup.contentList.find(o => o.talk_id === session.select)
    if (rowContent.data) messageArray = rowContent.data
  }

  askParmas.value.message = questionText.value
  askParmas.value.union_id = user.union_id
  askParmas.value.talk_id = session.select
  askParmas.value.context = []
  // 是否开启连续对话
  if (setup.continuity) {
    // 查询历史记录
    historyParams.value.talk_id = session.select
    const res = await getHistorySessionApi(historyParams)
    const { data } = res
    if (data.data.length) {
      // 获取后3条内容
      let dataArr = data.data.slice(data.data.length - 3)
      askParmas.value.context = JSON.stringify(dataArr.map(item => [item.title, item.content]))
    }
  }
  // version  1 普通版 2 旗舰版
  let url = setup.version === 1 ? '/setsession.php' : '/setsession4.php'
  // 获取当前会话中问答的数据
  let dataMsg = setup.message.find(o => o.talk_id === session.select)
  // 合并历史数据和当前问答的数据
  messageArray.push(...dataMsg.data, { title: questionText.value })
  chatList.value = messageArray
  questionText.value = null
  askQuestion(url, askParmas).then(res => {
    setup.setAskTalkId(askParmas.value.talk_id)
    isInputing.value = true
    isLoading.value = true
    // 滚动
    scrollY()
    // 错误时关闭loading和按钮禁用
    if (!res.data.success) {
      // 去掉聚焦点 
      const btn = document.getElementById('sendBtn')
      btn.blur()
      showToast({
        message: getHtml(res.data.errmsg ? res.data.errmsg : '操作失败，请联系管理员', 'close'),
        type: 'html'
      })
      isLoading.value = false
      isInputing.value = false
      questionText.value = '  '
      return
    }
    getConten()

  })
}


// 回答
const getConten = async () => {

  let url = setup.version === 1 ? '/stream.php' : '/stream4.php'
  const sse = new EventSource(import.meta.env.VITE_BASE_URL + url + '?union_id=' + user.union_id + '&talk_id=' + setup.askTalkId)
  sse.value = sse
  let messageArray = setup.contentList.find(o => o.talk_id === setup.askTalkId).data
  messageArray.push({ content: '' })
  // messageArray.push(...dataMsg)
  // const list = []
  sse.onmessage = async (e) => {
    isLoading.value = false
    isSending.value = true
    let domStop = document.getElementById("stopButton")
    if (domStop) {
      domStop.addEventListener("click", function() {
        sse.close();
        isSending.value = false
        isInputing.value = false
      });
    }
    scrollY()
  }
  sse.addEventListener('message', (e) => {
    let messageArray = setup.contentList.find(o => o.talk_id === setup.askTalkId).data
    let data = ''
    // 处理收到的消息
    if (e.data === '[DONE]') {
      sse.close()
      setup.setContentList([])
      isSending.value = false
      isInputing.value = false
      return
    }
    // 处理收到的消息
    data = JSON.parse(e.data).choices[0].delta.content
    const last = messageArray.pop()
    const lastContent = last.content + data
    messageArray.push({ content: lastContent, state: 'success' })
    // 如当前选中的会话和正在问答的会话一致，显示列表
    if (setup.askTalkId === session.select) {
      chatList.value = messageArray
    }
    scrollY()
  })
  sse.onerror = (e) => {
    showToast({
      message: getHtml('连接错误,请联系管理员', 'colse'),
      type: 'html'
    })
    messageArray.push({ content: '', state: 'error' })
    isInputing.value = false
    isLoading.value = false
    sse.close()
    setTimeout(() => {
      scrollY()
    }, 200)
  };
}

function erroeReport() {
  reportParams.value.union_id = user.union_id
  errorReport(reportParams).then(res => {
    if (res.data.success) {
      showDialog({
        confirmButtonText: 'OK',
        message: '上报成功！\r请在10秒后刷新页面即可生效',
      }).then(() => {
        // on close
      });
    } else {
      showToast({
        message: getHtml('操作异常，请联系管理员', 'colse'),
        type: 'html'
      })
    }
  })
}
function switchSession(talk_id) {
  showSidebar.value = !showSidebar.value

  // getHistory(key)
  // 优化 
  // 切换session时，请求历史数据
  getHistoryByTalkId(talk_id)
}


// 提前查询线路管理--判断是否是管理员
const getPower = async () => {

  lineParams.value.code = user.code
  for (let i = 0; i < lineApiKey.length; i++) {
    lineParams.value.action = lineApiKey[i]
    await getSetkeyList(lineParams).then((res) => {
      isAdmin.value = res.data.success
      if (lineApiKey[i] === 'list' && res.data.data) {
        res.data.data.forEach(q => {
          lineData.value.push(q)
        });
      }
    });
  }
}

// 开启KEY
function changeLine(key) {
  openlineParams.value.code = user.code
  openlineParams.value.pkey = key
  updateSetkey(openlineParams).then(res => {
    if (res.status === 200) {
      lineData.value = []
      showSidebar.value = false
      showToast({
        message: getHtml('启动成功', 'passed'),
        type: 'html'
      })
      getPower()
    } else {
      showFailToast(res.data.errmsg)
    }
  })
}

const openSidebar = () => {
  showSidebar.value = true
  sessionList.value = sesslist.sessionList
}
const isFirstTime = ref(true)

onMounted(async () => {
  if (isFirstTime.value) {
    isFirstTime.value = false;
    showToast('Loading...')
  }
  user.getCode()
  await getUser()
  getPower()
})

</script>
<template>
  <div class="bg-#141516 w-100% h-100% relative overflow-hidden">

    <div class="w-100% h-7vh bg-#141516 flex items-center justify-between">
      <div i-material-symbols:dehaze class="bg-white pl-2 w-25px h-25px" @click="openSidebar()"></div>

      <div class="color-white flex text-center ">
        <img src="../assets/images/flagship.png" class="w-23px h-23px mr-5px" v-if="setup.version === 2" />
        <img src="../assets/images/ordinary.png" class="w-23px h-23px mr-5px" v-else />
        <span class="min-w-[10vw] max-w-[40vw] truncate ..."> {{ session.sessionName }}</span>
      </div>
      <div class="flex pr-2">
        <img src="../assets/images/purge.png" class="w-25px h-25px mt-3px " @click="clearMessage" />
        <div i-material-symbols:add-rounded class="bg-white w-33px h-33px ml-2" @click="createSession"> </div>
      </div>
    </div>
    <div class="h-80vh bg-#23262E overflow-auto" ref="messageRef">
      <!-- 聊天内容 -->
      <div v-for="(item, index) in chatList" class="text-start overflow-auto">
        <Question v-if="item.title" :msg="item.title" />
        <Answer v-if="item.content" :msg="item.content" :count="chatList.length" :index="(index + 1)" />
      </div>
    </div>

    <!-- 底部提问框 -->
    <div class="bg-#34373E h-13vh bottom-0 m-a flex items-center">
      <textarea class=" w-85vw h-30px items-center ml-5 text-sm rounded" :disabled="isInputing" placeholder="在此提问"
        rows="1" v-model="questionText"></textarea>
      <button class="bg-#0277F5 h-40px mx-3" @click="send" v-if="!isSending">
        <div i-carbon:send-alt-filled class="color-white"></div>
      </button>
      <button v-if="isSending" class="bg-#E60C00 h-40px mx-3" id="stopButton" @click="send">
        <div i-ph:prohibit-bold class="color-white"></div>
      </button>
    </div>
    <!-- 侧边栏 -->
    <Sidebar v-if="showSidebar" :line-data="lineData" :user-info="userInfo" :is-open="showSidebar" :isAdmin="isAdmin"
      :session-list="sessionList" @switchSession="switchSession" @edit="openEditModal" @close="deleteSess"
      @switchVersion="switchVersion" @report="erroeReport" @change="changeLine" />
    <div v-if="showSidebar" class="sidebar-overlay" @click="toggleSidebar" @change="changeLine"></div>
  </div>
  <van-dialog class="dialog-t" v-model:show="show" :confirm-button-text="confirmText" :title="title" @confirm="confirm"
    message-align="left" show-cancel-button>
    <input placeholder="请输入会话名称" class="my-5 rounded" v-model="sessionParams.talk_name" :maxlength="20" />
  </van-dialog>
</template>
<style>
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.van-dialog,
.van-button--default {
  background: #575D6A;

}

textarea {
  background-color: #23262E;
  border: none;
  color: #fff;
  height: 40px;
  line-height: 30px;
  padding: 13px 10px 0 10px;
  user-select: none;
  -webkit-user-drag: none;
}


input {
  width: 80%;
  background-color: #353942;
  border: none;
  padding: 10px;
  color: #fff;
}

.van-dialog__header {
  /* text-align: start; */
  color: var(--van-white);
  /* padding-left: 30px !important; */
  font-weight: normal;
}

.van-dialog__message--has-title,
.van-dialog__cancel,
.van-dialog__message {
  color: var(--van-white);
}

.dialog-t [class*=van-hairline]::after {
  border: none;
}

.van-toast {
  background: var(--van-white);
  color: var(--van-gray-8);
}

.van-toast__icon {
  font-size: 15px
}
</style>