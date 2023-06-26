<script lang="ts" setup>
import { useDropzone } from "vue3-dropzone";
import axios from '@axios';



interface Emit {
  (e: 'update:isDialogVisible', val: boolean): void
}

interface Prop {
  isDialogVisible: boolean
  memory: any
}
const props = defineProps<Prop>()
const emit = defineEmits<Emit>()
const currentTab = ref(props.memory?.fields?.types?.[0])
const files = ref([])
const input = ref()
const isLoading = ref(false)

const onDrop = (acceptFiles, rejectReasons) => {
  console.log(rejectReasons)
      let mappedFiles = acceptFiles.map((file) => {
        return {
          id: uuidv4(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          file: file,
          data: null,
        };
      });
      files.value = [...files.value, ...mappedFiles]
      saveFiles(mappedFiles)
}

const saveFiles = (savingFiles) => {
  console.log(savingFiles)
      const formData = new FormData(); // pass data as a form
      for (var i = 0; i < savingFiles.length; i++) {
        const savedFile = savingFiles[i];
        // append files as array to the form, feel free to change the array name
        formData.append("file", savedFile.file);
      
      // post the formData to your backend where storage is processed. In the backend, you will need to loop through the array and save each file through the loop.
      axios
        .post('/v1/file/upload', formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.info(response.data);
          console.log(savedFile)
          console.log(i)
          console.log(savingFiles[i])
          const foundFileIndex = files.value.findIndex((_file) => _file.id == savedFile?.id);
          console.log(foundFileIndex)
          files.value[foundFileIndex] = {
            ...files.value[foundFileIndex],
            data: response.data
          }

          
        })
        .catch((err) => {
          console.error(err);
        });
    };
  }

  const getFileSize = (file) => {
  // Check if the File API is supported
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var fileSize = file.size; // File size in bytes

    // Convert bytes to kilobytes (KB)
    var fileSizeKB = fileSize / 1024;
    
    // Convert kilobytes to megabytes (MB)
    var fileSizeMB = fileSizeKB / 1024;

    // Convert megabytes to gigabytes (GB)
    var fileSizeGB = fileSizeMB / 1024;

    // Return the file size in the appropriate unit
    if (fileSizeGB >= 1) {
      return fileSizeGB.toFixed(2) + " GB";
    } else if (fileSizeMB >= 1) {
      return fileSizeMB.toFixed(2) + " MB";
    } else {
      return fileSizeKB.toFixed(2) + " KB";
    }
  } else {
    // File API not supported
    return "File API not supported in this browser.";
  }
}

const onSave = () => {
  console.log("🚀 ~ file: index.vue:61 ~ getStores ~ res", 'save')

  // if (checkIfAllFilesHaveBeenUploaded() && currentTab.value === 'upload') return
  saveStores()
}

const saveStores = () => {
  isLoading.value = false
  let data = {}
  if (currentTab.value === 'upload'){
    console.log(files.value?.[0])
    data = {
      type: 's3_url',
      s3_url: files.value?.[0]?.data?.url
    }
  } else if (currentTab.value === 'input'){
    data = {
      type: 'raw',
      text: input.value,
    }
  } else if (currentTab.value === 'url'){
    data = {
      type: 'url',
      urls: urls.value.map((url) => url.value),
    }
  }

  axios.post('/v1/store', data)
    .then(res => {
      console.log("🚀 ~ file: index.vue:61 ~ getStores ~ res", res)
      emit('update:isDialogVisible', false)
    })
    .catch(e => {
      const error = e?.response?.data || {}
    }).finally(() => {
      isLoading.value = false
    })

}

const checkIfAllFilesHaveBeenUploaded = () => {
  const filesWithNoData = files.value.filter((file) => !file.data)
  if (filesWithNoData.length > 0) {
    console.log('not all files have been uploaded')
    return false
  }
  console.log('all files have been uploaded')
  return true
}

const areFilesMatching = (file1, file2) => {
  // Compare file names
  if (file1.name !== file2.name) {
    return false;
  }

  // Compare file sizes
  if (file1.size !== file2.size) {
    return false;
  }

  // Compare file types
  if (file1.type !== file2.type) {
    return false;
  }

  return true;
}

const removeFile = (index) => {
  files.value.splice(index, 1);
}

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var randomValue = Math.random() * 16 | 0;
    var value = c === 'x' ? randomValue : (randomValue & 0x3 | 0x8);
    return value.toString(16);
  });
}


