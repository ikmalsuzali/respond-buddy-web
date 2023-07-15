<script lang="ts" setup>
import { useMemoryStore } from '@/views/apps/memory/useMemoryStore'
// interface Props {
//   websites: []
// }

// const props = defineProps<Props>()
const memoryStore = useMemoryStore()
const input = ref('')

const moreList = [
  // { title: 'Deselect all', value: 'deselect_all' },
  // { title: 'Select all', value: 'select_all' },
  { title: 'Remove all', value: 'clear_all' },
]

const getFileSize = (byteSize: number) => {
  // Check if the File API is supported
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var fileSize = byteSize // File size in bytes

    // Convert bytes to kilobytes (KB)
    var fileSizeKB = fileSize / 1024

    // Convert kilobytes to megabytes (MB)
    var fileSizeMB = fileSizeKB / 1024

    // Convert megabytes to gigabytes (GB)
    var fileSizeGB = fileSizeMB / 1024

    // Return the file size in the appropriate unit
    if (fileSizeGB >= 1) {
      return fileSizeGB.toFixed(2) + ' GB'
    } else if (fileSizeMB >= 1) {
      return fileSizeMB.toFixed(2) + ' MB'
    } else {
      return fileSizeKB.toFixed(2) + ' KB'
    }
  } else {
    // File API not supported
    return 'File API not supported in this browser.'
  }
}
</script>

<template>
  <VCard title="Type in a website">
    <template #append>
      <div class="me-n2">
        <MoreBtn :menu-list="moreList" />
      </div>
    </template>
    <template #subtitle> </template>

    <VCardText>
      <div class="d-flex">
        <VTextField class="mb-5" v-model="input" hide-details clearable dense />
        <VBtn class="ml-3" @click="memoryStore.addWebsite({ url: input })"
          >Submit</VBtn
        >
        <VBtn class="ml-3" @click="memoryStore.getAllPages({ url: input })"
          >All Pages</VBtn
        >
      </div>

      <VList class="card-list">
        <VListItem v-for="(data, index) in memoryStore.websites" :key="index">
          <VListItemTitle class="font-weight-medium">
            {{ data.url }}
          </VListItemTitle>
          <VListItemSubtitle>
            {{ getFileSize(data.byteSize) || 0 }}
          </VListItemSubtitle>

          <template #append>
            <!-- <VBtn
              icon
              size="30"
              class="rounded mr-2"
              :variant="data?.isSelected ? 'tonal' : 'elevated'"
            >
              <VIcon
                size="20"
                :icon="
                  data?.isSelected ? 'tabler-square-x' : 'tabler-square-check'
                "
              />
            </VBtn> -->
            <VBtn color="red" icon size="30" class="rounded">
              <VIcon
                size="20"
                :icon="'tabler-trash'"
                @click="memoryStore.deleteWebsite(data)"
              />
            </VBtn>
          </template>
        </VListItem>
      </VList>
      <VBtn
        v-if="memoryStore.websites.length > 0"
        class="my-5"
        block
        @click="memoryStore.storeWebsites()"
        >Save websites</VBtn
      >
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 14px;
}
</style>
