<template>
  <section class="container">
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
      <!-- <card-game disabled name="PvP"></card-game>
      <card-game disabled name="Wheel" class="lg:row-span-2" />
      <card-game disabled name="Dice"></card-game> -->
    </div>
  </section>
</template>

<script>
import cardGame from '~/components/card/card-game.vue'
export default {
  components: { cardGame },
}
</script>

<style></style>
