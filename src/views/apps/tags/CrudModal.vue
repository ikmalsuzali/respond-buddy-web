<script setup lang="ts">
import { ref } from 'vue'
import { useTagStore } from './useTagStore'

const tagStore = useTagStore()

const selectedType = ref('respond')

const types = [
  {
    title: 'Respond',
    desc: 'Respond is used for asking a question with a specific context',
    value: 'respond',
  },
  {
    title: 'Command',
    desc: 'Command is used to give AI a specific instructions',
    value: 'command',
  },
]

const onFormSubmit = async () => {
  if (tagStore.selectedItem.id) {
    await tagStore.updateItem(tagStore.selectedItem?.id, tagStore.selectedItem)
  } else {
    await tagStore.createItem(tagStore.selectedItem)
  }
}

const onDeleteClick = async () => {
  await tagStore.deleteItem(tagStore.selectedItem?.id)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 610"
    :model-value="tagStore.isCrudDialogOpen"
    @update:model-value="tagStore.setIsCrudDialogOpen(false)"
  >
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn @click="() => tagStore.setIsCrudDialogOpen(false)" />

    <VCard class="pa-sm-8 pa-5">
      <!-- 👉 Title -->
      <VCardItem>
        <VCardTitle class="text-h4 text-center">
          {{ tagStore.selectedItem?.id ? 'Edit' : 'Add New' }} Template
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <div class="d-flex">
          <CustomRadiosWithIcon
            v-model:selected-radio="selectedType"
            :radio-content="types"
            :grid-column="{ sm: '12', cols: '12' }"
          />
        </div>

        <!-- 👉 Form -->
        <div class="mt-4">
          <VRow>
            <!-- 👉 Company Name -->
            <VCol cols="12" md="12">
              <AppTextField
                v-model="tagStore.selectedItem.name"
                :readonly="tagStore.selectedItem.isSystemTag"
                label=" Name"
              />
            </VCol>

            <!-- 👉 Used Description -->
            <VCol cols="12">
              <AppTextarea
                v-model="tagStore.selectedItem.usedDescription"
                :readonly="tagStore.selectedItem.isSystemTag"
                rows="8"
                label="This template is used for..."
                placeholder="Sample: Used when asking for email, asking for phone number, asking for address, etc."
              />
            </VCol>
            <!-- 👉 Template -->
            <VCol cols="12">
              <AppTextarea
                v-model="tagStore.selectedItem.aiTemplate"
                :readonly="tagStore.selectedItem.isSystemTag"
                rows="8"
                label="Prompt template"
                placeholder="Sample: I am a chatbot, I can help you with your questions. Format the answer with this [input]"
              />
            </VCol>

            <!-- 👉 Submit and Cancel button -->
            <VCol
              v-if="!tagStore.selectedItem.isSystemTag"
              cols="12"
              class="text-center"
            >
              <VBtn type="submit" class="me-3" @click.prevent="onFormSubmit">
                {{ tagStore.selectedItem?.id ? 'Update' : 'Create' }}
              </VBtn>
              <VBtn
                v-if="tagStore.selectedItem?.id"
                class="me-3"
                color="error"
                @click.prevent="onDeleteClick"
              >
                {{ 'Delete' }}
              </VBtn>
            </VCol>
          </VRow>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>
