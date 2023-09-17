<template>
  <main class="layout">
    <app-header class="layout__header" />
    <Nuxt class="layout__body" />
    <app-footer />
    <modal-register />
    <modal-auth />
    <modal-wallet />
    <app-notification />
  </main>
</template>

<script>
import appHeader from '@/components/section/app-header.vue'
import AppFooter from '~/components/section/app-footer.vue'
import ModalRegister from '~/components/modal/modal-register.vue'
import ModalAuth from '~/components/modal/modal-auth.vue'
import AppNotification from '~/components/ui/app-notification.vue'
import modalWallet from '~/components/modal/modal-wallet.vue'
export default {
  components: {
    appHeader,
    AppFooter,
    ModalRegister,
    ModalAuth,
    AppNotification,
    modalWallet,
  },
}
</script>

<style lang="scss">
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__body {
    flex: 1;
    @apply py-6;
  }
}
</style>
