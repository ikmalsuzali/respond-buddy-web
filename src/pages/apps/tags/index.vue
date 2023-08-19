<script setup lang="ts">
import CrudModal from '../../../views/apps/tags/CrudModal.vue'
import TagList from '../../../views/apps/tags/TagList.vue'

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
        <p class="text-h2 font-weight-thin">Templates</p>
        <p class="mb-0">
          Tags give immediate insight into what your content is all about.
          Whether you're sorting through articles, photos, or videos, these tags
          ensure you instantly understand the essence of each item. Dive
          straight into what matters and save precious time.
        </p>
      </VCol>

      <VCol cols="12">
        <!-- 👉 Tag List  -->
        <TagList />
      </VCol>
    </VRow>
    <CrudModal :is-dialog-visible="true" />
  </div>
</template>
