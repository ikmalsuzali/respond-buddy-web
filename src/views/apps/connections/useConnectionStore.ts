import axios from '@axios'
import { defineStore } from 'pinia'

export const useConnectionStore = defineStore('ConnectionStore', {
  state: () => ({
    integrations: [],
    isIntegrationsLoading: false,
    isWorkspaceIntegrationsLoading: false,
    workspaceIntegrations: [],
    selectedWorkspaceIntegration: {},
    selectedIntegration: {
      id: '',
      name: '',
      meta_template: [],
      icon: '',
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

    setSelectedIntegration(integration: any) {
      this.toggleWorkspaceIntegrationDialog()
      this.selectedIntegration = integration
    },

    submitWorkspaceIntegration() {
      if (this.selectedIntegration.name === 'Slack') {
        // Add redirect url
        const workspaceId = JSON.parse(
          localStorage.getItem('userWorkspace') || ''
        )?.workspace
        const userId = JSON.parse(
          localStorage.getItem('userWorkspace') || ''
        )?.user
        const redirectUrl = `${
          import.meta.env.VITE_APP_API_URL
        }v1/slack/oauth/callback?workspace_id=${workspaceId}&user_id=${userId}&integration_id=${
          this.selectedIntegration.id
        }`
        const callbackUrl = `${
          this.selectedIntegration.meta_template?.shareable_url?.default
        }&redirect_uri=${encodeURIComponent(redirectUrl)}`
        window.open(`${callbackUrl}`, '_blank')
      }
    },
  },
})
