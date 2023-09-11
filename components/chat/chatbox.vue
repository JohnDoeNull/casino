<template>
  <div class="flex flex-row items-left space-x-2">
    <div class="flex flex-col items-center">
      <img :src="user.avatar" alt="" class="w-10 h-10 rounded-full" />
    </div>
    <div class="flex flex-col items-left">
      <div class="flex flex-col items-left">
        <strong>{{ user.username }}</strong>
      </div>
      <div class="flex flex-row items-left">
        <a>{{ text }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: this.chatObj.user,
      text: this.chatObj.text,
    }
  },
  props: {
    chatObj: {
      type: Object,
      required: true,
    },
  },
}
</script>
