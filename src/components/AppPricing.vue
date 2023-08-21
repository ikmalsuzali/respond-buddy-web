<script setup lang="ts">
import { useAccountStore } from '@/views/apps/account/useAccountStore'
import { usePricingStore } from '@/views/apps/account/usePricingStore'

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
      <VCard :class="plan.isPopular ? 'border-primary border-opacity-100' : ''">
        <VCardText style="block-size: 4.125rem" class="text-end">
          <!-- 👉 Popular -->
          <VChip v-show="plan.isPopular" label color="primary" size="small">
            Popular
          </VChip>
        </VCardText>

        <!-- 👉 Plan logo -->
        <VCardText class="text-center">
          <!-- 👉 Plan name -->
          <h5 class="text-h5 mb-2">
            {{ plan.name }}
          </h5>
          <p class="mb-0">
            {{ plan.description }}
          </p>
        </VCardText>

        <!-- 👉 Plan price  -->
        <VCardText class="position-relative text-center">
          <div class="d-flex justify-center align-center">
            <sup class="text-sm font-weight-medium me-1">$</sup>
            <h1 class="text-5xl font-weight-medium text-primary">
              {{ plan?.meta.price === 0 ? '0' : `${plan?.meta.price}` }}
            </h1>
            <sub class="text-sm font-weight-medium ms-1 mt-4">/month</sub>
          </div>
        </VCardText>

        <!-- 👉 Plan features -->
        <VCardText class="mt-5">
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
        <VCardActions>
          <VBtn
            @click="onCheckoutClick(plan)"
            block
            :color="
              accountStore.getCurrentSubscriptionProductId === plan.id
                ? 'success'
                : 'primary'
            "
            :variant="plan?.isPopular ? 'elevated' : 'tonal'"
          >
            {{
              accountStore.getCurrentSubscriptionProductId === plan.id
                ? 'Your Current Plan'
                : 'Upgrade'
            }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VCol>
  </VRow>
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
