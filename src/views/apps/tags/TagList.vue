<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import { ref, watchEffect } from 'vue'
import { VDataIterator } from 'vuetify/labs/VDataIterator'
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader'
import { useTagStore } from './useTagStore'

// import DeleteDialog from './DeleteDialog.vue'

// 👉 Store
const tagStore = useTagStore()
const localQuery = ref(tagStore.searchQuery)
const debouncedQuery = refDebounced(localQuery, 300)

const onEditClick = (item: any) => {
  tagStore.setSelectedItem(item)
  tagStore.setIsCrudDialogOpen(true)
}

watch(
  () => debouncedQuery.value,
  () => {
    tagStore.updateSearchQuery(debouncedQuery.value)
  }
)

watchEffect(() => {
  tagStore.fetchList()
})
</script>

<template>
  <section>
    <div class="d-flex">
      <AppTextField
        v-model="localQuery"
        placeholder="Search Templates"
        density="comfortable"
        class="pb-10"
        style="width: 100%; background-color: white"
      />
      <VBtn
        class="ml-4"
        size="large"
        @click="tagStore.setIsCrudDialogOpen(true)"
      >
        Create
      </VBtn>
    </div>

    <VContainer
      v-if="!tagStore.isCrudLoading && tagStore.list.length === 0"
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

    <VRow v-if="tagStore.isCrudLoading">
      <VCol v-for="() in 8" cols="12" md="3" lg="3">
        <VSkeletonLoader
          class="mx-auto border"
          type="avatar, text, subtitle, list-item-two-line"
        ></VSkeletonLoader>
      </VCol>
    </VRow>
    <VDataIterator
      :items="tagStore.list"
      :page="tagStore.pagination.currentPage"
      :items-per-page="tagStore.pagination.perPage || 12"
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
            <VCard style="min-height: 180px">
              <VCardItem>
                <template>
                  <VIcon size="1.9rem" color="white" />
                </template>
                <div class="d-flex">
                  <VCardTitle class="text-center" style="padding-top: 5px">
                    {{ item.raw.name }}
                  </VCardTitle>
                  <VSpacer />
                  <div>
                    <IconBtn
                      v-if="!item.raw.is_system_tag"
                      @click="onEditClick(item.raw)"
                      icon="tabler-edit"
                      class=""
                    />
                    <IconBtn
                      v-else
                      @click="onEditClick(item.raw)"
                      icon="tabler-eye"
                      class=""
                    />
                  </div>
                </div>
              </VCardItem>

              <VCardText>
                <p class="clamp-text mb-0">
                  {{ item.raw?.used_description || item.raw?.ai_template }}
                </p>
              </VCardText>

              <VCardText class="d-flex justify-center align-center flex-wrap">
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </template>
    </VDataIterator>

    <div
      class="d-flex align-center justify-space-between flex-wrap gap-3 pa-5 pt-3"
    >
      <!-- <VSpacer />

      <VPagination
        v-if="tagStore.list.length >= 12"
        v-model="tagStore.pagination.currentPage"
        :length="tagStore.pagination.total"
      /> -->
    </div>
    <CrudModal />
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
