<script setup lang="ts">
import { useAccountStore } from '@/views/apps/account/useAccountStore'
import { usePricingStore } from '@/views/apps/account/usePricingStore'
import { useRoute } from 'vue-router'

const route = useRoute()
const pricingStore = usePricingStore()
const accountStore = useAccountStore()
pricingStore.getPricingPlans()

const annualMonthlyPlanPriceToggler = ref(true)
const pricingPlansMonthlyLocal = ref(pricingStore.monthlyPricing)
const pricingPlansYearlyLocal = ref(pricingStore.annualPricing)
const currentPricingPlanLocal = computed(() => {
  if (!pricingPlansMonthlyLocal.value.length) return []
  return annualMonthlyPlanPriceToggler.value
    ? pricingPlansYearlyLocal.value
    : pricingPlansMonthlyLocal.value
})

const buttonData = (plan: any) => {
  if (accountStore.getCurrentSubscriptionProduct.key === plan.key) {
    return {
      color: 'success',
      text: 'Your Current Plan',
    }
  } else if (accountStore.getCurrentSubscriptionProduct.order > plan.order) {
    return {
      color: 'error',
      text: 'Downgrade 😭',
      action: () => {
        pricingStore.selectedPlan = plan
        pricingStore.toggleDownloadDialog(true)
      },
    }
  } else {
    return {
      color: 'primary',
      text: 'Upgrade 🥹',
      action: () => {
        pricingStore.checkoutPlan(plan)
      },
    }
  }
}

const onCheckoutClick = async (plan: any) => {
  console.log(plan)
  if (!plan || !plan.stripe_price_id) return
  const response = await pricingStore.checkoutPlan(plan?.stripe_price_id)
}

watch(
  () => pricingStore.pricingPlans,
  () => {
    pricingPlansMonthlyLocal.value = pricingStore.monthlyPricing
    pricingPlansYearlyLocal.value = pricingStore.annualPricing
  }
)

interface Pricing {
  title?: string
  xs?: number | string
  sm?: number | string
  md?: string | number
  lg?: string | number
  xl?: string | number
}
</script>

<template>
  <v-alert
    v-if="route.query?.status === 'success'"
    class="mb-4"
    type="success"
    title="Successfully subscribed"
    text="Thank you for subscribing to our service and we hope you enjoy it."
  ></v-alert>
  <v-alert
    v-if="route.query?.status === 'failed'"
    class="mb-4"
    type="error"
    title="Failed to subscribe"
    text="Try again and if the problem persists, please contact our support team."
  ></v-alert>
  <!-- 👉 Title and subtitle -->
  <div class="text-center">
    <h4 class="text-h1 font-weight-bold mb-4">
      {{ 'Pricing Plans' }}
    </h4>
  </div>

  <!-- 👉 Annual and monthly price toggler -->

  <div class="d-flex align-center justify-center mx-auto my-10">
    <VLabel for="pricing-plan-toggle" class="me-2"> Monthly </VLabel>

    <div class="position-relative">
      <VSwitch
        id="pricing-plan-toggle"
        v-model="annualMonthlyPlanPriceToggler"
        label="Annual"
      />

      <div
        class="save-upto-chip position-absolute align-center d-none d-md-flex gap-1"
      >
        <VIcon icon="tabler-corner-left-down" class="flip-in-rtl" />
        <VChip label color="primary"> Save up to 10% </VChip>
      </div>
    </div>
  </div>

  <!-- SECTION pricing plans -->
  <VRow>
    <VCol
      v-for="(plan, index) in currentPricingPlanLocal"
      :key="index"
      v-bind="props"
      cols="4"
    >
      <!-- 👉  Card -->
      <VCard
        :class="plan.isPopular ? 'border-primary border-opacity-100' : ''"
        class="rounded-xl"
      >
        <!-- <VCardText style="block-size: 4.125rem" class="text-end">
          <VChip v-show="plan.isPopular" label color="primary" size="small">
            Popular
          </VChip>
        </VCardText> -->

        <!-- 👉 Plan logo -->
        <VCardText class="text-center pb-2">
          <!-- 👉 Plan name -->
          <div class="d-flex">
            <h5 class="text-h2 font-weight-bold mb-2 pl-2">
              {{ plan.name }}
            </h5>
            <p class="pl-2" style="align-self: self-end">
              {{ plan.description }}
            </p>
          </div>
        </VCardText>

        <!-- 👉 Plan price  -->
        <VCardText class="position-relative text-center">
          <div class="d-flex justify-center align-center">
            <sup class="text-sm font-weight-medium me-1">$</sup>
            <h1 class="text-5xl font-weight-bold">
              {{ plan?.meta.price === 0 ? '0' : `${plan?.meta.price}` }}
            </h1>
            <sub class="text-sm font-weight-bold ms-1 mt-4">/month</sub>
          </div>
        </VCardText>

        <!-- 👉 Plan features -->
        <VCardText>
          <VList class="card-list">
            <VListItem
              v-for="feature in plan?.meta?.desc_points"
              :key="feature"
            >
              <template #prepend>
                <VIcon :size="14" icon="tabler-circle" class="me-3" />
              </template>

              <VListItemTitle>
                {{ feature }}
              </VListItemTitle>
            </VListItem>
          </VList>
        </VCardText>

        <!-- 👉 Plan actions -->
        <VCardActions class="px-10">
          <VBtn
            @click="buttonData(plan).action"
            :loading="pricingStore.isLoading"
            block
            :color="buttonData(plan).color"
            :variant="plan?.isPopular ? 'elevated' : 'tonal'"
            class="rounded-xl"
          >
            {{ buttonData(plan).text }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VCol>
  </VRow>
  <DowngradeDialog />
  <!-- !SECTION  -->
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.75rem;
}

.save-upto-chip {
  inset-block-start: -1.5rem;
  inset-inline-end: -7rem;
}
</style>
