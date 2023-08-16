<script setup lang="ts">
import { watchEffect } from 'vue'
import { VDataIterator } from 'vuetify/labs/VDataIterator'
import { useTagStore } from './useTagStore'
// import DeleteDialog from './DeleteDialog.vue'

// 👉 Store
const tagStore = useTagStore()
const {
  list,
  error,
  isLoading,
  pagination,
  searchQuery,
  fetchList,
  createItem,
  deleteItem,
  updateItem,
} = tagStore
// const isDocLoading = ref(false)

const headers = [
  { title: 'File', key: 'name', width: '20%' },
  { title: 'Created by', key: 'created_by', width: '10%' },
  { title: 'Created at', key: 'created_at', width: '10%' },
  { title: 'Size', key: 'size', width: '5%' },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]

Array.from({ length: 15 }, (k, v) => ({}))

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

watchEffect(() => {
  fetchList()
})

// 👉 search filters
// const memoryHeader = [
//   { title: 'Admin', value: 'admin' },
//   { title: 'Author', value: 'author' },
//   { title: 'Editor', value: 'editor' },
//   { title: 'Maintainer', value: 'maintainer' },
//   { title: 'Subscriber', value: 'subscriber' },
// ]

// const resolveType = (stat: string) => {
//   const statLowerCase = stat.toLowerCase()
//   if (statLowerCase === 'pending') return 'warning'
//   if (statLowerCase === 'raw') return 'Raw'
//   if (statLowerCase === 'inactive') return 'secondary'

//   return 'primary'
// }

// const isAddNewUserDrawerVisible = ref(false)

// const onSubmitDeletion = () => {
//   console.log('delete')
//   memoryStore.deleteMemory(isDeleteDialogEnabled.value.id)
//   isDeleteDialogEnabled.value.visible = false
//   isDeleteDialogEnabled.value.id = ''
// }
</script>

<template>
  <section>
    <AppTextField
      v-model="searchQuery"
      placeholder="Search Templates"
      density="comfortable"
      class="pb-10"
      style="width: 100%; background-color: white"
    />

    <VDataIterator
      :items="[
        {
          name: 'Summary',
          description: 'Turns out semic-less style is easier and sa.',
        },
        {
          name: 'Summarize',
          description:
            'Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as well.',
        },
        {
          name: 'Summary',
          description:
            'Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as well.',
        },
        {
          name: 'Simplify',
          description:
            'Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as well.',
        },
        {
          name: 'Summary',
          description: 'Turns out semic-less style is easier and sa.',
        },
        {
          name: 'Summarize',
          description:
            'Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as well.',
        },
        {
          name: 'Summary',
          description:
            'Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as well.',
        },
        {
          name: 'Simplify',
          description:
            'Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as well.',
        },
      ]"
      :page="pagination.currentPage"
    >
      <template v-slot:default="{ items }">
        <VRow>
          <VCol
            v-for="(item, index) in items"
            :key="index"
            cols="12"
            md="3"
            lg="3"
          >
            <VCard color="#3B5998" style="min-height: 205px">
              <VCardItem>
                <template>
                  <VIcon size="1.9rem" color="white" />
                </template>
                <VCardTitle class="text-white text-center">
                  {{ item.raw.name }}
                </VCardTitle>
              </VCardItem>

              <VCardText>
                <p class="clamp-text text-white mb-0">
                  {{ item.raw?.description || item.raw?.ai_template }}
                </p>
              </VCardText>

              <VCardText class="d-flex justify-center align-center flex-wrap">
                <!-- <div class="text-no-wrap">
                <VAvatar size="34" :image="data.avatarImg" />
                <span class="text-white ms-2">{{ data.avatarName }}</span>
              </div> -->

                <div class="d-flex align-center">
                  <IconBtn icon="tabler-edit" color="white" class="me-1" />
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </template>
    </VDataIterator>

    <div
      class="d-flex align-center justify-space-between flex-wrap gap-3 pa-5 pt-3"
    >
      <!-- <p class="text-sm text-medium-emphasis mb-0">
        {{ 10 }} - {{ 20 }} of {{ 100 }}
      </p> -->
      <VSpacer />

      <VPagination
        v-if="list.length > 30"
        v-model="pagination.currentPage"
        :length="pagination.total"
      />
    </div>

    <!-- 👉 Delete Memory -->
    <!-- <DeleteDialog
      v-model:is-dialog-visible="isDeleteDialogEnabled.visible"
      :delete-methods="deleteMethods"
      @onDelete="onSubmitDeletion"
    /> -->
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
