<script lang="ts" setup>
import { useAccountStore } from '@/views/apps/account/useAccountStore.ts'

const accountStore = useAccountStore()
const isConfirmDialogOpen = ref(false)
accountStore.getItem()
const accountDataLocal = ref(accountStore.accountDetails)

const onSaveClick = async () => {
  await accountStore.updateItem(accountDataLocal.value)
}

const onPasswordResetClick = async () => {
  await accountStore.resetPassword()
}
// const isAccountDeactivated = ref(false)

// const validateAccountDeactivation = [
//   (v: string) => !!v || 'Please confirm account deactivation',
// ]
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Profile Details">
        <VDivider />

        <VCardText class="pt-2">
          <!-- 👉 Form -->
          <VForm class="mt-6">
            <VRow>
              <!-- 👉 First Name -->
              <VCol md="6" cols="12">
                <AppTextField
                  v-model="accountDataLocal.firstName"
                  label="First Name"
                />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol md="6" cols="12">
                <AppTextField
                  v-model="accountDataLocal.lastName"
                  label="Last Name"
                />
              </VCol>

              <!-- 👉 Username -->
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="accountDataLocal.username"
                  label="Username"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="12" md="6">
                <AppTextField
                  disabled
                  :value="accountDataLocal.email"
                  label="E-mail"
                  type="email"
                />
              </VCol>

              <!-- 👉 Organization -->
              <!-- <VCol cols="12" md="6">
                <AppTextField
                  v-model="accountDataLocal.org"
                  label="Organization"
                />
              </VCol> -->

              <!-- 👉 Phone -->
              <!-- <VCol cols="12" md="6">
                <AppTextField
                  v-model="accountDataLocal.phone"
                  label="Phone Number"
                />
              </VCol> -->

              <!-- 👉 Address -->
              <!-- <VCol cols="12" md="6">
                <AppTextField
                  v-model="accountDataLocal.address"
                  label="Address"
                />
              </VCol> -->

              <!-- 👉 State -->
              <!-- <VCol cols="12" md="6">
                <AppTextField v-model="accountDataLocal.state" label="State" />
              </VCol> -->

              <!-- 👉 Zip Code -->
              <!-- <VCol cols="12" md="6">
                <AppTextField v-model="accountDataLocal.zip" label="Zip Code" />
              </VCol> -->

              <!-- 👉 Country -->
              <!-- <VCol cols="12" md="6">
                <AppSelect
                  v-model="accountDataLocal.country"
                  label="Country"
                  :items="['USA', 'Canada', 'UK', 'India', 'Australia']"
                />
              </VCol> -->

              <!-- 👉 Language -->
              <!-- <VCol cols="12" md="6">
                <AppSelect
                  v-model="accountDataLocal.language"
                  label="Language"
                  :items="['English']"
                />
              </VCol> -->

              <!-- 👉 Timezone -->
              <!-- <VCol cols="12" md="6">
                <AppSelect
                  v-model="accountDataLocal.timezone"
                  label="Timezone"
                  :items="timezones"
                  :menu-props="{ maxHeight: 200 }"
                />
              </VCol> -->

              <!-- 👉 Currency -->
              <!-- <VCol cols="12" md="6">
                <AppSelect
                  v-model="accountDataLocal.currency"
                  label="Currency"
                  :items="currencies"
                  :menu-props="{ maxHeight: 200 }"
                />
              </VCol> -->

              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn :loading="accountStore.isLoading" @click="onSaveClick"
                  >Save changes</VBtn
                >
                <VBtn color="secondary" @click="onPasswordResetClick"
                  >Password Reset</VBtn
                >

                <!-- <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  @click.prevent="resetForm"
                >
                  Reset
                </VBtn> -->
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard title="Logout Account">
        <VCardText>
          <VBtn color="error" class="mt-3" @click="accountStore.logout">
            Logout
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <!-- Confirm Dialog -->
  <ConfirmDialog
    v-model:isDialogVisible="isConfirmDialogOpen"
    confirmation-question="Are you sure you want to deactivate your account?"
    confirm-title="Deactivated!"
    confirm-msg="Your account has been deactivated successfully."
    cancel-title="Cancelled"
    cancel-msg="Account Deactivation Cancelled!"
  />
</template>
