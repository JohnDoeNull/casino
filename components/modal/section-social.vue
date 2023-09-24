<template>
  <div class="p-4 font-semibold text-center bg-div-color rounded-xl text-md">
    <div class="mb-2">betbux.gg</div>
    <div class="flex items-center justify-center">
      <img src="/logo.svg" fill="#fff" class="inline-block w-20 h-auto" />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
}
</script>

<style lang="scss">
.social {
  padding: 0.25rem 1rem;
  border-radius: 9999px;
  transition: all 0.3s;
  &--fb {
    & svg {
      fill: #3b5999;
    }

    &:hover svg {
      fill: #2c4782;
    }
  }
  &--vk {
    background: #4d76a1;

    &:hover {
      background: #3f668f;
    }
  }
  &--g {
    & svg {
      fill: #f9f8f6;
    }

    &:hover svg {
      fill: #e6e4df;
    }
  }
}
</style>
