<script lang="ts" setup>
import type { ChatContact as TypeChatContact } from '@/@fake-db/types'
import vuetifyInitialThemes from '@/plugins/vuetify/theme'
import ChatActiveChatUserProfileSidebarContent from '@/views/apps/chat/ChatActiveChatUserProfileSidebarContent.vue'
import ChatLeftSidebarContent from '@/views/apps/chat/ChatLeftSidebarContent.vue'
import { useChat } from '@/views/apps/chat/useChat'
import { useChatStore } from '@/views/apps/chat/useChatStore'
import { useMemoryStore } from '@/views/apps/memory/useMemoryStore'
import { useResponsiveLeftSidebar } from '@core/composable/useResponsiveSidebar'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useDisplay, useTheme } from 'vuetify'

// composables
const vuetifyDisplays = useDisplay()
const store = useChatStore()
const memory = useMemoryStore()
const { isLeftSidebarOpen } = useResponsiveLeftSidebar(
  vuetifyDisplays.smAndDown
)
const { resolveAvatarBadgeVariant } = useChat()

// Perfect scrollbar
const chatLogPS = ref()

const scrollToBottomInChatLog = () => {
  const scrollEl = chatLogPS.value.$el || chatLogPS.value

  scrollEl.scrollTop = scrollEl.scrollHeight
}

// Search query
const q = ref('')

watch(q, (val) => store.fetchChatsAndContacts(val), { immediate: true })

// Open Sidebar in smAndDown when "start conversation" is clicked
const startConversation = () => {
  if (vuetifyDisplays.mdAndUp.value) return
  isLeftSidebarOpen.value = true
}

// Chat message
const msg = ref('')

const sendMessage = async () => {
  if (!msg.value) return

  memory.pushMesageToChat({
    storeId: memory.selectedMemory?.id,
    message: msg.value,
  })

  nextTick(() => {
    scrollToBottomInChatLog()
  })

  await memory.saveMessage({
    storeId: memory.selectedMemory?.id,
    message: msg.value,
  })

  // Reset message input
  msg.value = ''

  // Scroll to bottom
  nextTick(() => {
    scrollToBottomInChatLog()
  })
}

const openChatOfContact = async (userId: TypeChatContact['id']) => {
  await store.getChat(userId)

  // Reset message input
  msg.value = ''

  // Set unseenMsgs to 0
  const contact = store.chatsContacts.find((c) => c.id === userId)
  if (contact) contact.chat.unseenMsgs = 0

  // if smAndDown =>  Close Chat & Contacts left sidebar
  if (vuetifyDisplays.smAndDown.value) isLeftSidebarOpen.value = false

  // Scroll to bottom
  nextTick(() => {
    scrollToBottomInChatLog()
  })
}

const fetchMessages = async () => {
  await memory.getMessages({
    storeId: memory.selectedMemory?.id,
  })

  // Scroll to bottom
  nextTick(() => {
    scrollToBottomInChatLog()
  })
}

fetchMessages()

// User profile sidebar
const isUserProfileSidebarOpen = ref(false)

// Active chat user profile sidebar
const isActiveChatUserProfileSidebarOpen = ref(false)

// file input
const refInputEl = ref<HTMLElement>()

const moreList = [
  { title: 'View Contact', value: 'View Contact' },
  { title: 'Mute Notifications', value: 'Mute Notifications' },
  { title: 'Block Contact', value: 'Block Contact' },
  { title: 'Clear Chat', value: 'Clear Chat' },
  { title: 'Report', value: 'Report' },
]

const { name } = useTheme()

const chatContentContainerBg = computed(() => {
  let color = 'transparent'

  if (vuetifyInitialThemes)
    color = vuetifyInitialThemes.themes?.[name.value].colors
      ?.background as string

  return color
})
</script>

