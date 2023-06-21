<script setup lang="ts">
import ProfileList from '@/views/apps/profiles/ProfileList.vue';
</script>

<template>
  <VRow>
    <VCol cols="12">
      <h4 class="text-h4 mb-6">
        Profiles
      </h4>
      <p class="mb-0">
        A profile is a user who messages you on one of the integrations we offer (Slack, mail). Profiles can be assigned different .
      </p>
    </VCol>

   
    <VCol cols="12">
      <!-- 👉 User List  -->
      <ProfileList />
    </VCol>
  </VRow>
</template>
