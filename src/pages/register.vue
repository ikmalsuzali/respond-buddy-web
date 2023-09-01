<script setup lang="ts">
import authV2RegisterIllustrationBorderedDark from '@images/pages/auth-v2-register-illustration-bordered-dark.png'
import authV2RegisterIllustrationBorderedLight from '@images/pages/auth-v2-register-illustration-bordered-light.png'
import authV2RegisterIllustrationDark from '@images/pages/auth-v2-register-illustration-dark.png'
import authV2RegisterIllustrationLight from '@images/pages/auth-v2-register-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VForm } from 'vuetify/components/VForm'

import { useAppAbility } from '@/plugins/casl/useAppAbility'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import axios from '@axios'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { emailValidator, requiredValidator } from '@validators'

const refVForm = ref<VForm>()
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const workspaceName = ref('')
const isLoading = ref(false)

const privacyPolicies = ref(true)

// Router
const route = useRoute()
const router = useRouter()

// Ability
const ability = useAppAbility()

// Form Errors
const errors = ref<Record<string, string | undefined>>({
  email: undefined,
  password: undefined,
  confirm_password: undefined,
})

const register = () => {
  isLoading.value = true
  axios
    .post('/v1/signup', {
      email: email.value,
      password: password.value,
      confirm_password: confirmPassword.value,
      username: username.value,
      workspace_name: workspaceName.value,
    })
    .then((res) => {
      const {
        session: accessToken,
        user: userData,
        user_workspace: userWorkspace,
        subscription,
      } = res.data

      const userAbilities = [{ action: 'manage', subject: 'all' }]
      localStorage.setItem('userAbilities', JSON.stringify(userAbilities))
      ability.update(userAbilities)

      localStorage.setItem('userData', JSON.stringify(userData))
      localStorage.setItem('accessToken', JSON.stringify(accessToken))
      localStorage.setItem('userWorkspace', JSON.stringify(userWorkspace))
      localStorage.setItem('subscription', JSON.stringify(subscription))

      // Redirect to `to` query if exist or redirect to index route
      router.replace(route.query.to ? String(route.query.to) : '/')
    })
    .catch((e) => {
      const error = e?.response?.data || {}

      // errors.value = formErrors
      console.error(e.response.data)
    })
    .finally(() => {
      isLoading.value = false
    })
}

const imageVariant = useGenerateImageVariant(
  authV2RegisterIllustrationLight,
  authV2RegisterIllustrationDark,
  authV2RegisterIllustrationBorderedLight,
  authV2RegisterIllustrationBorderedDark,
  true
)

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

const isPasswordVisible = ref(false)

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) register()
  })
}
</script>

<template>
  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol
      lg="8"
      class="d-none d-lg-flex"
      style="background-image: linear-gradient(to top, #e0fff2 44%, #fffea8)"
    >
      <div class="position-relative rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-full h-100">
          <div class="w-full">
            <div class="light text-4xl my-2 text-center">I want to...</div>
            <div class="flex wrap space-x-2 text-center">
              <VChip
                class="ma-2"
                v-for="(item, index) in [
                  { name: 'Summarize' },
                  { name: 'Respond' },
                  { name: 'Translate to Spanish' },
                  { name: 'Store' },
                  { name: 'Recall' },
                  { name: 'Simplify' },
                  { name: 'Translate to Chinese' },
                  { name: 'Send email' },
                  { name: 'Custom Prompts' },
                ]"
                :key="index"
                label
                size="x-large"
                color="success"
                >{{ item.name }}</VChip
              >
            </div>
          </div>
        </div>

        <VImg :src="authThemeMask" class="auth-footer-mask" />
      </div>
    </VCol>

    <VCol cols="12" lg="4" class="d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <VNodeRenderer :nodes="themeConfig.app.logo" class="mb-6" />
          <h5 class="text-h5 mb-1">Future starts here 🚀</h5>
          <p class="mb-0">Streamline and automate your work</p>
        </VCardText>

        <VCardText>
          <VForm ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <!-- Username -->
              <!-- <VCol cols="12" class="py-1">
                <AppTextField
                  v-model="username"
                  autofocus
                  :rules="[requiredValidator, alphaDashValidator]"
                  label="Username"
                />
              </VCol> -->

              <!-- email -->
              <VCol cols="12" class="py-1">
                <AppTextField
                  v-model="email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
                  type="email"
                />
              </VCol>

              <!-- <VCol cols="12" class="py-1">
                <AppTextField
                  v-model="workspaceName"
                  :rules="[requiredValidator]"
                  label="Workspace name"
                />
              </VCol> -->

              <VCol cols="12" class="py-1">
                <AppTextField
                  v-model="password"
                  :rules="[requiredValidator]"
                  label="Password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>

              <VCol cols="12" class="py-1">
                <AppTextField
                  v-model="confirmPassword"
                  :rules="[requiredValidator]"
                  label="Confirm Password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <div class="d-flex align-center mt-2 mb-4">
                  <VCheckbox
                    id="privacy-policy"
                    v-model="privacyPolicies"
                    :rules="[requiredValidator]"
                    inline
                  >
                    <template #label>
                      <span class="me-1">
                        I agree to
                        <a
                          href="/privacy-policy"
                          target="_blank"
                          class="text-primary"
                          >privacy policy</a
                        >
                        and
                        <a
                          href="/terms-of-service"
                          target="_blank"
                          class="text-primary"
                        >
                          terms of service</a
                        >
                      </span>
                    </template>
                  </VCheckbox>
                </div>

                <VBtn block type="submit" :loading="isLoading"> Sign up </VBtn>
              </VCol>

              <!-- create account -->
              <VCol cols="12" class="text-center text-base">
                <span>Already have an account?</span>
                <RouterLink class="text-primary ms-2" :to="{ name: 'login' }">
                  Sign in instead
                </RouterLink>
              </VCol>

              <VCol cols="12" class="d-flex align-center">
                <VDivider />
                <span class="mx-4">or</span>
                <VDivider />
              </VCol>

              <VCol cols="12" class="text-center">
                <AuthProvider />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use '@core/scss/template/pages/page-auth.scss';
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
