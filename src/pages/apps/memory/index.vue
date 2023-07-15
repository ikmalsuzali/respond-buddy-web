<script setup lang="ts">
import MemoryCards from '@/views/apps/memory/MemoryCards.vue'
import MemoryDialogFullscreen from '@/views/apps/memory/MemoryDialogFullscreen.vue'
import MemoryList from '@/views/apps/memory/MemoryList.vue'
import { useMemoryStore } from '@/views/apps/memory/useMemoryStore'
import axios from '@axios'

const isStoreTypesLoading = ref(false)
const isStoreLoading = ref(false)
const storeTypes = ref([])
const memoryStore = useMemoryStore()

const getStoreTypes = () => {
  isStoreTypesLoading.value = true
  axios
    .get('/v1/store-type')
    .then((res) => {
      console.log('🚀 ~ file: index.vue:61 ~ getStores ~ res', res)
      const { data } = res.data
      storeTypes.value = data
      isStoreTypesLoading.value = false
    })
    .catch((e) => {
      const error = e?.response?.data || {}
    })
    .finally(() => {
      isStoreTypesLoading.value = false
    })
}

getStoreTypes()
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12">
        <h4 class="text-h4 mb-6">Memory</h4>
        <p class="mb-0">
          Memory allows you to store and retrieve data just like your brain.
        </p>
      </VCol>

      <!-- 👉 Roles Cards -->
      <VCol cols="12">
        <MemoryCards :is-loading="isStoreTypesLoading" :memories="storeTypes" />
      </VCol>

      <VCol cols="12">
        <!-- 👉 User List  -->
        <MemoryList />
      </VCol>
    </VRow>
    <MemoryDialogFullscreen />
  </div>
</template>
