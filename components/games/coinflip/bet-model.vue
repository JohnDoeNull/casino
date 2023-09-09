<template>
  <div
    class="flex flex-col items-center px-6 py-12 space-y-5 text-center bg-div-color rounded-3xl"
  >
    <img
      v-if="game.game.status == 'await'"
      src="/img/icon/clock.svg"
      alt="Часы работы"
    />
    <img
      v-if="game.game.status == 'rolling'"
      :style="{ width: '100px' }"
      src="/img/icon/loading.svg"
      alt="Часы работы"
    />
    <img
      v-if="game.game.status == 'done'"
      :style="{ width: '100px' }"
      src="/img/icon/check.svg"
      alt="Часы работы"
    />

    <h2 class="text-lg font-semibold">{{ game.bets[0].amount }}$</h2>
    <hr class="divider" />
    <div class="flex flex-row items-center space-x-7">
      <div class="flex flex-col items-center">
        <img
          :src="game.bets[0].user.avatar"
          alt=""
          class="w-10 h-10 rounded-full"
        />
      </div>
      <div class="flex flex-col items-center">
        <div class="flex flex-col items-center">
          <strong>COINFLIP</strong>
        </div>
        <div class="flex flex-col items-center">
          <a>{{ game.bets.length }}/2</a>
        </div>
      </div>
      <div class="flex flex-col items-center">
        <img v-if="!game.bets[1]" src="/img/icon/clock.svg" alt="" />
        <img
          class="w-10 h-10 rounded-full"
          v-if="game.bets[1]"
          :src="game.bets[1].user.avatar"
          alt=""
        />
      </div>
    </div>
    <t-button
      :disabled="game.game.status != 'await'"
      @click="showModel(true)"
      type="submit"
      class="!py-4 w-5/6"
      variant="primary"
    >
      Join for {{ game.bets[0].amount }}$
    </t-button>
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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ShowJoin: false,
      game: {},
    }
  },
  props: {
    socket: {
      type: Object,
      required: true,
    },
    bet_prop: {
      type: Object,
      required: true,
    },
  },
  beforeMount() {
    console.log('cac')
    this.game = this.bet_prop

    this.socket.on('game:status', (data) => {
      this.game = this.bet_prop
    })
  },
  methods: {
    joinGame() {
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
      this.socket.emit('game:join', this.game, async (data) => {
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
      if (charCode > 0) {
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
