<script setup lang="ts">
import useSupabaseAuth from '@/@layouts/composable/useSupabase'
import { useTheme } from 'vuetify'

const { global } = useTheme()
const supabaseAuth = useSupabaseAuth()

const authProviders = [
  {
    icon: 'fa-facebook',
    color: '#4267b2',
  },
  {
    icon: 'fa-google',
    color: '#dd4b39',
    function: () => supabaseAuth.signInWithGoogle(),
  },
  {
    icon: 'fa-twitter',
    color: '#1da1f2',
  },
]
</script>

<template>
  <div class="d-flex justify-center flex-wrap gap-3">
    <VProgressCircular
      v-if="supabaseAuth.isLoading.value === true"
      indeterminate
    />
    <VBtn
      v-else
      v-for="link in authProviders"
      :key="link.icon"
      icon
      variant="tonal"
      size="38"
      :color="global.name.value === 'dark' ? link.colorInDark : link.color"
      class="rounded"
      @click="link.function"
    >
      <VIcon size="18" :icon="link.icon" />
    </VBtn>
  </div>
</template>
