<script setup lang="ts">
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import miscMaskDark from '@images/pages/misc-mask-dark.png'
import miscMaskLight from '@images/pages/misc-mask-light.png'

const authThemeMask = useGenerateImageVariant(miscMaskLight, miscMaskDark)
</script>

<template>
  <div class="misc-wrapper">
    <div class="text-center mb-12">
      <!-- 👉 Title and subtitle -->
      <h1 class="text-h1 font-weight-medium mb-3">Payment Processing 🚧</h1>
      <p>Please wait until payment has been processed</p>
    </div>

    <!-- 👉 Image -->

    <VImg :src="authThemeMask" class="misc-footer-img d-none d-md-block" />
  </div>
</template>

<style lang="scss">
@use '@core/scss/template/pages/misc.scss';
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
