import axios from '@axios'
import { defineStore } from 'pinia'

export const useConnectionStore = defineStore('ConnectionStore', {
  state: () => ({
    integrations: [],
    isIntegrationsLoading: false,
    isWorkspaceIntegrationsLoading: false,
    workspaceIntegrations: [],
    selectedWorkspaceIntegration: {},
    selectedWorkspace: {
      id: '',
      name: '',
      meta_template: [],
    },
    websites: [],
    isWorkspaceIntegrationDialogOpen: false,
  }),
  actions: {
    // 👉 Fetch users data
    async fetchIntegrations(params?: any) {
      return new Promise((resolve, reject) => {
        this.isIntegrationsLoading = true
        axios
          .get('/v1/integrations', { params })
          .then((response) => {
            this.integrations = response.data?.data
            resolve(response.data)
          })
          .catch((error) => {
            // Reject the promise with the error
            reject(error)
          })
          .finally(() => {
            this.isIntegrationsLoading = false
          })
      })
    },

    fetchWorkspaceIntegrations(params?: any) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/v1/workspace_integrations`, { params })
          .then((response) => {
            this.workspaceIntegrations = response.data?.data
            resolve(response.data)
          })
          .catch((error) => {
            // Reject the promise with the error
            reject(error)
          })
      })
    },

    toggleWorkspaceIntegrationDialog() {
      this.isWorkspaceIntegrationDialogOpen =
        !this.isWorkspaceIntegrationDialogOpen
    },
  },
})
