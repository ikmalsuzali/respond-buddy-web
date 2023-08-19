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
  }),
  actions: {
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
        username: item.username,
        firstName: item.first_name || '',
        lastName: item.last_name || '',
        email: item.email,
        language: item.language || 'English',
      }
    },
    getItem() {
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
  },
})
