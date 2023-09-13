<template>
  <section class="container">
    <div class="flex flex-wrap h-16 space-x-3 md:space-x-8">
      <div class="col-span-3 space-y-3 mb-5 w-[20vw] ml-auto">
        <chat></chat>
      </div>
      <div class="flex-1 mr-auto">
        <div class="col-span-3 space-y-3 mb-5">
          <div class="p-8 bg-div-color rounded-xl">
            <h2 class="mb-3 text-xl font-bold leading-none">
              Gamble R$ -
              <a
                href="https://discord.gg/fiery"
                class="border-black border-dotted cursor-pointer border-b-1 font-semibold text-primary"
                target="_blank"
              >
                <a class="font-semibold text-primary">Discord</a>
              </a>
            </h2>
          </div>
        </div>
        <coin-flip></coin-flip>
      </div>
    </div>

    <!-- <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <card-game
        name="CoinFlip"
        :to="{ name: 'games-coinflip' }"
        class="lg:col-span-2"
      ></card-game>
      <card-game
        name="Crash"
        :to="{ name: 'games-crash' }"
        class="lg:col-span-2"
      ></card-game>
      <card-game disabled name="PvP"></card-game>
      <card-game disabled name="Wheel" class="lg:row-span-2" />
      <card-game disabled name="Dice"></card-game>
    </div> -->
  </section>
</template>

<script>
import CoinFlip from './games/coinflip.vue'
import Chat from '~/components/chat/chat.vue'

// import cardGame from '~/components/card/card-game.vue'

export default {
  components: { CoinFlip, Chat },
}
</script>
<style></style>
