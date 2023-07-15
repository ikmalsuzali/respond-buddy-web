<script lang="ts" setup>
import axios from '@axios'
import { useDropzone } from 'vue3-dropzone'
import WebsiteCard from './WebsiteCard.vue'
import { useMemoryStore } from './useMemoryStore'

// interface Emit {
//   (e: 'update:isDialogVisible', val: boolean): void
// }

// interface Prop {}

const memoryStore = useMemoryStore()
// const props = defineProps<Prop>()
// const emit = defineEmits<Emit>()
const currentTab = ref(memoryStore.selectedMemoryType?.fields?.types?.[0])
const files = ref([])
const input = ref()
const filename = ref('')
const isLoading = ref(false)

const onDrop = (acceptFiles: any, rejectReasons: any) => {
  console.log(rejectReasons)
  let mappedFiles = acceptFiles.map((file: File) => {
    return {
      id: uuidv4(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      file: file,
      data: null,
    }
  })
  files.value = [...files.value, ...mappedFiles]
  saveFiles(mappedFiles)
}

const saveFiles = (savingFiles) => {
  const formData = new FormData() // pass data as a form
  for (var i = 0; i < savingFiles.length; i++) {
    const savedFile = savingFiles[i]
    // append files as array to the form, feel free to change the array name
    formData.append('file', savedFile.file)

    // post the formData to your backend where storage is processed. In the backend, you will need to loop through the array and save each file through the loop.
    axios
      .post('/v1/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        const foundFileIndex = files.value.findIndex(
          (_file) => _file.id == savedFile?.id
        )
        files.value[foundFileIndex] = {
          ...files.value[foundFileIndex],
          data: response.data,
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }
}

const getFileSize = (file) => {
  // Check if the File API is supported
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var fileSize = file.size // File size in bytes

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

const onSave = () => {
  console.log('🚀 ~ file: index.vue:61 ~ getStores ~ res', 'save')
  isLoading.value = true
  // if (checkIfAllFilesHaveBeenUploaded() && currentTab.value === 'upload') return
  if (currentTab.value === 'upload') {
    saveUploads()
  } else {
    saveStores()
  }
}

const saveStores = () => {
  isLoading.value = true
  let data = {}
  if (currentTab.value === 'input') {
    memoryStore
      .storeRaw({
        text: input.value,
        filename: filename.value,
        store_type: memoryStore.selectedMemoryType?.id,
      })
      .then(() => {
        memoryStore.setMemoryDialogOpen(false)
      })
      .catch((e) => {
        const error = e?.response?.data || {}
      })
      .finally(() => {
        isLoading.value = false
      })
  } else if (currentTab.value === 'url') {
    memoryStore
      .storeWebsites({
        urls: urls.value.map((url) => url.value),
        store_type: memoryStore.selectedMemoryType?.id,
      })
      .then(() => {
        memoryStore.setMemoryDialogOpen(false)
      })
      .catch((e) => {
        const error = e?.response?.data || {}
      })
      .finally(() => {
        isLoading.value = false
      })
  }
}

const saveUploads = () => {
  // loop through all the s3_urls and run them concurrently and send response after completion
  const promises = files.value.map((file) => {
    return axios.post('/v1/store', {
      s3_url: file.data.url,
      type: 'upload',
      store_type: memoryStore.selectedMemoryType?.id,
    })
  })

  Promise.all(promises)
    .then((results) => {
      console.log('🚀 ~ file: index.vue:61 ~ getStores ~ res', results)
      memoryStore.setMemoryDialogOpen(false)
    })
    .catch((e) => {
      const error = e?.response?.data || {}
    })
    .finally(() => {
      isLoading.value = false
    })
}

const checkIfAllFilesHaveBeenUploaded = () => {
  const filesWithNoData = files.value.filter((file) => !file.data)
  if (filesWithNoData.length > 0) {
    console.log('not all files have been uploaded')
    return false
  }
  console.log('all files have been uploaded')
  return true
}

const areFilesMatching = (file1, file2) => {
  // Compare file names
  if (file1.name !== file2.name) {
    return false
  }

  // Compare file sizes
  if (file1.size !== file2.size) {
    return false
  }

  // Compare file types
  if (file1.type !== file2.type) {
    return false
  }

  return true
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
}

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var randomValue = (Math.random() * 16) | 0
    var value = c === 'x' ? randomValue : (randomValue & 0x3) | 0x8
    return value.toString(16)
  })
}

const { getRootProps, getInputProps, ...rest } = useDropzone({
  onDrop,
  accept: [
    '.doc',
    '.docx',
    '.pdf',
    '.txt',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.msexcel',
    'application/octet-stream',
  ],
  maxFiles: 1,
  maxSize: 5000000,
})
</script>

