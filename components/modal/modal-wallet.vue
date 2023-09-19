h-
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
    <div class="col-span-8 bg-div-color lg:col-span-3 rounded-xl">
      <div v-if="option == 1" class="flex-row items-left mb-5">
        <label class="mb-3 font-semibold text-md" for="amount">{{
          $t('Deposit addy')
        }}</label>
        <div>
          <a>
            <strong>ETH: </strong>
            {{ user.ethaddress }}
          </a>
        </div>
        <div>
          <a>
            <strong>BTC: </strong>
            {{ user.btcaddress }}
          </a>
        </div>
        <div>
          <a>
            <strong>LTC: </strong>
            {{ user.ltcaddress }}
          </a>
        </div>
        <!-- <div>
          <a>
            <strong>LTCT: </strong>
            {{ user.ltctaddress }}</a
          >
        </div> -->
        <t-button
          type="submit"
          class="!py-4 mt-2"
          variant="primary"
          @click="refresh()"
          >Refresh</t-button
        >
      </div>

      <div v-if="option == 0" class="flex-row items-left mb-3">
        <label class="mb-3 font-semibold text-md" for="amount">{{
          $t('Enter your addy')
        }}</label>
        <div class="mb-3 relative">
          <t-input id="amount" v-model="withdraw.addy"></t-input>
          <div
            class="absolute top-1/2 right-3 transform -translate-y-1/2 space-x-2 flex items-center"
          >
            <t-button
              type="button"
              variant="outline"
              class="bg-gray-100 border-none w-10"
              @click="withdraw.currency = 'BTC'"
              :style="{
                backgroundColor:
                  withdraw.currency == 'BTC'
                    ? 'rgba(255, 178, 0, 1)'
                    : 'rgb(243 244 246)',
              }"
              >BTC</t-button
            >
            <t-button
              type="button"
              variant="outline"
              class="bg-gray-100 border-none w-10"
              @click="withdraw.currency = 'ETH'"
              :style="{
                backgroundColor:
                  withdraw.currency == 'ETH'
                    ? 'rgba(255, 178, 0, 1)'
                    : 'rgb(243 244 246)',
              }"
              >ETH</t-button
            >

            <t-button
              type="button"
              variant="outline"
              class="bg-gray-100 border-none w-10"
              @click="withdraw.currency = 'LTC'"
              :style="{
                backgroundColor:
                  withdraw.currency == 'LTC'
                    ? 'rgba(255, 178, 0, 1)'
                    : 'rgb(243 244 246)',
              }"
              >LTC</t-button
            >
          </div>
        </div>
        <label class="mb-3 font-semibold text-md" for="amount">{{
          $t('Enter amount')
        }}</label>
        <div class="mb-3 relative">
          <t-input id="amount" v-model="withdraw.amount"></t-input>
        </div>
        <t-button
          type="submit"
          class="!py-4"
          variant="primary"
          @click.stop="withdraw_proceed()"
          >Proceed</t-button
        >
      </div>
      <div class="mb-3 space-x-2 flex items-center">
        <t-button
          type="button"
          variant="outline"
          @click="option = 1"
          class="bg-gray-100 border-none w-100"
          :style="{
            backgroundColor:
              option == 1 ? 'rgba(255, 178, 0, 1)' : 'rgb(243 244 246)',
          }"
          >Deposit</t-button
        >
        <t-button
          type="button"
          variant="outline"
          @click="option = 0"
          class="bg-gray-100 border-none w-100"
          :style="{
            backgroundColor:
              option == 0 ? 'rgba(255, 178, 0, 1)' : 'rgb(243 244 246)',
          }"
          >Withdraw</t-button
        >
      </div>
    </div>
  </t-modal>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      user: {
        ltctadderss: '',
        btcadderss: '',
        ethadderss: '',
        ltcadderss: '',
      },
      option: 1,
      withdraw: {
        addy: '',
        currency: 'LTC',
        amount: null,
      },
    }
  },
  beforeMount() {
    this.$auth.fetchUser()
    this.user = this.$auth.user ? this.$auth.user : this.user
  },
  methods: {
    withdraw_proceed() {
      this.$axios
        .post('/api/v1/withdraw', {
          addy: this.withdraw.addy,
          currency: this.withdraw.currency,
          amount: this.withdraw.amount,
        })
        .finally(() => {
          this.$auth.fetchUser()
        })
    },
    showPayment() {
      console.log(this.$auth.user)
    },
    refresh() {
      this.$auth.fetchUser()
      this.user = this.$auth.user
    },
    NumbersOnly(evt) {
      const charCode = evt.which ? evt.which : evt.keyCode
      if (charCode > 0) {
        evt.preventDefault()
      } else {
        return true
      }
    },
  },
}
</script>

<style>
input {
  background-color: #21264a;
}
</style>