<template>
  <VLayout class="chat-app-layout">
    <VNavigationDrawer
      v-model="isActiveChatUserProfileSidebarOpen"
      width="700"
      absolute
      temporary
      location="end"
      touchless
      class="active-chat-user-profile-sidebar"
    >
      <ChatActiveChatUserProfileSidebarContent
        @close="isActiveChatUserProfileSidebarOpen = false"
      />
    </VNavigationDrawer>
    <VNavigationDrawer
      v-model="isLeftSidebarOpen"
      absolute
      touchless
      location="start"
      width="600"
      :temporary="$vuetify.display.smAndDown"
      class="chat-list-sidebar"
      :permanent="$vuetify.display.mdAndUp"
    >
      <ChatLeftSidebarContent
        v-model:isDrawerOpen="isLeftSidebarOpen"
        v-model:search="q"
        @open-chat-of-contact="openChatOfContact"
        @show-user-profile="isUserProfileSidebarOpen = true"
        @close="isLeftSidebarOpen = false"
      />
    </VNavigationDrawer>
    <VMain class="chat-content-container">
      <div v-if="memory?.selectedMemory?.id" class="d-flex flex-column h-100">
        <!-- <div
          class="active-chat-header d-flex align-center text-medium-emphasis bg-surface"
        >
          <IconBtn class="d-md-none me-3" @click="isLeftSidebarOpen = true">
            <VIcon icon="tabler-menu-2" />
          </IconBtn>
          <div
            class="d-flex align-center cursor-pointer"
            @click="isActiveChatUserProfileSidebarOpen = true"
          ></div>

          <VSpacer />

          <MoreBtn
            :menu-list="moreList"
            density="comfortable"
            color="undefined"
          />
        </div> -->

        <PerfectScrollbar
          ref="chatLogPS"
          tag="ul"
          :options="{ wheelPropagation: false }"
          class="flex-grow-1"
        >
          <!-- <ChatLog /> -->
        </PerfectScrollbar>
      </div>
      <div v-else class="d-flex h-100 align-center justify-center flex-column">
        <VAvatar size="109" class="elevation-3 mb-6 bg-surface">
          <VIcon
            size="50"
            class="rounded-0 text-high-emphasis"
            icon="tabler-message"
          />
        </VAvatar>
        <p
          class="mb-0 px-6 py-1 font-weight-medium text-lg elevation-3 rounded-xl text-high-emphasis bg-surface"
          :class="[{ 'cursor-pointer': $vuetify.display.smAndDown }]"
          @click="startConversation"
        >
          Summarize content
        </p>
      </div>
      <VForm class="chat-log-message-form mb-5" @submit.prevent="sendMessage">
        <VTextField
          v-model="msg"
          :disabled="memory.isSavingMessageLoading"
          variant="solo"
          class="chat-message-input"
          placeholder="Type your message..."
          density="default"
          autofocus
        >
          <template #append-inner>
            <IconBtn
              v-if="!memory.isSavingMessageLoading"
              class="me-2"
              @click="refInputEl?.click()"
            >
              <VIcon icon="tabler-send" />
            </IconBtn>
            <VProgressCircular
              v-else
              class="me-2"
              size="25"
              indeterminate
              color="primary"
            />
          </template>
        </VTextField>
      </VForm>
    </VMain>
  </VLayout>
</template>

<route lang="yaml">
meta:
  layoutWrapperClasses: layout-content-height-fixed
</route>

<style lang="scss">
@use '@styles/variables/_vuetify.scss';
@use '@core/scss/base/_mixins.scss';
@use '@layouts/styles/mixins' as layoutsMixins;

// Variables
$chat-app-header-height: 62px;

// Placeholders
%chat-header {
  display: flex;
  align-items: center;
  min-block-size: $chat-app-header-height;
  padding-inline: 1rem;
}

.chat-app-layout {
  border-radius: vuetify.$card-border-radius;

  @include mixins.elevation(vuetify.$card-elevation);

  $sel-chat-app-layout: &;

  @at-root {
    .skin--bordered {
      @include mixins.bordered-skin($sel-chat-app-layout);
    }
  }

  .active-chat-user-profile-sidebar,
  .user-profile-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }

  .chat-list-header,
  .active-chat-header {
    @extend %chat-header;
  }

  .chat-list-search {
    .v-field__outline__start {
      flex-basis: 20px !important;
      border-radius: 28px 0 0 28px !important;
    }

    .v-field__outline__end {
      border-radius: 0 28px 28px 0 !important;
    }

    @include layoutsMixins.rtl {
      .v-field__outline__start {
        flex-basis: 20px !important;
        border-radius: 0 28px 28px 0 !important;
      }

      .v-field__outline__end {
        border-radius: 28px 0 0 28px !important;
      }
    }
  }

  .chat-list-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }
}

.chat-content-container {
  /* stylelint-disable-next-line value-keyword-case */
  background-color: #f5f5f5;

  // Adjust the padding so text field height stays 48px
  .chat-message-input {
    .v-field__append-inner {
      align-items: center;
      padding-block-start: 0;
    }

    .v-field--appended {
      padding-inline-end: 9px;
    }
  }
}

.chat-user-profile-badge {
  .v-badge__badge {
    /* stylelint-disable liberty/use-logical-spec */
    min-width: 12px !important;
    height: 0.75rem;
    /* stylelint-enable liberty/use-logical-spec */
  }
}
</style>
