import axios from '@axios'
import { defineStore } from 'pinia'

export const useTagStore = defineStore('TagStore', {
  state: () => ({
    list: [],
    isCrudDialogOpen: false,
    error: null,
    isLoading: false,
    pagination: {
      total: 0,
      perPage: 10,
      currentPage: 1,
    },
    searchQuery: ref(''),
  }),
  actions: {
    // 👉 Fetch list
    // Add page and page size to params
    fetchList({ page = 1, pageSize = 10, ...params } = {}) {
      this.isLoading = true
      return new Promise(() => {
        axios
          .get('/v1/tags', {
            params: {
              ...params,
              page: this.pagination.currentPage,
              limit: this.pagination.perPage,
              search: this.searchQuery,
            },
          })
          .then((response) => {
            this.list = response.data?.data.stores
            this.pagination.total = response.data?.data.total
            this.error = null
          })
          .catch((error) => {
            // Reject the promise with the error
            this.error = error.message
          })
          .finally(() => {
            this.isLoading = false
          })
      })
    },

    // 👉 Create item
    // Add id params
    createItem({ ...payload } = {}) {
      return new Promise((resolve) => {
        axios
          .post(`/v1/tags`, payload)
          .then((response) => {
            this.error = null
            this.fetchList()
            resolve(response.data)
          })
          .catch((error) => {
            // Reject the promise with the error
            this.error = error.message
          })
      })
    },

    // 👉 Update
    updateItem(id: string, { ...payload } = {}) {
      return new Promise((resolve, reject) => {
        axios
          .put(`/v1/tags/${id}`, payload)
          .then((response) => {
            this.error = null
            this.fetchList()
            resolve(response.data)
          })
          .catch((error) => {
            this.error = error.message
            // Reject the promise with the error
            reject(error)
          })
      })
    },

    // 👉 Delete
    deleteItem(id: string) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/v1/tags/${id}`)
          .then((response) => {
            this.error = null
            this.fetchList()
            resolve(response.data)
          })
          .catch((error) => {
            this.error = error.message
            // Reject the promise with the error
            reject(error)
          })
      })
    },

    setSearchQuery(query: any) {
      this.searchQuery = query
      this.fetchList() // Refetch with updated search query
    },
  },
})
