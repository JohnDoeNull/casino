<template>
  <t-modal :click-to-close="false" name="wallet">
    <template slot="close">
      <svg class="w-full h-full">
        <use xlink:href="/img/icon/free/sprite.svg#close"></use>
      </svg>
    </template>
    <template #header>
      <h3>Wallet</h3>
    </template>
    <section-social class="mb-5" />
    <div class="grid grid-cols-1 gap-5">
      <div class="col-span-8 p-12 bg-div-color lg:col-span-3 rounded-xl">
        <label class="mb-3 font-semibold text-md" for="amount">{{
          $t('bet-amount')
        }}</label>
        <div class="mb-3 relative">
          <t-input
            id="amount"
            v-model="game.bets[0].amount"
            v-on:keypress="NumbersOnly"
          ></t-input>
        </div>
        <div class="mb-3 space-x-2 flex items-center">
          <t-button
            type="button"
            variant="outline"
            class="bg-gray-100 border-none w-100"
            :style="{
              backgroundColor:
                game.bets[0].coin_side == 1
                  ? 'rgba(255, 178, 0, 1)'
                  : 'rgb(243 244 246)',
            }"
            >Head</t-button
          >
          <t-button
            type="button"
            variant="outline"
            class="bg-gray-100 border-none w-100"
            :style="{
              backgroundColor:
                game.bets[0].coin_side == 0
                  ? 'rgba(255, 178, 0, 1)'
                  : 'rgb(243 244 246)',
            }"
            >Tails</t-button
          >
        </div>
        <t-button
          type="submit"
          class="!py-4"
          variant="primary"
          @click="joinGame"
          >Deal for {{ game.bets[0].amount }}$</t-button
        >
      </div>
    </div>
  </t-modal>
</template>

<script>
import sectionSocial from './section-social.vue'
export default {
  components: { sectionSocial },
  data() {
    return {
      user: {
        email: '',
        password: '',
      },
    }
  },
  mounted() {},
  methods: {
    showPayment() {
      console.log(this.$auth.user)
    },
  },
}
</script>

<style>
input {
  background-color: #21264a;
}
</style>
