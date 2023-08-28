<script lang="ts" setup>
import type { ChatContact as TypeChatContact } from '@/@fake-db/types'
import { useChatStore } from '@/views/apps/chat/useChatStore'
import { useChat } from './useChat'

const props = defineProps<{
  search: string
  isDrawerOpen: boolean
}>()

const source = ref(
  'https://respondbuddy.sfo3.cdn.digitaloceanspaces.com/Pride-and-Prejudice.pdf'
)

defineEmits<{
  (e: 'openChatOfContact', id: TypeChatContact['id']): void
  (e: 'showUserProfile'): void
  (e: 'close'): void
}>()

const { resolveAvatarBadgeVariant } = useChat()
const search = useVModel(props, 'search')

const store = useChatStore()
</script>

<template>
  <!-- 👉 Chat list header -->

  <div class="chat-list-header"></div>
  <!-- <IconBtn v-if="$vuetify.display.smAndDown" @click="$emit('close')">
      <VIcon icon="tabler-x" class="text-medium-emphasis" />
    </IconBtn> -->
  <div class="d-flex" style="justify-content: space-between">
    <div class="d-flex gap-2" style="align-items: center; height: 40px">
      <IconBtn>
        <VIcon size="24" icon="tabler-arrow-badge-up" />
      </IconBtn>
      <div class="d-flex">
        <input
          style="width: 40px"
          variant="solo"
          class="chat-message-input text-right pe-1"
          placeholder="Page"
          density="default"
          autofocus
        />
        <div style="align-self: center">/ 100</div>
      </div>
      <IconBtn>
        <VIcon size="24" icon="tabler-arrow-badge-down" />
      </IconBtn>
    </div>
    <div class="d-flex gap-2">
      <IconBtn>
        <VIcon size="20" icon="tabler-plus" />
      </IconBtn>
      <div style="align-self: center; font-size: 18px">80%</div>
      <IconBtn>
        <VIcon size="20" icon="tabler-minus" />
      </IconBtn>
    </div>
    <div class="d-flex">
      <IconBtn>
        <VIcon size="24" icon="tabler-printer" />
      </IconBtn>
      <IconBtn>
        <VIcon size="24" icon="tabler-maximize" />
      </IconBtn>
      <IconBtn>
        <VIcon size="24" icon="tabler-dots-vertical" />
      </IconBtn>
    </div>
  </div>

  <VDivider />

  <PerfectScrollbar
    tag="ul"
    class="d-flex flex-column gap-y-1 chat-contacts-list px-3 list-none"
    :options="{ wheelPropagation: false }"
  >
    <vue-pdf-embed :source="source" :disable-text-layer="false" />
  </PerfectScrollbar>
</template>

<style lang="scss">
.chat-contacts-list {
  --chat-content-spacing-x: 16px;

  padding-block-end: 0.75rem;

  .chat-contact-header {
    margin-block-end: 0.625rem;
    margin-block-start: 1.25rem;
  }

  .chat-contact-header,
  .no-chat-items-text {
    margin-inline: var(--chat-content-spacing-x);
  }
}

.chat-list-search {
  .v-field--focused {
    box-shadow: none !important;
  }
}
</style>
