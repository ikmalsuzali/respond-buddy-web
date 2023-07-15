import axios from '@axios';
import type { AxiosResponse } from 'axios';
import { defineStore } from 'pinia';

export const useWorkspaceStore = defineStore('WorkspaceStore', {
  // assign variables to pinia store
  state: () => ({
    countryIsoCode: 'en-US',
  }),
  
  actions: {
    formatTimestamp(timestamp: string) {
      const date = new Date(timestamp.replace(" ", "T"));
  
      const timeOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: "UTC"
      };

      const formattedDate = new Intl.DateTimeFormat(this.countryIsoCode, timeOptions).format(date);
      return formattedDate;
    },
    // 👉 Fetch users data
    fetchMemories(params: any) { return axios.get('/v1/store', { params }) },

    fetchMemoryByDoc(params: any) { return axios.get('/v1/store/docs', { params }) },

    fetchMemory(id: string) { return axios.get(`/v1/store/${id}`) },

    deleteMemory(id: string) { return axios.delete(`/v1/store/${id}`) },

    // 👉 Add User
    // addUser(userData: UserProperties) {
    //   return new Promise((resolve, reject) => {
    //     axios.post('/apps/users/user', {
    //       user: userData,
    //     }).then(response => resolve(response))
    //       .catch(error => reject(error))
    //   })
    // },

    // 👉 fetch single user
    fetchUser(id: number) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        axios.get(`/apps/users/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },

    // 👉 Delete User
    deleteUser(id: number) {
      return new Promise((resolve, reject) => {
        axios.delete(`/apps/users/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },
  },
})
