<script lang="ts" setup>
import { useSnackbarStore } from '@/views/apps/snackbar/useSnackbarStore'
const snackbarStore = useSnackbarStore()
</script>

<template>
  <!-- Snackbar -->
  <VSnackbar v-model="snackbarStore.isSnackbarActive">
    {{ snackbarStore.title }}
    <template #actions>
      <VBtn
        v-if="snackbarStore?.action?.text"
        :color="snackbarStore.type"
        @click="snackbarStore.action?.handler"
      >
        Close
      </VBtn>
    </template>
  </VSnackbar>
</template>
