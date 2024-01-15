<script setup>
import { onMounted } from 'vue';
import * as dd from 'dingtalk-jsapi';
import { message } from 'ant-design-vue';
import {
  showToast
} from 'vant';
onMounted(() => {
  showToast();
  if (dd) {

    dd.biz.navigation.setTitle({
      title: '智能工作助手', //控制标题文本，空字符串表示显示默认文本
      onFail: function(err) { }
    });
    message.config({
      top: `400px`,
      duration: 2,
      maxCount: 3,
    });
  }
})
</script>

<template>
  <div>
    <Suspense>
      <router-view></router-view>
    </Suspense>
  </div>
</template>


