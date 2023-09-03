<script setup lang="ts">
import { useMemoryStore } from '@/views/apps/memory/useMemoryStore'
import type { Options } from '@core/types'
import { VDataIterator } from 'vuetify/labs/VDataIterator'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'

// 👉 Store
const memoryStore = useMemoryStore()
const searchQuery = ref('')
const totalItems = ref(0)
const isMemoryLoading = ref(false)
const isDeleteDialogEnabled = ref({
  visible: false,
  id: '',
})
const localQuery = ref(memoryStore.searchQuery)
const debouncedQuery = refDebounced(localQuery, 300)
// const isDocLoading = ref(false)

const options = ref<Options>({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
})

watch(
  () => debouncedQuery.value,
  () => {
    memoryStore.updateSearchQuery(debouncedQuery.value)
  }
)

const deleteMethods = [
  {
    icon: 'tabler-cancel',
    title: 'Cancel request',
    subtitle:
      'Cancel the request to delete this memory. This will keep the memory in your account.',
    method: 'cancel',
  },
  {
    icon: 'tabler-message',
    title: 'Delete memory',
    subtitle:
      'Deleting this memory will remove it from your account and all other accounts that have access to it.',
    method: 'delete',
  },
]

// 👉 Fetching users

const formatBytes = (bytes: number) => {
  if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + ' KB'
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  }
}

const onDownload = (memory: any) => {
  // Download s3 file
  const link = document.createElement('a')
  link.href = memory?.s3_s3Tostore?.s3_url
  link.target = '_blank'
  link.download = 'hello'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(memory?.s3_s3Tostore?.s3_url)
}

// const fetchDocs = () => {
//   isDocLoading.value = false
//   memoryStore
//     .fetchMemoryByDoc({
//       search: searchQuery.value,
//       status: selectedStatus.value,
//       plan: selectedPlan.value,
//       role: selectedRole.value,
//       options: options.value,
//     })
//     .then((response) => {
//       users.value = response.data.users
//       totalUsers.value = response.data.totalUsers
//       options.value.page = response.data.page
//     })
//     .catch((error) => {
//       console.error(error)
//     })
//     .finally(() => {
//       isDocLoading.value = true
//     })
// }

watchEffect(() => {
  memoryStore.fetchList()
  // fetchDocs()
})

const isAddNewUserDrawerVisible = ref(false)

// 👉 Add new user
// const addNewUser = (userData: UserProperties) => {
//   userListStore.addUser(userData)

//   // refetch User
//   fetchUsers()
// }

// // 👉 Delete user
const deleteMemory = (id: string) => {
  isDeleteDialogEnabled.value.visible = true
  isDeleteDialogEnabled.value.id = id
}

const onSubmitDeletion = () => {
  console.log('delete')
  memoryStore.deleteMemory(isDeleteDialogEnabled.value.id)
  isDeleteDialogEnabled.value.visible = false
  isDeleteDialogEnabled.value.id = ''
}
</script>

<template>
  <section>
    <div class="d-flex mb-8">
      <!-- 👉 Search  -->
      <AppTextField
        v-model="localQuery"
        placeholder="Search Memory"
        density="comfortable"
        style="width: 100%; background-color: white"
      />
    </div>

    <VContainer
      v-if="!memoryStore.isCrudLoading && memoryStore.list.length === 0"
      class="fill-height pa-0"
    >
      <VLayout align-center justify-center>
        <VRow xs12 sm8 md4>
          <VCol>
            <v-alert color="primary" value="true"> No records found </v-alert>
          </VCol>
        </VRow>
      </VLayout>
    </VContainer>

    <VRow v-if="memoryStore.isCrudLoading">
      <VCol v-for="() in 12" cols="12" md="12" lg="12">
        <VSkeletonLoader
          class="mx-auto border"
          type="avatar, text, list-item-two-line"
        ></VSkeletonLoader>
      </VCol>
    </VRow>

    <VDataIterator
      :items="memoryStore.list"
      :page="memoryStore.pagination.currentPage"
      :items-per-page="memoryStore.pagination.perPage || 12"
    >
      <template v-slot:default="{ items }">
        <VRow>
          <VCol
            v-for="(item, index) in items"
            :key="index"
            cols="12"
            md="12"
            lg="12"
          >
            <VCard class="rounded-xl">
              <VCardItem>
                <div class="d-flex">
                  <VImg max-width="30" :src="item.raw?.store_types?.icon" />
                  <VCardTitle class="ml-4" style="align-self: end">
                    {{ item.raw?.s3_s3Tostore?.original_name }}
                  </VCardTitle>
                </div>
              </VCardItem>
              <VCardText class="pb-2 pl-8">
                <p class="clamp-text mb-0">
                  {{ item.raw.output_text }}
                </p>
              </VCardText>
              <VCardActions class="pl-8">
                <VBtn color="secondary">Preview</VBtn>
                <VBtn color="error">Delete</VBtn>
              </VCardActions>

              <!-- <VCardItem>
                {{ item.raw }}
              </VCardItem>
              <VCardItem>
                {{ item.raw?.s3_s3Tostore?.original_name }}
              </VCardItem> -->
            </VCard>
          </VCol>
        </VRow>
      </template>
    </VDataIterator>

    <div
      class="d-flex align-center justify-space-between flex-wrap gap-3 pa-5 pt-3"
    >
      <VSpacer />

      <VPagination
        v-if="memoryStore.list.length >= 12"
        v-model="memoryStore.pagination.currentPage"
        :length="memoryStore.pagination.total"
        :total-visible="5"
      />
    </div>

    <!-- 👉 Delete Memory -->
    <DeleteDialog
      v-model:is-dialog-visible="isDeleteDialogEnabled.visible"
      :delete-methods="deleteMethods"
      @onDelete="onSubmitDeletion"
    />
  </section>
</template>

<style lang="scss">
.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
}
</style>
