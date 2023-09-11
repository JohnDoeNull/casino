<template>
  <div class="p-8 bg-div-color rounded-xl">
    <h2 class="mb-3 text-xl font-bold leading-none">Chat</h2>
    <div
      ref="chatContainer"
      class="flex flex-col mb-3 px-0 py-1 space-y-3 bg-div-color rounded-3xl overflow-auto h-[50vh]"
    >
      <div v-for="(chatObj, idx) in chats" :key="chatObj" :index="idx">
        <chat-box :chatObj="chatObj"> </chat-box>
      </div>
    </div>
    <div class="flex flex-row space-x-1 items-left">
      <form @submit.prevent="sendText()">
        <t-input v-model="text" class=""></t-input>
      </form>

      <t-button variant="primary" @click="sendText" class="">
        <span class="flex-1">Send</span>
      </t-button>
    </div>
  </div>
</template>

<script>
import ChatBox from './chatbox.vue'
export default {
  components: { ChatBox },
  data() {
    return {
      chats: [],
      text: '',
    }
  },
  beforeMount() {
    this.socket = this.$nuxtSocket({
      channel: 'livechat',
      extraHeaders: {
        Authorization: this.$auth.strategy.token.get(),
      },
    })
    this.socket.emit('chat:status')
    this.socket.on('chat:status', (data) => {
      this.chats = data.chats
      this.scrollToLast()
    })
  },
  mounted() {
    const repeat = setInterval(() => {
      if (this.$refs.chatContainer.lastElementChild) {
        this.scrollToLast()
        clearInterval(repeat)
      }
    }, 500)
  },
  methods: {
    sendText() {
      if (!this.$auth.loggedIn) {
        return this.$modal.show('auth')
      }
      this.socket.emit('chat:send', { text: this.text }, (data) => {
        this.$notify(
          {
            group: 'default',
            type: data.status,
            text: data.message,
          },
          4000
        )
      })
    },
    CharOnly(evt) {
      const charCode = evt.which ? evt.which : evt.keyCode
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault()
      } else {
        return true
      }
    },
    scrollToLast() {
      const lastChildElement = this.$refs.chatContainer.lastElementChild
      lastChildElement?.scrollIntoView({
        behavior: 'smooth',
      })
    },
  },
}
</script>
