<script setup lang="ts">
import AppTextarea from '@/@core/components/app-form-elements/AppTextarea.vue'
import { usePricingStore } from '@/views/apps/account/usePricingStore'

const pricingStore = usePricingStore()
const selectedPlan = ref(pricingStore.selectedPlan)

watch(
  () => pricingStore.selectedPlan,
  () => {
    selectedPlan.value = pricingStore.selectedPlan
  }
)
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 580"
    :model-value="pricingStore.isDownloadDialogOpen"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="pricingStore.toggleDownloadDialog(false)" />

    <VCard class="pa-5 pa-sm-8">
      <!-- 👉 Title -->
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 font-weight-medium mb-3">
          {{ 'Downgrade Plan  😭' }}
        </VCardTitle>
        <p class="mb-0">
          {{
            'Tell us why you are downgrading, and what we can do to improve, because next time you come back it will be a lot better.'
          }}
        </p>
      </VCardItem>

      <VCardText class="pt-6">
        <VForm @submit.prevent="() => {}">
          <VRow>
            <!-- 👉 Card Number -->
            <VCol cols="12">
              <AppTextarea v-model="selectedPlan.remarks" />
            </VCol>

            <!-- 👉 Card actions -->
            <VCol cols="12" class="text-center">
              <VBtn
                class="me-3"
                type="submit"
                :loading="pricingStore.isLoading"
                @click="pricingStore.checkoutPlan(selectedPlan)"
              >
                Continue to downgrade
              </VBtn>
              <VBtn
                color="secondary"
                variant="tonal"
                :loading="pricingStore.isLoading"
                @click="pricingStore.toggleDownloadDialog(false)"
              >
                Cancel
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
