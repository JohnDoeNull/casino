<template>
  <section class="container coinflip">
    <h1 class="flex items-center mb-6 text-2xl font-black uppercase">
      <span class="flex-1">COINFLIP</span>
      <t-button variant="white" @click="showModel(true)">
        <span class="flex-1">Create Game</span>
      </t-button>
    </h1>
    <div
      v-for="(bet_child, idx) in bets"
      :key="bet_child.game.status"
      :index="idx"
      class="grid grid-cols-1 gap-4 xl:gap-6 xl:grid-cols-4 overflow-auto"
    >
      <bet-model :bet_prop="bet_child" :socket="socket"> </bet-model>
    </div>
    <div class="modal-overlay" v-show="ShowJoin" @click="showModel(false)">
      <div class="modal" @click.stop>
        <h6>COINFLIP</h6>
        <div class="col-span-8 p-12 bg-div-color lg:col-span-3 rounded-xl">
          <label class="mb-3 font-semibold text-md" for="amount">{{
            $t('bet-amount')
          }}</label>
          <div class="mb-3 relative">
            <t-input
              id="amount"
              v-model="bet.amount"
              v-on:keypress="NumbersOnly"
            ></t-input>
          </div>
          <div class="mb-3 space-x-2 flex items-center">
            <t-button
              type="button"
              variant="outline"
              class="bg-gray-100 border-none w-100"
              v-on:click="
                coin_side = 0
                bet.coin_side = 0
              "
              v-bind:style="{
                backgroundColor:
                  coin_side == 0 ? 'rgba(255, 178, 0, 1)' : 'rgb(243 244 246)',
              }"
              >Head</t-button
            >
            <t-button
              type="button"
              variant="outline"
              class="bg-gray-100 border-none w-100"
              v-on:click="
                coin_side = 1
                bet.coin_side = 1
              "
              v-bind:style="{
                backgroundColor:
                  coin_side == 1 ? 'rgba(255, 178, 0, 1)' : 'rgb(243 244 246)',
              }"
              >Tails</t-button
            >
          </div>
          <t-button
            type="submit"
            class="!py-4"
            variant="primary"
            @click="betPlace"
            >Deal for {{ bet.amount }}$</t-button
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import betModel from '~/components/games/coinflip/bet-model.vue'

export default {
  components: { betModel },
  data() {
    return {
      bets: [],
      bet: { coin_side: 0 },
      socket: null,
      ShowJoin: false,
      coin_side: 0,
    }
  },
  computed: {
    ...mapState({
      rate: (state) => state.crash.rate,
    }),
    ...mapGetters({
      bets: 'crash/bets',
    }),
    userBet() {
      if (!this.$auth.loggedIn) return false
      return this.bets.find(
        (bet) => bet.user.id === this.$auth.user.id && bet.status === 'await'
      )
    },
    btnText() {
      if (this.userBet && this.rate === 1) {
        return this.$t('await-start')
      }
      return this.userBet && this.rate > 1
        ? this.$t('withdraw-on') + ` (x${this.rate})`
        : this.$t('make-bet')
    },
  },
  watch: {
    'bet.amount'(val) {
      if (val < 0) {
        this.bet.amount = 0
      } else if (this.$auth.loggedIn && val > this.$auth.user?.balance) {
        this.bet.amount = this.$auth.user.balance
      }
    },
  },
  beforeMount() {
    this.socket = this.$nuxtSocket({
      channel: 'coinflip',
      extraHeaders: {
        Authorization: this.$auth.strategy.token.get(),
      },
    })
    this.socket.emit('game:status')
    this.socket.on('game:status', (data) => {
      console.log(data.games)
      this.bets = data.games
    })
    this.socket.on('game:done', (data) => {
      if (this.$auth.user.id === data.winner) {
        this.$notify(
          {
            group: 'default',
            type: 'success',
            text: 'You won +' + data.amount + '$',
          },
          4000
        )
        this.$auth.fetchUser()
      } else if (this.$auth.user.id === data.loser) {
        this.$notify(
          {
            group: 'default',
            type: 'error',
            text: 'You lost!',
          },
          4000
        )
        this.$auth.fetchUser()
      }
    })
  },
  methods: {
    betPlace() {
      if (!this.$auth.loggedIn) {
        return this.$modal.show('auth')
      }
      if (this.$auth.user.balance === 0) {
        this.$notify(
          {
            group: 'default',
            type: 'error',
            text: 'Недостаточно средств',
          },
          4000
        )
      }
      this.socket.emit('game:make', this.bet, async (data) => {
        this.$notify(
          {
            group: 'default',
            type: data.status,
            text: data.message,
          },
          4000
        )
        if (data.status === 'success') {
          this.showModel(false)
          await this.$auth.fetchUser()
        }
      })
    },
    showModel(status) {
      this.ShowJoin = status
    },
    NumbersOnly(evt) {
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
  },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
}

.modal {
  text-align: center;
  background-color: #21264a;
  height: 250px;
  width: 500px;
  margin-top: 10%;
  padding: 60px 0;
  border-radius: 20px;
}
.close {
  margin: 10% 0 0 16px;
  cursor: pointer;
}

.close-img {
  width: 25px;
}

.check {
  width: 150px;
}

h6 {
  font-weight: 500;
  font-size: 28px;
  margin: 0px 0;
}

p {
  font-size: 16px;
  margin: 20px 0;
}
</style>
