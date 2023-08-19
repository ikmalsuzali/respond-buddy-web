<script lang="ts" setup>
import type { CustomInputContent, GridColumn } from '@core/types'

interface Props {
  selectedRadio: string
  radioContent: CustomInputContent[]
  gridColumn?: GridColumn
}

interface Emit {
  (e: 'update:selectedRadio', value: string): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const selectedOption = ref(structuredClone(toRaw(props.selectedRadio)))

watch(selectedOption, () => {
  emit('update:selectedRadio', selectedOption.value)
})
</script>

<template>
  <VRadioGroup v-if="props.radioContent" v-model="selectedOption">
    <VRow dense>
      <VCol
        v-for="item in props.radioContent"
        :key="item.title"
        v-bind="gridColumn"
      >
        <VLabel
          class="custom-input rounded cursor-pointer"
          :class="selectedOption === item.value ? 'active' : ''"
          style="width: 100%; padding: 0.5rem 0.75rem"
        >
          <slot :item="item">
            <div class="d-flex gap-2">
              <div>
                <VRadio :value="item.value" />
              </div>
              <VIcon v-bind="item.icon" class="text-high-emphasis" />
              <div>
                <h6 class="text-base" style="">
                  {{ item.title }}
                </h6>
                <p class="text-sm mb-0 clamp-text">
                  {{ item.desc }}
                </p>
              </div>
            </div>
          </slot>
        </VLabel>
      </VCol>
    </VRow>
  </VRadioGroup>
</template>

<style lang="scss" scoped>
.custom-radio-icon {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  .v-radio {
    margin-block-end: -0.25rem;
  }

  .cr-title {
    font-weight: 500;
  }
}
</style>

<style lang="scss">
.custom-radio-icon {
  .v-radio {
    margin-block-end: -0.25rem;

    .v-selection-control__wrapper {
      margin-inline-start: 0;
    }
  }
}
</style>
