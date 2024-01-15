import {
  defineStore
} from 'pinia'
import {
  ref
} from 'vue'

export const userStore = defineStore('user', () => {
  const code = ref('')
  const union_id = ref('')
  const getCode = () => {
    const urlParams = new URLSearchParams(window.location.search)
    // const code = urlParams.get('code')
    code.value = urlParams.get('code')
  }
  const getUnionId = (key) => {
    union_id.value = key
  }
  return {
    code,
    getCode,
    union_id,
    getUnionId
  }
})

export const sessionStore = defineStore('session', () => {
  const select = ref('')
  const sessionName = ref('')
  const switchSess = (session) => {
    select.value = session.talk_id
    sessionName.value = session.talk_name
  }
  return {
    select,
    sessionName,
    switchSess
  }
})

export const setupStore = defineStore(
  'setupStore',
  () => {
    const version = ref(1)
    const continuity = ref(true)
    const code = ref(false)
    const message = ref([])
    const contentList = ref([])
    const askTalkId = ref(null)
    const setContentList = (arr) => {
      contentList.value.push(arr)
    }
    const setAskTalkId = (id) => {
      askTalkId.value = id
    }
    const setMessage = (arr) => {
      message.value.push(arr)
    }
    const clearContentList = () => {
      contentList.value = []
    }
    const clear = (ssid) => {
      let index = message.value.findIndex(v => v.talk_id === ssid);
      message.value.splice(index, 1);
      //  let cIndex = contentList.value.findIndex(v => v.talk_id === ssid);
      //  contentList.value.splice(cIndex, 1);

    }
    const switchV = (key) => {
      version.value = key
    }
    const setCode = (key) => {
      code.value = key
    }
    const switchC = (key) => {
      continuity.value = key
    }
    return {
      continuity,
      version,
      switchV,
      switchC,
      setCode,
      code,
      setMessage,
      message,
      clear,
      contentList,
      setContentList,
      askTalkId,
      setAskTalkId,
      clearContentList
    }
  },
)
// export const useWindowkeyStore = defineStore(
//   'windowStore',
//   () => {
//     const select = ref('1')
//     const switchTab = (index) => {
//       select.value = index
//     }
//     return {
//       select,
//       switchTab,
//     }
//   }, {
//     persist: true,
//   },
// )
// export const useUnionId = defineStore(
//   'union_id',
//   () => {
//     const union_id = ref(null)
//     const switchUnionId = (key) => {
//       union_id.value = key
//     }
//     return {
//       union_id,
//       switchUnionId
//     }
//   }, {
//     persist: true,
//   },
// )
export const sessionListStore = defineStore(
  'sessionList',
  () => {
    const sessionList = ref([{
      key: 1,
      name: '默认会话1'
    }])
    const creatSeeion = (obj) => {
      sessionList.value.push(obj)
    }
    return {
      sessionList,
      creatSeeion
    }
  }, {
    persist: true,
  },
)