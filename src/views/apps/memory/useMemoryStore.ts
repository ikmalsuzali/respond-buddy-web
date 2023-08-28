import axios from '@axios'
import { defineStore } from 'pinia'

export const useMemoryStore = defineStore('MemoryStore', {
  state: () => ({
    // NEW
    list: [],
    isCrudDialogOpen: false,
    isCrudLoading: false,
    pagination: {
      total: 0,
      perPage: 12,
      currentPage: 1,
    },
    error: null,
    selectedItem: {},
    searchQuery: '',
    isDeleteDialogOpen: false,

    // OLD
    memories: [],
    isMemoryDialogOpen: false,
    selectedMemoryType: {
      id: '',
      name: '',
      fields: [],
    },
    selectedMemoryChat: {},
    isSavingMessageLoading: false,
    selectedMemory: {
      id: '',
    },
    websites: [],
  }),
  actions: {
    // ---- NEW ---- //
    updateSearchQuery(query: string) {
      this.searchQuery = query
    },

    serializeItem() {
      return {
        // id: this.selectedItem.id,
        // name: this.selectedItem.name,
        // used_description: this.selectedItem.usedDescription,
        // ai_template: this.selectedItem.aiTemplate,
        // workspace: this.selectedItem.workspace,
        // is_system_tag: this.selectedItem.isSystemTag,
      }
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
      this.list = []
      return new Promise(() => {
        axios
          .get('/v1/store', {
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

    setSelectedItem(item: any) {
      this.selectedItem = this.deserializeItem(item)
      this.isCrudDialogOpen = true
    },

    setSearchQuery(query: any) {
      this.searchQuery = query
      this.fetchList() // Refetch with updated search query
    },

    // ---- OLD ---- //

    fetchMemory(id: string) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/v1/store/${id}`)
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
            // Reject the promise with the error
            reject(error)
          })
      })
    },

    deleteMemory(id: string) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/v1/store/${id}`)
          .then((response) => {
            this.error = null
            this.fetchList()
            this.setIsCrudDialogOpen(false)
            resolve(response.data)
          })
          .catch((error) => {
            // Reject the promise with the error
            reject(error)
          })
      })
    },

    storeRaw({
      text,
      filename,
      store_type,
      type = 'raw',
    }: {
      type?: string
      text: string
      filename?: string
      store_type: string
    }) {
      return new Promise((resolve, reject) => {
        axios
          .post('/v1/store', { type, text, filename, store_type })
          .then((response) => {
            this.fetchMemories({ page: 1, limit: 10 })
            this.selectedMemoryType = {}
            resolve(response.data)
          })
          .catch((error) => {
            // Reject the promise with the error
            reject(error)
          })
      })
    },

    storeWebsite({
      url,
      store_type,
      type = 'website_url',
    }: {
      url: string
      store_type: string
      type?: string
    }) {
      return new Promise((resolve, reject) => {
        axios
          .post('/v1/store', { type, url, store_type })
          .then((response) => {
            this.fetchMemories({ page: 1, limit: 10 })
            this.selectedMemoryType = {}
            resolve(response.data)
          })
          .catch((error) => {
            // Reject the promise with the error
            reject(error)
          })
      })
    },

    storeWebsites() {
      return new Promise((resolve, reject) => {
        const promises = this.websites.map((website) => {
          return this.storeWebsite({
            url: website?.url,
            type: 'website_url',
            store_type: this.selectedMemoryType.id,
          })
        })

        Promise.all(promises)
          .then((results) => {
            this.fetchMemories({ page: 1, limit: 10 })
            this.selectedMemoryType = {
              id: '',
              name: '',
              fields: [],
            }
            this.setMemoryDialogOpen(false)

            resolve(results)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    storeUpload({
      s3_url,
      store_type,
      type = 'upload',
    }: {
      s3_url: string
      type?: string
      store_type: string
    }) {
      return axios.post('/v1/store', { s3_url, type, store_type })
    },

    storeUploads({ files }: { files: File[] }) {
      return new Promise((resolve, reject) => {
        const promises = files.map((file) => {
          return this.storeUpload({ s3_url: file.name, store_type: 'image' })
        })

        Promise.all(promises)
          .then((results) => {
            this.fetchMemories({ page: 1, limit: 10 })
            this.selectedMemoryType = {}
            resolve(results)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // Selected memory type
    setSelectedMemoryType(type: any) {
      this.selectedMemoryType = type
    },

    setMemoryDialogOpen(isOpen: boolean) {
      if (!isOpen) {
        this.selectedMemoryType = {
          id: '',
          name: '',
          fields: [],
        }
      }

      this.isMemoryDialogOpen = isOpen
    },

    setWebsites(websites: []) {
      // Clean duplicate websites
      const combinedWebsites = [...this.websites, ...websites]
      const filteredWebsites = filterByUniqueKey(combinedWebsites, 'url')
      this.websites = filteredWebsites
    },

    updateWebsites(website: any) {
      const websites = this.websites.map((w: any) => {
        if (w.url === website.url) {
          return website
        }
        this.websites = websites
      })
    },

    async addWebsite(website: { url: string; isSelected?: boolean }) {
      if (!isValidWebsite(website.url)) return
      let cleanedUrl = appendHttps(website.url)

      try {
        const response = await axios.get('/v1/website/valid', {
          params: {
            url: cleanedUrl,
          },
        })

        if (response && response.data) {
          this.websites.push({
            url: cleanedUrl,
            byteSize: response?.data?.data.bytesize || 0,
            isSelected: website.isSelected || true,
          })

          const filteredWebsites = filterByUniqueKey(this.websites, 'url')
          this.websites = filteredWebsites
        }
      } catch (error) {
        console.log(error)
      }

      // this.websites.push({
      //   url: website.url,
      //   isSelected: website.isSelected
      // })
    },

    async getAllPages(website: { url: string; isSelected?: boolean }) {
      try {
        if (!isValidWebsite(website.url)) return
        let cleanedUrl = appendHttps(website.url)

        const response = await axios.get('/v1/website/pages', {
          params: {
            url: cleanedUrl,
          },
        })

        if (response && response.data) {
          console.log(response.data)
          const pages = response.data.pages.map((page: any) => {
            return {
              url: page.url,
              byteSize: page.bytesize || 0,
              isSelected: website.isSelected,
            }
          })

          this.websites = this.websites.concat(pages)
          const filteredWebsites = filterByUniqueKey(this.websites, 'url')
          this.websites = filteredWebsites
        }
      } catch (error) {
        console.log(error)
      }
    },

    deleteWebsite(website: any) {
      const websites = this.websites.filter((w: any) => w.url !== website.url)
      this.websites = websites
    },

    pushMesageToChat({ storeId, message }: { storeId: string; message: any }) {
      let messages = this.selectedMemoryChat[storeId] || []
      messages.push({
        customer: 'id',
        content: message,
        created_at: new Date(),
      })
      this.selectedMemoryChat[storeId] = messages
    },

    async saveMessage({
      storeId,
      message,
    }: {
      storeId: string
      message: string
    }) {
      try {
        this.isSavingMessageLoading = true
        let messages = this.selectedMemoryChat[storeId] || []

        const response = await axios.post('/v1/message', {
          store_id: storeId,
          message,
        })

        if (response && response.data) {
          let responseData = response.data?.data
          console.log(response.data)
          // User Message

          // Bot Message
          messages.push({
            customer: null,
            content: responseData.message,
            created_at: new Date(),
          })

          this.selectedMemoryChat[storeId] = messages
          // this.selectedMemoryChat = {
          //   ...this.selectedMemoryChat,
          //   [storeId]: messages.push(response.data.message),
          // }
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isSavingMessageLoading = false
      }
    },

    async getMessages({ storeId }: { storeId: string }) {
      try {
        const response = await axios.get(`/v1/message/${storeId}`)

        if (response && response.data) {
          this.selectedMemoryChat = {
            ...this.selectedMemoryChat,
            [storeId]: response.data.messages,
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
})

const appendHttps = (url: string) => {
  if (!/^https?:\/\//i.test(url)) {
    return 'https://' + url
  }
  return url
}

const isValidWebsite = (url: string) => {
  const regex =
    /^(http[s]?:\/\/)?(www\.)?([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}([/?].*)?$/
  return regex.test(url)
}

const filterByUniqueKey = (arr: [], key: string) => {
  const uniqueValues = new Set()

  const filteredArr = arr.filter((obj) => {
    const value = obj[key]
    if (!uniqueValues.has(value)) {
      uniqueValues.add(value)
      return true
    }
    return false
  })

  return filteredArr
}
