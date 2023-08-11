<script setup lang="ts">
// import MemoryList from '@/views/apps/memory/MemoryList.vue'
// import { useMemoryStore } from '@/views/apps/memory/useMemoryStore'

// const isStoreTypesLoading = ref(false)
// const isStoreLoading = ref(false)
// const storeTypes = ref([])
// const memoryStore = useMemoryStore()
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12">
        <h4 class="text-h4 mb-6">Context tags</h4>
        <p class="mb-0">
          Memory allows you to store and retrieve data just like your brain.
        </p>
      </VCol>

      <VCol cols="12">
        <!-- 👉 User List  -->
        <MemoryList />
      </VCol>
    </VRow>
  </div>
</template>
