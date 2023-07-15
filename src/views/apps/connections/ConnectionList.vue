<script setup lang="ts">
import { useConnectionStore } from '@/views/apps/connections/useConnectionStore'
import { useWorkspaceStore } from '@/views/apps/workspace/useWorkspaceStore'
import type { Options } from '@core/types'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import DeleteDialog from './DeleteDialog.vue'
import DynamicDialogForm from './DynamicDialogForm.vue'

// 👉 Store
const connectionStore = useConnectionStore()
const workspaceStore = useWorkspaceStore()
const searchQuery = ref('')
const totalItems = ref(0)
const isMemoryLoading = ref(false)
const isDeleteDialogEnabled = ref({
  visible: false,
  id: '',
})
// const isDocLoading = ref(false)

const options = ref<Options>({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
})

const headers = [
  { title: 'Connections', key: 'name', width: '20%' },
  { title: 'Created at', key: 'created_at', width: '10%' },
  { title: 'Status', key: 'status', width: '5%' },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]

// 👉 Fetching users

const fetchWorkspaces = () => {
  isMemoryLoading.value = true
  connectionStore
    .fetchWorkspaceIntegrations({
      search: searchQuery.value,
      page: options.value.page,
      limit: options.value.itemsPerPage,
      sortField: options.value.sortBy?.[0]?.key,
      sortOrder: options.value.sortBy?.[0]?.order,
    })
    .then((response) => {
      totalItems.value = response?.data.total_count
    })
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {
      isMemoryLoading.value = false
    })
}

const onEdit = (workspaceIntegration: any) => {}

const deleteMethods = [
  {
    icon: 'tabler-cancel',
    title: 'Cancel request',
    subtitle:
      'Cancel the request to delete this integration. This will keep the integration in your account.',
    method: 'cancel',
  },
  {
    icon: 'tabler-message',
    title: 'Delete connections',
    subtitle:
      'Deleting this connection will remove it from your account and all other accounts that have access to it.',
    method: 'delete',
  },
]

watchEffect(() => {
  fetchWorkspaces()
})

// 👉 search filters

const resolveType = (stat: string) => {
  const statLowerCase = stat.toLowerCase()
  if (statLowerCase === 'pending') return 'warning'
  if (statLowerCase === 'raw') return 'Raw'
  if (statLowerCase === 'inactive') return 'secondary'

  return 'primary'
}

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
    <VCard>
      <VCardText class="d-flex flex-wrap gap-4">
        <!-- 👉 Search  -->
        <AppTextField
          v-model="searchQuery"
          placeholder="Search Connections"
          density="comfortable"
          style="width: 100%"
        />
      </VCardText>

      <VDivider />

      <!-- SECTION datatable -->
      <VDataTableServer
        v-model:items-per-page="options.itemsPerPage"
        v-model:page="options.page"
        :items="connectionStore.$state.workspaceIntegrations"
        :items-length="totalItems"
        :headers="headers"
        :loading="isMemoryLoading"
        class="text-no-wrap"
        @update:options="options = $event"
      >
        <!-- File  -->
        <template #item.name="{ item }">
          <VAvatar size="20" :image="item.raw.integrations?.icon" />

          <span class="text-capitalize font-weight-medium ml-3 mt-3">{{
            item.raw.integrations.name
          }}</span>
        </template>
        <!-- User -->
        <!-- <template #item.created_by="{ item }">
          <span class="text-capitalize font-weight-medium">{{
        
          }}</span>
        </template> -->

        <!-- User -->
        <!-- <template #item.size="{ item }">
          <span class="text-capitalize font-weight-medium">{{
            item.raw.s3_s3Tostore?.file_size
              ? formatBytes(item.raw.s3_s3Tostore?.file_size)
              : '0'
          }}</span>
        </template> -->

        <!-- <template #item.name="{ item }">
          <div class="d-flex align-center">
            <VAvatar
              size="38"
              :variant="!item.raw.avatar ? 'tonal' : undefined"
              :color="
                !item.raw.avatar
                  ? resolveUserRoleVariant(item.raw.role).color
                  : undefined
              "
              class="me-3"
            >
              <VImg v-if="item.raw.avatar" :src="item.raw.avatar" />
              <span v-else>{{ avatarText(item.raw.fullName) }}</span>
            </VAvatar>
            <div class="d-flex flex-column">
              <h6 class="text-body-1 font-weight-medium">
                <RouterLink
                  :to="{
                    name: 'apps-user-view-id',
                    params: { id: item.raw.id },
                  }"
                  class="user-list-name"
                >
                  {{ item.raw.fullName }}
                </RouterLink>
              </h6>
              <span class="text-sm text-disabled">{{ item.raw.email }}</span>
            </div>
          </div>
        </template> -->

        <!-- Role -->
        <!-- <template #item.role="{ item }">
          <div class="d-flex align-center gap-4">
            <VAvatar
              size="30"
              variant="tonal"
              :color="resolveUserRoleVariant(item.raw.role).color"
            >
              <VIcon
                size="20"
                :icon="resolveUserRoleVariant(item.raw.role).icon"
              />
            </VAvatar>
            <span class="text-capitalize">{{ item.raw.role }}</span>
          </div>
        </template> -->

        <!-- Plan -->
        <!-- <template #item.plan="{ item }">
          <span class="text-capitalize font-weight-medium">{{
            item.raw.currentPlan
          }}</span>
        </template> -->

        <template #item.created_at="{ item }">
          <span class="text-capitalize font-weight-medium">{{
            workspaceStore.formatTimestamp(item.raw.created_at)
          }}</span>
        </template>

        <template #bottom>
          <VDivider />

          <div
            class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3"
          >
            <div>
              <AppSelect
                :model-value="options.itemsPerPage"
                :items="[
                  { value: 10, title: '10' },
                  { value: 25, title: '25' },
                  { value: 50, title: '50' },
                  { value: 100, title: '100' },
                ]"
                style="width: 5rem"
                @update:model-value="
                  ($event) => {
                    options.itemsPerPage = parseInt($event, 10)
                    options.page = 1
                  }
                "
              />
            </div>

            <VPagination
              v-model="options.page"
              :length="Math.ceil(totalItems / options.itemsPerPage)"
              :total-visible="
                $vuetify.display.xs
                  ? 1
                  : Math.ceil(totalItems / options.itemsPerPage)
              "
            >
              <template #prev="slotProps">
                <VBtn
                  variant="tonal"
                  color="default"
                  v-bind="slotProps"
                  :icon="false"
                >
                  Previous
                </VBtn>
              </template>

              <template #next="slotProps">
                <VBtn
                  variant="tonal"
                  color="default"
                  v-bind="slotProps"
                  :icon="false"
                >
                  Next
                </VBtn>
              </template>
            </VPagination>
          </div>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn @click="onEdit(item.raw)">
            <VIcon icon="tabler-edit" />
          </IconBtn>
          <IconBtn @click="deleteMemory(item.raw.id)">
            <VIcon icon="tabler-trash" />
          </IconBtn>
        </template>
      </VDataTableServer>
      <!-- SECTION -->
    </VCard>

    <!-- 👉 Delete Memory -->
    <DeleteDialog
      v-model:is-dialog-visible="isDeleteDialogEnabled.visible"
      :delete-methods="deleteMethods"
      @onDelete="onSubmitDeletion"
    />
    <DynamicDialogForm
      v-if="connectionStore.isWorkspaceIntegrationDialogOpen"
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