const { getRootProps, getInputProps, ...rest } = useDropzone({ onDrop,
   accept: ['.doc', '.docx', '.pdf', '.txt', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.msexcel', 'application/octet-stream'],
  maxFiles: 1,
  maxSize: 5000000,
 });


</script>

<template>
  <VDialog
    :model-value="props.isDialogVisible"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >

    <!-- Dialog Content -->
    <VCard>
      <!-- Toolbar -->
      <div>
        <VToolbar color="primary">
          <VBtn
            icon
            variant="plain"
            @click="emit('update:isDialogVisible', false)"
          >
            <VIcon
              color="white"
              icon="tabler-x"
            />
          </VBtn>

          <VToolbarTitle>{{props.memory?.name}}</VToolbarTitle>

          <VSpacer />

          <!-- <VToolbarItems>
            <VBtn
              variant="text"
              @click="emit('update:isDialogVisible', false)"
            >
              Save
            </VBtn>
          </VToolbarItems> -->
        </VToolbar>
      </div>

    <VTabs v-model="currentTab">
      <VTab v-if="props.memory?.fields?.types?.includes('upload')" value="upload">Upload</VTab>
      <VTab v-if="props.memory?.fields?.types?.includes('input')" value="input">Content</VTab>
      <VTab v-if="props.memory?.fields?.types?.includes('system_excel')" value="system_excel">Sheet</VTab>
      <!-- <VTab value="setting">Setting</VTab> -->
    </VTabs>

    <VCardText>
      <VWindow v-if="currentTab === 'upload'">

    <div  class="d-flex justify-center flex-column">
      <VCard v-bind="getRootProps()" class="w-50 mt-10 pa-2 py-4 text-center" style="align-self:center">
        <input v-bind="getInputProps()" />

    <VCardText class="d-flex flex-column pb-0" >
      <VAvatar
        size="42"
        variant="tonal"
        icon="tabler-upload"
        class="mb-3"
        color="primary"
      />

      <h6 class="text-lg font-weight-medium">
        {{ 'Upload file(s)' }}
      </h6>
      <span class="text-sm">{{ 'Attach a file below' }}</span>
      <div class="pa-10 ma-6 text-center rounded-lg upload-area">
      <VAvatar
        size="42"
        variant="tonal"
        icon="tabler-file"
        class="mb-3"
        color="secondary"
      />
      <h6 class="text-lg font-weight-medium">
        {{ 'Drag file(s) here to upload' }}
      </h6>
      <span class="upload-area-description">
				Alternatively, you can select a file by <br/><strong>clicking here</strong>
			</span>
    </div>

    <VList @click.stop="">
      <VListSubheader>Files {{ files.value?.length }}</VListSubheader>
      
      <VListItem
        v-for="(file, i) in files"
        :key="i"
        color="primary"
        rounded="xl"
      >

        <template v-slot:prepend>
          <v-icon icon="tabler-file"></v-icon>
        </template>
        <VListItemTitle class="font-weight-medium" style="text-align: left">
          {{ file.name || 'File 1' }}
        </VListItemTitle>
        <template #append>
            <span class="font-weight-medium text-medium-emphasis me-3">{{ getFileSize(file.file)}}</span>
            <VProgressCircular
            v-if="!file.data"
            indeterminate
            color="yellow"
              width="3"
              size="28"
            />         
            <VBtn
              v-else
              density="compact"
              icon="tabler-trash"
              color="red"
              @click="removeFile(i)"
              /> 
          </template>
      </VListItem>
    </VList>

    <VBtn
      :block="true"
        @click.stop="onSave"
      >
        Save
      </VBtn>
    

    </VCardText>

 

  </VCard>

  </div>

  
  
         </VWindow>
      <VWindow v-if="currentTab === 'input'">
        <div  class="d-flex justify-center flex-column">
      <VCard v-bind="getRootProps()" class="w-50 mt-10 pa-2 py-4 text-center" style="align-self:center">
        <VCardText class="d-flex flex-column pb-0" >
      <VAvatar
        size="42"
        variant="tonal"
        icon="tabler-pencil"
        class="mb-3"
        color="primary"
      />

      <h6 class="text-lg font-weight-medium my-5">
        {{ 'Write text and store into memory' }}
      </h6>
      <AppTextarea
    v-model="input"
    auto-grow
    persistent-clear
  />

     
  <VBtn
      class="mt-5"
      :block="true"
        @click.stop="onSave"
      >
        Save
      </VBtn>
    
      
      </VCardText>
      </VCard>
    
        </div>
        
     
      </VWindow>
      <VWindow v-if="currentTab === 'setting'">
        hi this is setting
       
      </VWindow>
    </VCardText>
      

      

    
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}

.upload-area {
	margin-top: 1.25rem;
	border: none;
	background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23ccc' stroke-width='3' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
	background-color: transparent;
	padding: 3rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	&:hover, &:focus {
			background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%232e44ff' stroke-width='3' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
	}
} 



</style>
