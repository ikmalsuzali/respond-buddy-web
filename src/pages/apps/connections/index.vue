<script setup lang="ts">
import ConnectionCards from '@/views/apps/connections/ConnectionCards.vue'
import ConnectionList from '@/views/apps/connections/ConnectionList.vue'
import { useConnectionStore } from '@/views/apps/connections/useConnectionStore'
import MemoryDialogFullscreen from '@/views/apps/memory/MemoryDialogFullscreen.vue'
const connectionStore = useConnectionStore()

const getIntegrations = async () => {
  await connectionStore.fetchIntegrations()
}

getIntegrations()
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12">
        <h4 class="text-h4 mb-6">Connections</h4>
        <p class="mb-0">
          Connections allows you to connect to different platforms.
        </p>
      </VCol>

      <!-- 👉 Roles Cards -->
      <VCol cols="12">
        <ConnectionCards />
      </VCol>

      <VCol cols="12">
        <!-- 👉 User List  -->
        <ConnectionList />
      </VCol>
    </VRow>
    <MemoryDialogFullscreen />
  </div>
</template>
