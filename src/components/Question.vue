<script setup>
import { ref } from 'vue';
const props = defineProps({
  msg: String
})
</script>
<template>
  <div class="color-white leading-24px px-6 py-5 text-sm">{{ msg }}</div>
</template>