<template>
  <VDialog
    :model-value="memoryStore.isMemoryDialogOpen"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <!-- Dialog Content -->
    <VCard>
      <!-- Toolbar -->
      <div>
        <VToolbar color="primary">
          <VBtn
            icon
            variant="plain"
            :loading="isLoading"
            @click="memoryStore.setMemoryDialogOpen(false)"
          >
            <VIcon color="white" icon="tabler-x" />
          </VBtn>

          <VToolbarTitle>{{
            memoryStore.selectedMemoryType?.name
          }}</VToolbarTitle>

          <VSpacer />

          <!-- <VToolbarItems>
            <VBtn
              variant="text"
              @click="emit('update:isDialogVisible', false)"
            >
              Save
            </VBtn>
          </VToolbarItems> -->
        </VToolbar>
      </div>

      <VTabs v-model="currentTab">
        <VTab
          v-if="
            memoryStore.selectedMemoryType?.fields?.types?.includes('upload')
          "
          value="upload"
          >Upload</VTab
        >
        <VTab
          v-if="
            memoryStore.selectedMemoryType?.fields?.types?.includes('input')
          "
          value="input"
          >Content</VTab
        >
        <VTab
          v-if="
            memoryStore.selectedMemoryType?.fields?.types?.includes(
              'system_excel'
            )
          "
          value="system_excel"
          >Sheet</VTab
        >
        <VTab
          v-if="
            memoryStore.selectedMemoryType?.fields?.types?.includes('websites')
          "
          value="websites"
          >Websites</VTab
        >
        <!-- <VTab value="setting">Setting</VTab> -->
      </VTabs>

      <VCardText>
        <VWindow v-if="currentTab === 'upload'">
          <div class="d-flex justify-center flex-column">
            <VCard
              v-bind="getRootProps()"
              class="w-50 mt-10 pa-2 py-4 text-center"
              style="align-self: center"
            >
              <input v-bind="getInputProps()" />

              <VCardText class="d-flex flex-column pb-0">
                <VAvatar
                  size="42"
                  variant="tonal"
                  icon="tabler-upload"
                  class="mb-3"
                  color="primary"
                />

                <h6 class="text-lg font-weight-medium">
                  {{ 'Upload file(s)' }}
                </h6>
                <span class="text-sm">{{ 'Attach a file below' }}</span>
                <div class="pa-10 ma-6 text-center rounded-lg upload-area">
                  <VAvatar
                    size="42"
                    variant="tonal"
                    icon="tabler-file"
                    class="mb-3"
                    color="secondary"
                  />
                  <h6 class="text-lg font-weight-medium">
                    {{ 'Drag file(s) here to upload' }}
                  </h6>
                  <span class="upload-area-description">
                    Alternatively, you can select a file by <br /><strong
                      >clicking here</strong
                    >
                  </span>
                </div>

                <VList @click.stop="">
                  <VListSubheader
                    >Files {{ files.value?.length }}</VListSubheader
                  >

                  <VListItem
                    v-for="(file, i) in files"
                    :key="i"
                    color="primary"
                    rounded="xl"
                  >
                    <template v-slot:prepend>
                      <v-icon icon="tabler-file"></v-icon>
                    </template>
                    <VListItemTitle
                      class="font-weight-medium"
                      style="text-align: left"
                    >
                      {{ file.name || 'File 1' }}
                    </VListItemTitle>
                    <template #append>
                      <span
                        class="font-weight-medium text-medium-emphasis me-3"
                        >{{ getFileSize(file.file) }}</span
                      >
                      <VProgressCircular
                        v-if="!file.data"
                        indeterminate
                        color="yellow"
                        width="3"
                        size="28"
                      />
                      <VBtn
                        v-else
                        density="compact"
                        icon="tabler-trash"
                        color="red"
                        @click="removeFile(i)"
                      />
                    </template>
                  </VListItem>
                </VList>

                <VBtn :block="true" :loading="isLoading" @click.stop="onSave">
                  Save
                </VBtn>
              </VCardText>
            </VCard>
          </div>
        </VWindow>
        <VWindow v-if="currentTab === 'input'">
          <div class="d-flex justify-center flex-column">
            <VCard
              v-bind="getRootProps()"
              class="w-50 mt-10 pa-2 py-4 text-center"
              style="align-self: center"
            >
              <VCardText class="d-flex flex-column pb-0">
                <div class="d-flex">
                  <VAvatar
                    size="42"
                    variant="tonal"
                    icon="tabler-pencil"
                    class="mb-3"
                    color="primary"
                  />
                  <h6 class="text-lg font-weight-light ma-2">
                    {{ 'Write text and store into memory' }}
                  </h6>
                </div>
                <VTextField
                  v-model="filename"
                  density="compact"
                  class="my-4"
                  prepend-inner-icon="tabler-file"
                  placeholder="Title"
                />
                <AppTextarea v-model="input" auto-grow persistent-clear />

                <VBtn
                  class="mt-5"
                  :block="true"
                  :loading="isLoading"
                  @click.stop="onSave"
                >
                  Save
                </VBtn>
              </VCardText>
            </VCard>
          </div>
        </VWindow>
        <VWindow v-if="currentTab === 'websites'">
          <div class="d-flex justify-center flex-column">
            <WebsiteCard
              class="w-50 mt-10 pa-2 py-4"
              style="align-self: center"
            />
          </div>
        </VWindow>
        <VWindow v-if="currentTab === 'setting'"> </VWindow>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}

.upload-area {
  margin-top: 1.25rem;
  border: none;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23ccc' stroke-width='3' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
  background-color: transparent;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:hover,
  &:focus {
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%232e44ff' stroke-width='3' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
  }
}
</style>
