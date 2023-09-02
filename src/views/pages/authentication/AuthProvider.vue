<script setup lang="ts">
import useSupabaseAuth from '@/@layouts/composable/useSupabase'
import { useTheme } from 'vuetify'

const { global } = useTheme()
const supabaseAuth = useSupabaseAuth()

const authProviders = [
  // {
  //   icon: 'fa-facebook',
  //   color: '#4267b2',
  //   function: () => supabaseAuth.signInWithOAuth('facebook'),
  // },
  {
    icon: 'fa-google',
    name: 'Google',
    color: '#dd4b39',
    function: () => supabaseAuth.signInWithOAuth('google'),
  },
  {
    icon: 'fa-twitter',
    name: 'Twitter',
    color: '#1da1f2',
    function: () => supabaseAuth.signInWithOAuth('twitter'),
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
      variant="tonal"
      :color="global.name.value === 'dark' ? link.colorInDark : link.color"
      class="rounded"
      @click="link.function"
    >
      <VIcon size="18" :icon="link.icon" />
      <div class="pl-2">Sign in with {{ link.name }}</div>
    </VBtn>
  </div>
</template>
