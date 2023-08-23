import axios from '@axios'
import { defineStore } from 'pinia'

export const useAccountStore = defineStore('AccountStore', {
  state: () => ({
    isLoading: false,
    accountDetails: {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      language: 'English',
    },
    subscriptionDetails: {
      createdAt: '',
      nextRenewalDate: '',
      remainingDays: '',
      stripeProducts: {
        id: '',
        name: '',
        description: '',
        meta: {},
      },
    },
  }),
  getters: {
    getCurrentSubscriptionProductId(state) {
      return state.subscriptionDetails.stripeProducts?.id || ''
    },
  },
  actions: {
    getSubscriptionItem() {
      if (!localStorage.getItem('accessToken')) return
      const subscription = JSON.parse(
        localStorage.getItem('subscription') || '{}'
      )
      this.subscriptionDetails = this.deserializeSubscriptionItem(subscription)
      return new Promise((resolve) => {
        axios.get('/v1/workspace/subscription').then((response) => {
          this.subscriptionDetails = this.deserializeSubscriptionItem(
            response.data
          )

          localStorage.setItem('subscription', JSON.stringify(response.data))
          resolve(response.data)
        })
      })
    },
    deserializeSubscriptionItem(item: any) {
      return {
        createdAt: item.created_at,
        nextRenewalDate: item.next_renewal_date,
        remainingDays: item.remaining_renewal_days,
        stripeProducts: {
          id: item.stripe_products?.id,
          name: item.stripe_products?.name,
          description: item.stripe_products?.description,
          meta: item.stripe_products?.meta,
        },
      }
    },
    serializeItem() {
      return {
        username: this.accountDetails.username,
        first_name: this.accountDetails.firstName,
        last_name: this.accountDetails.lastName,
        email: this.accountDetails.email,
        language: this.accountDetails.language,
      }
    },
    deserializeItem(item: any) {
      return {
        username: item?.username,
        firstName: item?.first_name || '',
        lastName: item?.last_name || '',
        email: item?.email,
        language: item?.language || 'English',
      }
    },
    getItem() {
      if (!localStorage.getItem('accessToken')) return
      const userData = JSON.parse(localStorage.getItem('userData') || '{}')
      if (userData.user_id || userData.id) {
        this.accountDetails = this.deserializeItem(userData)
      } else {
        return new Promise((resolve) => {
          axios.get('/v1/user').then((response) => {
            this.accountDetails = this.deserializeItem(response.data)
            resolve(response.data)
          })
        })
      }
    },
    updateItem(item: any) {
      return new Promise((resolve) => {
        this.accountDetails = {
          ...this.accountDetails,
          ...item,
        }

        console.log(item)
        const mappedPayload = this.serializeItem()
        axios.put('/v1/user', mappedPayload).then((response) => {
          this.accountDetails = this.deserializeItem(response.data)
          localStorage.setItem('userData', JSON.stringify(response.data))
          resolve(response.data)
        })
      })
    },
    resetPassword() {
      return new Promise((resolve) => {
        axios.post('/v1/auth/reset-password').then((response) => {
          resolve(response.data)
        })
      })
    },

    logout() {
      // Remove "userData" from localStorage
      localStorage.removeItem('userData')
      // Remove "accessToken" from localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userWorkspace')
      localStorage.removeItem('subscription')

      // Redirect to login page
      this.$router.push('/login').then(() => {
        // ℹ️ We had to remove abilities in then block because if we don't nav menu items mutation is visible while redirecting user to login page
        // Remove "userAbilities" from localStorage
        localStorage.removeItem('userAbilities')

        // Reset ability to initial ability
      })
    },
  },
})
