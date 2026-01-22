<script setup>
definePageMeta({ layout: 'default' })

// Section 1: Data Fetching
const { data: instructors, pending, refresh } = await useFetch('http://localhost:1337/api/instructors')

// Section 2: UI States
const search = ref('')
const dialog = ref(false)
const dialogDelete = ref(false)
const dialogSuccess = ref(false)
const dialogError = ref(false)
const saving = ref(false)
const statusMessage = ref('')

// Section 3: Popup Handlers
const showSuccess = (msg) => {
  statusMessage.value = msg
  dialogSuccess.value = true
}

const showError = (msg) => {
  statusMessage.value = msg
  dialogError.value = true
}

// Section 4: Form State
const editedItem = ref({
  documentId: '',
  FirstName: '',
  LastName: '',
  Email: '',
  Department: ''
})

const headers = [
  { title: 'ID', key: 'id', align: 'start' },
  { title: 'First Name', key: 'FirstName' }, 
  { title: 'Last Name', key: 'LastName' },   
  { title: 'Email', key: 'Email' },          
  { title: 'Department', key: 'Department' },          
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

// Section 5: Methods
const openAdd = () => {
  editedItem.value = { documentId: '', FirstName: '', LastName: '', Email: '', Department: '' }
  dialog.value = true
}

const editInstructor = (item) => {
  editedItem.value = { 
    documentId: item.documentId, 
    FirstName: item.FirstName, 
    LastName: item.LastName, 
    Email: item.Email,
    Department: item.Department
  }
  dialog.value = true
}

const close = () => {
  dialog.value = false
  nextTick(() => {
    editedItem.value = { documentId: '', FirstName: '', LastName: '', Email: '', Department: '' }
  })
}

const saveInstructor = async () => {
  if (!editedItem.value.FirstName || !editedItem.value.LastName || !editedItem.value.Department) {
    showError("Please fill in the required fields.")
    return
  }

  saving.value = true
  const isUpdate = !!editedItem.value.documentId
  const url = isUpdate 
    ? `http://localhost:1337/api/instructors/${editedItem.value.documentId}` 
    : 'http://localhost:1337/api/instructors'

  try {
    await $fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      body: { 
        data: {
          FirstName: editedItem.value.FirstName,
          LastName: editedItem.value.LastName,
          Email: editedItem.value.Email,
          Department: editedItem.value.Department
        } 
      }
    })
    await refresh()
    close()
    showSuccess(isUpdate ? 'Instructor Profile Updated!' : 'New Instructor Added!')
  } catch (error) {
    showError('Operation failed. Please check your Strapi connection.')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (instructor) => {
  editedItem.value = { ...instructor }
  dialogDelete.value = true
}

const deleteInstructorConfirm = async () => {
  saving.value = true
  try {
    await $fetch(`http://localhost:1337/api/instructors/${editedItem.value.documentId}`, { method: 'DELETE' });
    await refresh();
    dialogDelete.value = false
    showSuccess('Instructor Record Removed!')
  } catch (error) {
    showError('Could not delete instructor.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="pa-6">
    <v-row class="mb-6 d-flex align-center">
      <v-col>
        <h1 class="text-h4 font-weight-bold text-white">Instructor Management</h1>
        <p class="text-subtitle-2 text-grey-lighten-1">Manage and edit instructor records</p>
      </v-col>
      <v-col class="text-right">
        <v-btn color="blue" prepend-icon="mdi-plus" @click="openAdd" rounded="lg" class="text-none px-6" elevation="4">
          ADD INSTRUCTOR
        </v-btn>
      </v-col>
    </v-row>

    <v-text-field 
      v-model="search" 
      prepend-inner-icon="mdi-magnify" 
      label="Search faculty members..." 
      variant="outlined" 
      class="glass-search mb-8" 
      hide-details 
      clearable 
    />

    <v-card class="glass-table-card" elevation="0">
      <v-data-table 
        :headers="headers" 
        :items="instructors?.data || []" 
        :loading="pending" 
        :search="search" 
        theme="dark" 
        class="glass-table"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon size="small" class="me-4" color="blue-lighten-2" @click="editInstructor(item)">mdi-pencil</v-icon>
          <v-icon size="small" color="red-lighten-2" @click="confirmDelete(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="550" persistent>
      <v-card class="glass-modal-modern pa-8">
        <div class="text-center mb-6">
          <div class="icon-glow mb-2">
            <v-icon size="48" color="blue-lighten-2">mdi-account-tie-outline</v-icon>
          </div>
          <h2 class="text-h5 font-weight-bold text-white">{{ editedItem.documentId ? 'Update Faculty' : 'New Instructor' }}</h2>
          <p class="text-caption text-grey-lighten-1">Modify instructor details in the system</p>
        </div>

        <v-card-text class="px-0">
          <v-text-field v-model="editedItem.FirstName" label="First Name" variant="outlined" class="custom-field mb-4" hide-details />
          <v-text-field v-model="editedItem.LastName" label="Last Name" variant="outlined" class="custom-field mb-4" hide-details />
          <v-text-field v-model="editedItem.Email" label="Email Address" variant="outlined" class="custom-field mb-4" hide-details />
          <v-text-field v-model="editedItem.Department" label="Department" variant="outlined" class="custom-field" hide-details />
        </v-card-text>

        <v-card-actions class="px-0 pt-6">
          <v-btn variant="text" color="grey-lighten-1" class="text-none" @click="close">CANCEL</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue" variant="elevated" rounded="lg" class="text-none px-8" :loading="saving" @click="saveInstructor">
            {{ editedItem.documentId ? 'Update Now' : 'Add Now' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="450">
      <v-card class="glass-modal-modern pa-8 text-center">
        <v-avatar color="red-lighten-4" size="80" class="mb-4">
          <v-icon size="48" color="red-darken-2">mdi-alert-circle-outline</v-icon>
        </v-avatar>
        <h2 class="text-h5 text-white font-weight-bold mb-2">Confirm Delete</h2>
        <p class="text-body-1 text-grey-lighten-1 mb-8">
          Are you sure you want to remove <br>
          <strong class="text-white">{{ editedItem.FirstName }} {{ editedItem.LastName }}</strong>?
        </p>
        <div class="d-flex justify-center gap-4">
          <v-btn variant="text" color="white" @click="dialogDelete = false">NO, KEEP IT</v-btn>
          <v-btn color="red-darken-1" variant="elevated" rounded="lg" class="px-6" @click="deleteInstructorConfirm">YES, DELETE</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogSuccess" max-width="400" persistent>
      <v-card class="glass-modal-modern pa-8 text-center border-success">
        <v-avatar color="green-lighten-4" size="80" class="mb-4 icon-glow-green">
          <v-icon size="48" color="green-darken-2">mdi-check-circle</v-icon>
        </v-avatar>
        <h2 class="text-h5 font-weight-bold text-white mb-2">Success!</h2>
        <p class="text-body-1 text-grey-lighten-1 mb-6">{{ statusMessage }}</p>
        <v-btn color="green-darken-1" block size="large" rounded="lg" class="text-white" @click="dialogSuccess = false">
          AWESOME
        </v-btn>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogError" max-width="400">
      <v-card class="glass-modal-modern pa-8 text-center border-error">
        <v-avatar color="red-lighten-4" size="80" class="mb-4 icon-glow-red">
          <v-icon size="48" color="red-darken-2">mdi-close-circle</v-icon>
        </v-avatar>
        <h2 class="text-h5 font-weight-bold text-white mb-2">Oops!</h2>
        <p class="text-body-1 text-grey-lighten-1 mb-6">{{ statusMessage }}</p>
        <v-btn color="red-darken-1" block size="large" rounded="lg" @click="dialogError = false">TRY AGAIN</v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.glass-search :deep(.v-field) {
  background: rgba(255, 255, 255, 0.05) !important;
  border-radius: 16px !important;
  color: white !important;
}
.glass-search :deep(.v-field__input), 
.glass-search :deep(.v-label),
.glass-search :deep(.v-field__prepend-inner .v-icon) {
  color: white !important;
  opacity: 1 !important;
}

.glass-modal-modern {
  background: rgba(18, 18, 18, 0.9) !important;
  backdrop-filter: blur(25px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 32px !important;
}
.border-success { border: 1px solid rgba(76, 175, 80, 0.3) !important; }
.border-error { border: 1px solid rgba(244, 67, 54, 0.3) !important; }

.icon-glow {
  display: inline-block;
  padding: 15px;
  background: rgba(33, 150, 243, 0.1);
  border-radius: 20px;
}
.icon-glow-green { box-shadow: 0 0 20px rgba(76, 175, 80, 0.2); }
.icon-glow-red { box-shadow: 0 0 20px rgba(244, 67, 54, 0.2); }

.custom-field :deep(.v-field) {
  background: rgba(255, 255, 255, 0.05) !important;
  border-radius: 12px !important;
  color: white !important;
}

.glass-table-card {
  background: rgba(255, 255, 255, 0.02) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  border-radius: 24px !important;
}
.glass-table { background: transparent !important; }
:deep(.v-data-table-header) { background: rgba(255, 255, 255, 0.05) !important; }
:deep(.v-data-table__th) { color: #64B5F6 !important; font-weight: bold !important; }
</style>