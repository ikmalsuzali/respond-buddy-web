import axios from '@axios'
import { defineStore } from 'pinia'

const selectedItemInit = {
  id: '',
  name: '',
  usedDescription: '',
  aiTemplate: '',
  workspace: '',
  isSystemTag: false,
}

export const useTagStore = defineStore('TagStore', {
  state: () => ({
    list: [],
    isCrudDialogOpen: false,
    error: null,
    isCrudLoading: false,
    pagination: {
      total: 0,
      perPage: 12,
      currentPage: 1,
    },
    selectedItem: selectedItemInit,
    searchQuery: '',
    isDeleteDialogOpen: false,
  }),
  actions: {
    // 👉 Fetch list
    // Add page and page size to params
    serializeItem() {
      return {
        id: this.selectedItem.id,
        name: this.selectedItem.name,
        used_description: this.selectedItem.usedDescription,
        ai_template: this.selectedItem.aiTemplate,
        workspace: this.selectedItem.workspace,
        is_system_tag: this.selectedItem.isSystemTag,
      }
    },

    updateSearchQuery(query: string) {
      this.searchQuery = query
    },

    deserializeItem(item: any) {
      return {
        id: item.id,
        name: item.name,
        usedDescription: item.used_description,
        aiTemplate: item.ai_template,
        workspace: item.workspace,
        isSystemTag: item.is_system_tag,
      }
    },

    fetchList({ page = 1, pageSize = 10, ...params } = {}) {
      this.isCrudLoading = true
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
            this.list = response.data?.data
            this.pagination.total = response.data?.total
            this.error = null
          })
          .catch((error) => {
            // Reject the promise with the error
            this.error = error.message
          })
          .finally(() => {
            this.isCrudLoading = false
          })
      })
    },

    // 👉 Create item
    // Add id params
    createItem({ ...payload } = {}) {
      return new Promise((resolve) => {
        const mappedPayload = this.serializeItem()
        axios
          .post(`/v1/tag`, mappedPayload)
          .then((response) => {
            this.error = null
            this.fetchList()
            this.setIsCrudDialogOpen(false)
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
        const mappedPayload = this.serializeItem()

        axios
          .put(`/v1/tag/${id}`, mappedPayload)
          .then((response) => {
            this.error = null
            this.fetchList()
            this.setIsCrudDialogOpen(false)
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
          .delete(`/v1/tag/${id}`)
          .then((response) => {
            this.error = null
            this.fetchList()
            this.setIsCrudDialogOpen(false)
            resolve(response.data)
          })
          .catch((error) => {
            this.error = error.message
            // Reject the promise with the error
            reject(error)
          })
      })
    },

    setSelectedItem(item: any) {
      this.selectedItem = this.deserializeItem(item)
      this.isCrudDialogOpen = true
    },

    setIsCrudDialogOpen(value: boolean) {
      this.isCrudDialogOpen = value

      if (this.isCrudDialogOpen === false) {
        this.selectedItem = {
          id: '',
          name: '',
          usedDescription: '',
          aiTemplate: '',
          workspace: '',
          isSystemTag: false,
        }
      }
    },

    setSearchQuery(query: any) {
      this.searchQuery = query
      this.fetchList() // Refetch with updated search query
    },
  },
})
