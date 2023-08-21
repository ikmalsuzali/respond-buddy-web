<script lang="ts" setup>
import { useAccountStore } from '@/views/apps/account/useAccountStore.ts'
import { useDateFormat } from '@vueuse/core'

// Images
const accountStore = useAccountStore()
accountStore.getSubscriptionItem()

const subscriptionLocal = ref(accountStore.subscriptionDetails)
const formattedDate = useDateFormat(
  subscriptionLocal.value.nextRenewalDate,
  'MMMM DD, YYYY'
)

const isPricingPlanDialogVisible = ref(false)
const isConfirmDialogVisible = ref(false)

// Watch for changes in accountStore.subscriptionDetails
watch(
  () => accountStore.subscriptionDetails,
  (newValue) => {
    subscriptionLocal.value = newValue
  }
)
</script>

<template>
  <VRow>
    <!-- 👉 Current Plan -->
    <VCol cols="12">
      <VCard title="Current Plan">
        <VCardText>
          <VRow>
            <VCol cols="12" md="6">
              <div>
                <div class="mb-6">
                  <h3 class="text-base font-weight-medium mb-1">
                    Your Current Plan is
                    {{ subscriptionLocal?.stripeProducts.name }}
                  </h3>
                  <p class="text-base">
                    {{ subscriptionLocal?.stripeProducts?.description }}
                  </p>
                </div>

                <div class="mb-6">
                  <h3 class="text-base font-weight-medium mb-1">
                    Active until {{ formattedDate }}
                  </h3>
                  <p class="text-base">
                    We will send you a notification upon subscription expiration
                  </p>
                </div>
              </div>
            </VCol>

            <VCol cols="12" md="6">
              <!-- progress -->
              <div>
                <h6 class="d-flex font-weight-medium text-base mt-4 mb-2">
                  <span>Days till next credit renewal</span>
                  <VSpacer />
                  <span>{{ subscriptionLocal.remainingDays }} of 30 Days</span>
                </h6>

                <VProgressLinear
                  color="primary"
                  rounded
                  height="12"
                  :model-value="
                    (Number(subscriptionLocal.remainingDays) / 30) * 100
                  "
                />
              </div>
              <!-- <div>
                <h6 class="d-flex font-weight-medium text-base mt-4 mb-2">
                  <span>Remaining messages till next credit renewal</span>
                  <VSpacer />
                  <span
                    >{{ subscriptionLocal.remainingDays }} of
                    {{
                      subscriptionLocal?.stripeProducts?.meta?.renewal
                        ?.monthly || '??'
                    }}
                    Credits</span
                  >
                </h6>

                <VProgressLinear
                  color="primary"
                  rounded
                  height="12"
                  :model-value="
                    (Number(subscriptionLocal.remainingDays) /
                      subscriptionLocal?.stripeProducts?.meta?.renewal
                        ?.monthly) *
                    100
                  "
                />
              </div>

              <div>
                <h6 class="d-flex font-weight-medium text-base mt-4 mb-2">
                  <span>Remaining memory storage</span>
                  <VSpacer />
                  <span
                    >{{ subscriptionLocal.remainingDays }} of
                    {{
                      subscriptionLocal?.stripeProducts?.meta?.renewal
                        ?.monthly || '??'
                    }}
                    MB</span
                  >
                </h6>

                <VProgressLinear
                  color="primary"
                  rounded
                  height="12"
                  :model-value="
                    (Number(subscriptionLocal.remainingDays) /
                      subscriptionLocal?.stripeProducts?.meta?.renewal
                        ?.monthly) *
                    100
                  "
                />
              </div> -->
            </VCol>

            <VCol cols="12">
              <div class="d-flex flex-wrap gap-y-4">
                <VBtn class="me-3" @click="isPricingPlanDialogVisible = true">
                  upgrade plan
                </VBtn>
              </div>
            </VCol>
          </VRow>

          <!-- 👉 Confirm Dialog -->
          <ConfirmDialog
            v-model:isDialogVisible="isConfirmDialogVisible"
            confirmation-question="Are you sure to cancel your subscription?"
            cancel-msg="Unsubscription Cancelled!!"
            cancel-title="Cancelled"
            confirm-msg="Your subscription cancelled successfully."
            confirm-title="Unsubscribed!"
          />

          <!-- 👉 plan and pricing dialog -->
          <PricingPlanDialog
            v-model:is-dialog-visible="isPricingPlanDialogVisible"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
.pricing-dialog {
  .pricing-title {
    font-size: 1.5rem !important;
  }

  .v-card {
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    box-shadow: none;
  }
}
</style>
