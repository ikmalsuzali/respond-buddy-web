<script setup lang="ts">
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'onDelete'): void
}
interface Props {
  isDialogVisible: boolean
  deleteMethods: any[]
}

const props = withDefaults(defineProps<Props>(), {
  isDialogVisible: false,
})

const emit = defineEmits<Emit>()

const selectedMethod = ref('cancel')

const onSubmitClick = () => {
  console.log('🚀 ~ file: deleteDialog.vue:44 ~ onSubmitClick ~ onSubmitClick:')

  if (selectedMethod.value[0] === 'cancel') {
    emit('update:isDialogVisible', false)
  }
  if (selectedMethod.value[0] === 'delete') {
    emit('onDelete')
  }
}
</script>

<template>
  <VDialog
    max-width="787"
    :model-value="props.isDialogVisible"
    @update:model-value="(val) => $emit('update:isDialogVisible', val)"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="$emit('update:isDialogVisible', false)" />

    <VCard class="pa-5 pa-sm-8">
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-3">
          Are you sure you want to delete?
        </VCardTitle>
        <!-- <VCardSubtitle>
          <span class="text-base">
            You also need to select a method by which the proxy authenticates to
            the directory serve.
          </span>
        </VCardSubtitle> -->
      </VCardItem>

      <VCardText>
        <VList
          v-model:selected="selectedMethod"
          mandatory
          variant="outlined"
          class="card-list auth-method-card"
          :class="$vuetify.display.xs ? 'responsive-card' : ''"
        >
          <VListItem
            v-for="item of props.deleteMethods"
            :key="item.title"
            rounded
            :value="item.method"
            class="py-5 px-6 my-6"
            :class="
              selectedMethod[0] === item.method && 'bg-light-error text-error'
            "
          >
            <template #prepend>
              <VIcon :icon="item.icon" size="38" />
            </template>

            <VListItemTitle class="mb-2">
              <span class="text-xl font-weight-medium">
                {{ item.title }}
              </span>
            </VListItemTitle>
            <p class="text-base mb-0">
              {{ item.subtitle }}
            </p>
          </VListItem>
        </VList>

        <div class="d-flex gap-4 justify-center">
          <VBtn @click="onSubmitClick">Submit</VBtn>
          <VBtn
            color="secondary"
            variant="tonal"
            @click="$emit('update:isDialogVisible', false)"
          >
            Close
          </VBtn>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.auth-method-card {
  &.card-list .v-list-item {
    padding-block: 20px !important;
    padding-inline: 30px !important;
  }

  .v-list-item--active {
    background-color: transparent !important;

    .v-list-item__overlay {
      opacity: 0;
    }
  }

  &.responsive-card {
    .v-list-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;

      .v-list-item__prepend {
        svg {
          margin: 0;
        }
      }
    }
  }
}
</style>
