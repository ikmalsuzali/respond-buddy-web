<script setup lang="ts">
import avatar1 from '@images/avatars/avatar-1.png'
import avatar10 from '@images/avatars/avatar-10.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'
import avatar6 from '@images/avatars/avatar-6.png'
import avatar7 from '@images/avatars/avatar-7.png'
import avatar8 from '@images/avatars/avatar-8.png'
import avatar9 from '@images/avatars/avatar-9.png'
import girlUsingMobile from '@images/pages/girl-using-mobile.png'

interface Permission {
  name: string
  read: boolean
  write: boolean
  create: boolean
}

interface RoleDetails {
  name: string
  permissions: Permission[]
}

interface Roles {
  role: string
  users: string[]
  details: RoleDetails
}

// 👉 Roles List
const roles = ref<Roles[]>([
  {
    role: 'Text',
  },
  {
    role: 'Slack',
    users: [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7],
    details: {
      name: 'Manager',
      permissions: [
        {
          name: 'Reporting',
          read: true,
          write: true,
          create: false,
        },
        {
          name: 'Payroll',
          read: true,
          write: true,
          create: true,
        },
        {
          name: 'User Management',
          read: true,
          write: true,
          create: true,
        },
      ],
    },
  },
  {
    role: 'Discord',
    users: [avatar1, avatar2, avatar3, avatar4, avatar5],
    details: {
      name: 'Users',
      permissions: [
        {
          name: 'User Management',
          read: true,
          write: false,
          create: false,
        },
        {
          name: 'Content Management',
          read: true,
          write: false,
          create: false,
        },
        {
          name: 'Disputes Management',
          read: true,
          write: false,
          create: false,
        },
        {
          name: 'Database Management',
          read: true,
          write: false,
          create: false,
        },
      ],
    },
  },
  {
    role: 'Support',
    users: [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6],
    details: {
      name: 'Support',
      permissions: [
        {
          name: 'Repository Management',
          read: true,
          write: true,
          create: false,
        },
        {
          name: 'Content Management',
          read: true,
          write: true,
          create: false,
        },
        {
          name: 'Database Management',
          read: true,
          write: true,
          create: false,
        },
      ],
    },
  },
  {
    role: 'Restricted User',
    users: [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9, avatar10],
    details: {
      name: 'Restricted User',
      permissions: [
        {
          name: 'User Management',
          read: true,
          write: false,
          create: false,
        },
        {
          name: 'Content Management',
          read: true,
          write: false,
          create: false,
        },
        {
          name: 'Disputes Management',
          read: true,
          write: false,
          create: false,
        },
        {
          name: 'Database Management',
          read: true,
          write: false,
          create: false,
        },
      ],
    },
  },
])

const isRoleDialogVisible = ref(false)

const roleDetail = ref<RoleDetails>()

const isAddRoleDialogVisible = ref(false)

const editPermission = (value: RoleDetails) => {
  isRoleDialogVisible.value = true
  roleDetail.value = value
}
</script>

<template>
  <VRow>
    <!-- 👉 Roles -->
    <VCol
      v-for="item in roles"
      :key="item.role"
      cols="12"
      sm="6"
      lg="3"
    >
      <VCard>
        <VCardText class="d-flex align-center pb-1">
          <h4 class="text-h4">
            {{ item.role }}
          </h4>
          <VSpacer />

          <div class="v-avatar-group">
          
            <VIcon
              size="20"
              class="enter-icon text-disabled"
            
            >
            <svg viewBox="0 0 128 128">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0 64c0 51.617 12.383 64 64 64 51.617 0 64-12.383 64-64 0-51.617-12.383-64-64-64C12.383 0 0 12.383 0 64zm25.808 13.295l20.075-45.621C49.27 23.984 55.788 19.813 64 19.813c8.212 0 14.729 4.17 18.118 11.86l20.074 45.622c.912 2.216 1.694 5.084 1.694 7.56 0 11.34-7.951 19.291-19.292 19.291-3.862 0-6.93-.985-10.035-1.983-3.182-1.022-6.403-2.057-10.559-2.057-4.108 0-7.408 1.044-10.653 2.071-3.138.993-6.225 1.969-9.941 1.969-11.34 0-19.292-7.95-19.292-19.29 0-2.477.783-5.345 1.695-7.561zM64 39.625l-19.813 44.84c5.866-2.738 12.644-4.041 19.813-4.041 6.909 0 13.947 1.303 19.552 4.04L64 39.626z" fill="#5A45FF"></path>
</svg>
            </VIcon>
           
          </div>
        </VCardText>

        <VCardText class="pb-5">
         
          <div class="d-flex align-center">

            <a
              href="javascript:void(0)"
              @click="editPermission(item.details)"
            >
              Connect
            </a>

            <VSpacer />
            <VBtn
              icon
              color="disabled"
              variant="text"
              size="x-small"
            >
              <VIcon
                size="24"
                icon="tabler-link"
              />
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VCol>

  
  </VRow>

  <AddEditRoleDialog
    v-model:is-dialog-visible="isRoleDialogVisible"
    v-model:role-permissions="roleDetail"
  />
</template>
