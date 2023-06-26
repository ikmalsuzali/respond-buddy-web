<script setup lang="ts">
import MemoryCards from '@/views/apps/memory/MemoryCards.vue';
import MemoryList from '@/views/apps/memory/MemoryList.vue';

import axios from '@axios';

const isLoading = ref(false)
const storeTypes = ref([])

const getStores = () => {
  isLoading.value = true
  axios.get('/v1/store-type')
    .then(res => {
      console.log("🚀 ~ file: index.vue:61 ~ getStores ~ res", res)
      const { data } = res.data
      storeTypes.value = data
      isLoading.value = false
    })
    .catch(e => {
      const error = e?.response?.data || {}
    }).finally(() => {
      isLoading.value = false
    })
}

getStores()
</script>

<template>
  <VRow>
    <VCol cols="12">
      <h4 class="text-h4 mb-6">
        Memory
      </h4>
      <p class="mb-0">
        Memory allows you to store and retrieve data just like your brain. 
      </p>
    </VCol>

    <!-- 👉 Roles Cards -->
    <VCol cols="12">
      <MemoryCards :memories="storeTypes" />
    </VCol>

    <VCol cols="12">
      <!-- 👉 User List  -->
      <MemoryList />
    </VCol>
  </VRow>
</template>
