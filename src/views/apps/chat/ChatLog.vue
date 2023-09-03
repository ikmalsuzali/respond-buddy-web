<script lang="ts" setup>
import { useChatStore } from '@/views/apps/chat/useChatStore'
import { useMemoryStore } from '../memory/useMemoryStore'

const store = useChatStore()
const memory = useMemoryStore()

const contact = computed(() => ({
  id: store.activeChat?.contact.id,
  avatar: store.activeChat?.contact.avatar,
}))

const formattedText = (text: string) => {
  return text.replace(/\n/g, '<br>').replace(/```/g, '&#96;&#96;&#96;') // Replace \n with <br> and ``` with &#96;&#96;&#96; for rendering line breaks and backticks
}

// Feedback icon
// const resolveFeedbackIcon = (
//   feedback: ChatOut['messages'][number]['feedback']
// ) => {
//   if (feedback.isSeen) return { icon: 'tabler-checks', color: 'success' }
//   else if (feedback.isDelivered)
//     return { icon: 'tabler-checks', color: undefined }
//   else return { icon: 'tabler-check', color: undefined }
// }

const messages = computed(() => {
  // @ts-ignore
  return memory.selectedMemoryChat[memory.selectedMemory.id]
})


const msgGroups = computed(() => {
  const _msgGroups: any = []

  let msgGroup = {
    messages: [],
  }

  console.log(messages.value)

  if (messages.value?.length == 0) return []

  messages.value?.forEach((msg: any, index: number) => {
    msgGroup = {
      senderId: msg.customer,
      messages: [
        {
          senderId: msg.customer,
          message: msg.content,
          time: msg.created_at,
          // feedback: msg.feedback,
        },
      ],
    }
    _msgGroups.push(msgGroup)

    // if (index === messages.length - 1) _msgGroups.push(msgGroup)
  })

  return _msgGroups
})
</script>

<template>
  <div class="chat-log">
    <div
      v-for="(msgGrp, index) in msgGroups"
      :key="index"
      style="border-bottom: 1px solid rgb(235, 234, 226)"
      class="chat-group d-flex align-start pa-5"
      :class="msgGrp.senderId ? 'sender-msg-container' : 'bot-msg-container'"
    >
      <div class="me-4">
        <VAvatar
          v-if="msgGrp.senderId"
          icon="tabler-user"
          style="border-radius: 4px !important; background-color: #ffa726"
          rounded="0"
          size="32"
        >
        </VAvatar>
        <VAvatar
          v-else
          style="border-radius: 4px !important; background-color: #bdbdbd"
          rounded="0"
          size="32"
        >
          RB
        </VAvatar>
      </div>
      <div
        class="chat-body d-inline-flex flex-column"
        :class="msgGrp.senderId ? 'align-end' : 'align-start'"
      >
        <p
          v-for="(msgData, msgIndex) in msgGrp.messages"
          :key="msgData.time"
          class="py-1 px-1 chat-font"
          :class="[msgGrp.messages.length - 1 !== msgIndex ? 'mb-3' : 'mb-1']"
          style="line-height: 1.7"
        >
         <pre class="formatted-text" v-html="formattedText(msgData.message)"></pre>
        </p>
        <div :class="{ 'text-right': msgGrp.senderId }">
          <!-- <VIcon
            v-if="msgGrp.senderId !== contact.id"
            size="18"
            :color="
              resolveFeedbackIcon(
                msgGrp.messages[msgGrp.messages.length - 1].feedback
              ).color
            "
          >
            {{
              resolveFeedbackIcon(
                msgGrp.messages[msgGrp.messages.length - 1].feedback
              ).icon
            }}
          </VIcon> -->
          <!-- <span class="text-sm ms-1 text-disabled">{{
            formatDate(msgGrp.messages[msgGrp.messages.length - 1].time, {
              hour: 'numeric',
              minute: 'numeric',
            })
          }}</span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.chat-log {
  .chat-content {
    border-end-end-radius: 6px;
    border-end-start-radius: 6px;

    &.chat-left {
      border-start-end-radius: 6px;
    }

    &.chat-right {
      border-start-start-radius: 6px;
    }
  }
}

.chat-font {
  font-style: normal;
  font-size: 14px;
  font-weight: 400;
  color: #212121;
}

.sender-msg-container {
  background-color: white;
}

.bot-msg-container {
  background-color: rgb(250, 249, 246);
  padding: 8px;
}

.formatted-text {
  white-space: pre-wrap; /* Preserve whitespace and wrap long lines */
  font-style: normal;
  font-size: 14px;
  font-weight: 400;
  font-family: 'Public Sans', sans-serif !important;
  color: #212121;
}
</style>
