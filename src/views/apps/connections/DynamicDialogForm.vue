<script lang="ts" setup>
import { useConnectionStore } from '@/views/apps/connections/useConnectionStore'

const connectionStore = useConnectionStore()

const authUrl = () => {
  return connectionStore.selectedIntegration?.meta_template?.shareable_url
    ?.default
}

const convertUnderscoreToCapitalizedText = (text: string) => {
  return text
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const filterByIsHidden = () => {
  const filteredObj = {}

  for (const [key, value] of Object.entries(
    connectionStore.selectedIntegration?.meta_template
  )) {
    if (value.is_hidden === 'false') {
      filteredObj[key] = value
    }
  }

  return filteredObj
}
</script>

<template>
  <VDialog
    v-model="connectionStore.isWorkspaceIntegrationDialogOpen"
    max-width="600"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn
      @click="connectionStore.toggleWorkspaceIntegrationDialog()"
    />

    <!-- Dialog Content -->
    <VCard :title="connectionStore.selectedIntegration?.name">
      <VCardText>
        <VRow>
          <VCol
            v-for="(field, fieldName) in filterByIsHidden()"
            cols="12"
            sm="6"
            :md="filterByIsHidden.length > 1 ? '4' : '12'"
          >
            <AppTextField
              :label="convertUnderscoreToCapitalizedText(fieldName)"
            />
          </VCol>
        </VRow>
      </VCardText>
      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="connectionStore.toggleWorkspaceIntegrationDialog()"
        >
          Close
        </VBtn>
        <VBtn @click="connectionStore.submitWorkspaceIntegration()">
          Integrate
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
