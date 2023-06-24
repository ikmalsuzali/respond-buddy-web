<script setup lang="ts">
import avatar1 from '@images/avatars/avatar-1.png'
import avatar10 from '@images/avatars/avatar-10.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'
import avatar6 from '@images/avatars/avatar-6.png'
import avatar7 from '@images/avatars/avatar-7.png'
import avatar8 from '@images/avatars/avatar-8.png'
import avatar9 from '@images/avatars/avatar-9.png'
import girlUsingMobile from '@images/pages/girl-using-mobile.png'
import slack from '@images/icons/brands/slack.png'
import discord from '@images/icons/brands/discord.png'
import MemoryDialogFullscreen from '@/views/apps/memory/MemoryDialogFullscreen.vue'

interface Props {
  memories: any[]
}

interface Emit {
  (e: 'memoryClick', value: any): void
}

const props = withDefaults(defineProps<Props>(), {
  memories: [],
})

const emit = defineEmits<Emit>()
const isDialogVisible = ref(false)

</script>

<template>
  <VRow>
    <!-- 👉 Roles -->
    <VCol
      v-for="(memory, key) in memories"
      :key="key"
      cols="12"
      sm="6"
      lg="2"
    >
    <VCard @click="isDialogVisible = true">
        <VCardText>
          <VAvatar
            rounded
            size="42"
            :image="memory.icon"
          >
          </VAvatar>

          <h5 class="text-h5 mt-4">
            {{ memory.name }}
          </h5>
          <p class="text-sm text-disabled my-1 mb-0">
            {{ '2 connections' }}
          </p>
          <p class="mb-3">
            {{ 'Total Messages' }}
          </p>
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
  <MemoryDialogFullscreen
    v-model:is-dialog-visible="isDialogVisible"
  />

</template>
