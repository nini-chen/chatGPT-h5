<script setup>
import { ref, watch, nextTick } from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // 引入高亮样式


const props = defineProps({
  msg: String,
  index: Number,
  count: Number,
})
const contentRef = ref();
const markData = ref('')
watch(
  () => props.msg,
  (newX) => {
    nextTick(() => {
      init(newX)
    })
  },
  { immediate: true }
)

const init = (data) => {
  markData.value = marked.parse(data);
  // 获取dom节点
  const wrapper = document.querySelector('#sse' + props.index)
  wrapper.innerHTML = markData.value;
  nextTick(() => {
    hljs.highlightAll()
    copyDom()
  })
}

const copyDom = () => {
  const articleContent = contentRef
  // 遍历内容节点
  articleContent.value.childNodes.forEach((e, index) => {
    // 每个代码块标签添加复制按钮
    if (e.nodeName === 'PRE') {
      const copyButton = document.createElement('span')
      copyButton.setAttribute('class', 'btn-pre-copy')
      copyButton.innerHTML = `<div i-material-symbols-light:content-copy-outline-rounded class="w-25px h-20px"></div>`
      copyButton.onclick = () => {
        const copyData = e.firstChild.innerText
        copyToClipboard(copyData)
        copyButton.innerHTML = '复制成功'
        setTimeout(() => {
          copyButton.innerHTML = `<div i-material-symbols-light:content-copy-outline-rounded class="w-25px h-20px"></div>`
        }, 1000)
      }
      // 将节点加入pre标签下
      e.appendChild(copyButton)
      e.style.position = 'relative';
    }
  })
}

// 复制到剪贴板
const copyToClipboard = (content) => {
  if (window.clipboardData) {
    window.clipboardData.setData('text', content)
  } else {
    ; (content => {
      document.oncopy = e => {
        e.clipboardData.setData('text', content)
        e.preventDefault()
        document.oncopy = null
      }
    })(content)
    document.execCommand('Copy')
  }
}


</script>
<template>
  <div class="relative">
    <div class="color-white leading-24px px-6 py-5 bg-#353942 text-sm" :id="'sse' + props.index" ref="contentRef">{{ msg
    }}
    </div>
    <div :class="props.index === count && 'bg-[#1AFF5E] z-99 absolute w-[3px] h-[100%] z-99 left-0 bottom-0'">
    </div>
    <div
      :class="props.index === count && 'w-[4.5%] bg-gradient-to-r from-[#1aff5e40] absolute h-[100%] z-99 left-0 bottom-0'">
    </div>
  </div>
</template>

<style >
.btn-pre-copy {
  position: absolute;
  right: 0;
  top: 0;
  color: #eee;
  padding: 5px;
  cursor: pointer;
}
</style>