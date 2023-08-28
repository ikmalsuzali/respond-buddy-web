<script setup lang="ts">
import CrudModal from '../../../views/apps/tags/CrudModal.vue'
import TagList from '../../../views/apps/tags/TagList.vue'

// import MemoryList from '@/views/apps/memory/MemoryList.vue'
// import { useMemoryStore } from '@/views/apps/memory/useMemoryStore'

// const isStoreTypesLoading = ref(false)
// const isStoreLoading = ref(false)
// const storeTypes = ref([])
// const memoryStore = useMemoryStore()
// let test = ref()
// const sendmockmessage = async () => {
//   // let response = await axios.get('http://0.0.0.0:8080/api/v1/message/free', {
//   //   params: {
//   //     user_id: 'daea4ee5-4e18-4d60-96e5-0980390f5944',
//   //     message: 'send random 300 words message',
//   //   },
//   //   responseType: 'stream',
//   // })
//   // console.log(response)
//   // const stream = response.data.data
//   // console.log(stream)
//   // stream.on('data', (data) => {
//   //   console.log(data)
//   //   test.value = data.toString()
//   // })
//   // const url = new URL('http://0.0.0.0:8080/api/v1/message/free')
//   // const params = {
//   //   user_id: 'daea4ee5-4e18-4d60-96e5-0980390f5944',
//   //   message: 'send random 300 words message',
//   // }
//   // // Add the params as query parameters to the URL
//   // Object.keys(params).forEach((key) =>
//   //   url.searchParams.append(key, params[key])
//   // )
//   // try {
//   //   let response = await fetch(url, {
//   //     method: 'GET',
//   //     headers: {
//   //       Accept: 'application/octet-stream',
//   //     },
//   //   })
//   //   if (!response.ok) {
//   //     throw new Error('Network response was not ok')
//   //   }
//   //   // Assuming you want to process the stream directly like in the Axios example:
//   //   const reader = response.body.getReader()
//   //   let chunks = []
//   //   while (true) {
//   //     const { done, value } = await reader.read()
//   //     if (done) {
//   //       break
//   //     }
//   //     chunks.push(value)
//   //   }
//   //   const concatenatedChunks = new Uint8Array(
//   //     chunks.reduce((acc, val) => acc + val.length, 0)
//   //   )
//   //   let position = 0
//   //   for (let chunk of chunks) {
//   //     concatenatedChunks.set(chunk, position)
//   //     position += chunk.length
//   //   }
//   //   const text = new TextDecoder().decode(concatenatedChunks)
//   //   console.log(text)
//   //   test.value = text
//   // } catch (error) {
//   //   console.error('There was a problem with the fetch operation:', error)
//   // }
// }
const data = ref([])
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12">
        <!-- <VBtn @click="sendmockmessage">test</VBtn>
        {{ test }} -->
        <p class="text-h2 font-weight-thin">Templates</p>
        <p class="mb-0">
          Tags give immediate insight into what your content is all about.
          Whether you're sorting through articles, photos, or videos, these tags
          ensure you instantly understand the essence of each item. Dive
          straight into what matters and save precious time.
        </p>
      </VCol>

      <VCol cols="12">
        <!-- 👉 Tag List  -->
        <TagList />
      </VCol>
    </VRow>
    <CrudModal :is-dialog-visible="true" />
  </div>
</template>
