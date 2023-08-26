import axios from '@axios'
import { defineStore } from 'pinia'

export const usePricingStore = defineStore('PricingStore', {
  state: () => ({
    isLoading: false,
    pricingPlans: [],
  }),
  getters: {
    // get monthly pricing
    monthlyPricing(state) {
      return (
        state.pricingPlans?.filter(
          (pricing: any) =>
            pricing.plan_type === 'MONTHLY' || pricing.plan_type === 'ALL'
        ) || []
      )
    },
    // get annual pricing
    annualPricing(state) {
      return (
        state.pricingPlans.filter(
          (pricing: any) =>
            pricing.plan_type === 'YEARLY' || pricing.plan_type === 'ALL'
        ) || []
      )
    },
  },
  actions: {
    getPricingPlans() {
      const pricingList = JSON.parse(
        localStorage.getItem('pricingPlans') || '[]'
      )
      this.pricingPlans = pricingList
      return new Promise((resolve) => {
        axios.get('/v1/stripe/products').then((response) => {
          console.log(
            '🚀 ~ file: usePricingStore.ts:37 ~ axios.get ~ response:',
            response.data
          )
          this.pricingPlans = response.data
          localStorage.setItem('pricingPlans', JSON.stringify(response.data))
          resolve(response.data)
        })
      })
    },
    checkoutPlan(planId: string) {
      return new Promise((resolve) => {
        this.isLoading = true
        axios
          .post('/v1/checkout-session', {
            plan_id: planId,
          })
          .then((response) => {
            window.location.href = response.data.stripe_url
            this.isLoading = false
            resolve(response.data)
          })
      })
    },
  },
})
