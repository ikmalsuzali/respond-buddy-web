<script lang="ts" setup>
import { useConnectionStore } from '@/views/apps/connections/useConnectionStore'

const connectionStore = useConnectionStore()
</script>

<template>
  <VDialog
    v-model="connectionStore.isWorkspaceIntegrationDialogOpen"
    max-width="600"
  >
    <!-- Dialog Activator -->
    <template #activator="{ props }">
      <VBtn v-bind="props">Open Dialog</VBtn>
    </template>

    <!-- Dialog close btn -->
    <DialogCloseBtn
      @click="connectionStore.toggleWorkspaceIntegrationDialog()"
    />

    <!-- Dialog Content -->
    <VCard :title="connectionStore.selectedWorkspace?.name">
      <VCardText>
        <VRow>
          <VCol
            v-for="(field, fieldName) in connectionStore.selectedWorkspace
              ?.meta_template"
            cols="12"
            sm="6"
            md="4"
          >
            <AppTextField :label="fieldName" />
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
        <VBtn @click="connectionStore.toggleWorkspaceIntegrationDialog()">
          Save
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
