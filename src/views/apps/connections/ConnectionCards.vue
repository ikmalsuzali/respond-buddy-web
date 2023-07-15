<script setup lang="ts">
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import { useConnectionStore } from './useConnectionStore'

const connectionStore = useConnectionStore()

// const onCardClick = (memory: any) => {
//   memoryStore.setMemoryDialogOpen(true)
//   memoryStore.setSelectedMemoryType(memory)
// }
</script>

<template>
  <VRow v-if="connectionStore.isIntegrationsLoading">
    <VCol v-for="() in 6">
      <VSkeletonLoader
        class="mx-auto border"
        type="avatar, text, subtitle, list-item-two-line	"
      ></VSkeletonLoader>
    </VCol>
  </VRow>
  <VRow v-else>
    <!-- 👉 Roles -->
    <VCol
      v-for="(memory, key) in connectionStore.integrations"
      :key="key"
      cols="12"
      sm="6"
      lg="2"
    >
      <VCard @click="onCardClick(memory)">
        <VCardText>
          <VAvatar rounded size="42" :image="memory.icon"> </VAvatar>

          <h5 class="text-h5 mt-4">
            {{ memory.name }}
          </h5>
          <!-- <p class="text-sm text-disabled my-1 mb-0">
            {{ '2 connections' }}
          </p>
          <p class="mb-3">
            {{ 'Total Messages' }}
          </p> -->
          <!-- <VChip
            color="disabled"
            label
          >
            {{ demo?.change }}
          </VChip> -->
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
