<script setup>
definePageMeta({ layout: 'default' })

// Section 1: Data Fetching (Populate is key here to get enrollment data)
const { data: students, pending, refresh } = await useFetch('http://localhost:1337/api/students?populate[enrollments][populate]=course')

// Section 2: UI States
const search = ref('')
const dialog = ref(false)
const dialogDelete = ref(false)
const dialogView = ref(false) 
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
  enrollments: [] 
})

const headers = [
  { title: 'ID', key: 'id', align: 'start' },
  { title: 'First Name', key: 'FirstName' }, 
  { title: 'Last Name', key: 'LastName' },   
  { title: 'Email', key: 'Email' },          
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

// Section 5: Methods
const viewStudent = (item) => {
  editedItem.value = { ...item }
  dialogView.value = true
}

const editStudent = (item) => {
  editedItem.value = { 
    documentId: item.documentId, 
    FirstName: item.FirstName, 
    LastName: item.LastName, 
    Email: item.Email 
  }
  dialog.value = true
}

const close = () => {
  dialog.value = false
  nextTick(() => {
    editedItem.value = { documentId: '', FirstName: '', LastName: '', Email: '', enrollments: [] }
  })
}

const saveUpdate = async () => {
  if (!editedItem.value.FirstName || !editedItem.value.LastName) {
    showError("Please fill in the required fields.")
    return
  }

  saving.value = true
  try {
    await $fetch(`http://localhost:1337/api/students/${editedItem.value.documentId}`, {
      method: 'PUT',
      body: { 
        data: {
          FirstName: editedItem.value.FirstName,
          LastName: editedItem.value.LastName,
          Email: editedItem.value.Email
        } 
      }
    })
    await refresh()
    close()
    showSuccess('Student Profile Updated Successfully!')
  } catch (error) {
    showError('Update failed. Please check your connection.')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (student) => {
  editedItem.value = { ...student }
  dialogDelete.value = true
}

const deleteStudentConfirm = async () => {
  saving.value = true
  try {
    await $fetch(`http://localhost:1337/api/students/${editedItem.value.documentId}`, { method: 'DELETE' });
    await refresh();
    dialogDelete.value = false
    showSuccess('Student Record Removed!')
  } catch (error) {
    showError('Could not delete student.')
  } finally {
    saving.value = false
  }
}

// Helper para sa kulay ng status sa Profile View
const getStatusColor = (status) => {
  if (status === 'Enrolled') return 'blue-lighten-3'
  if (status === 'Dropped') return 'red-lighten-3'
  if (status === 'Completed') return 'green-lighten-3'
  if (status === 'Pending') return 'orange-lighten-3'
  return 'grey-lighten-1'
}

// Helper para sa Icons base sa Status
const getStatusIcon = (status) => {
  if (status === 'Enrolled') return 'mdi-check-circle'
  if (status === 'Completed') return 'mdi-sticker-check-outline'
  if (status === 'Pending') return 'mdi-clock-outline'
  return 'mdi-minus-circle'
}
</script>

<template>
  <div class="pa-6">
    <v-row class="mb-6 d-flex align-center">
      <v-col>
        <h1 class="text-h4 font-weight-bold text-white">Student Management</h1>
        <p class="text-subtitle-2 text-grey-lighten-1">Manage and edit student information</p>
      </v-col>
      <v-col class="text-right">
        <v-btn color="blue" prepend-icon="mdi-plus" to="/students/add" rounded="lg" class="text-none px-6" elevation="4">
          ADD STUDENT
        </v-btn>
      </v-col>
    </v-row>

    <v-text-field 
      v-model="search" 
      prepend-inner-icon="mdi-magnify" 
      label="Search students..." 
      variant="outlined" 
      class="glass-search mb-8" 
      hide-details 
      clearable 
    />

    <v-card class="glass-table-card" elevation="0">
      <v-data-table 
        :headers="headers" 
        :items="students?.data || []" 
        :loading="pending" 
        :search="search" 
        theme="dark" 
        class="glass-table"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon size="small" class="me-4" color="green-lighten-2" @click="viewStudent(item)">mdi-eye</v-icon>
          <v-icon size="small" class="me-4" color="blue-lighten-2" @click="editStudent(item)">mdi-pencil</v-icon>
          <v-icon size="small" color="red-lighten-2" @click="confirmDelete(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialogView" max-width="600">
      <v-card class="glass-modal-modern pa-8">
        <div class="text-center mb-6">
          <v-avatar color="blue-darken-4" size="80" class="mb-4 shadow-glow">
            <v-icon size="40" color="blue-lighten-2">mdi-account-details</v-icon>
          </v-avatar>
          <h2 class="text-h5 text-white font-weight-bold">Student Profile</h2>
        </div>

        <v-row class="text-white">
          <v-col cols="6">
            <p class="text-caption text-grey-lighten-1 mb-0">FIRST NAME</p>
            <p class="text-body-1 font-weight-bold">{{ editedItem.FirstName }}</p>
          </v-col>
          <v-col cols="6">
            <p class="text-caption text-grey-lighten-1 mb-0">LAST NAME</p>
            <p class="text-body-1 font-weight-bold">{{ editedItem.LastName }}</p>
          </v-col>
          <v-col cols="12">
            <p class="text-caption text-grey-lighten-1 mb-0">EMAIL ADDRESS</p>
            <p class="text-body-1">{{ editedItem.Email }}</p>
          </v-col>
        </v-row>

        <v-divider class="my-6 border-opacity-25"></v-divider>

        <h3 class="text-subtitle-1 text-blue-lighten-3 mb-4">Enrolled Courses</h3>
        
        <v-list v-if="editedItem.enrollments?.length > 0" bg-color="transparent" class="pa-0">
          <v-list-item v-for="en in editedItem.enrollments" :key="en.id" class="px-0 mb-2 border-list">
            <template v-slot:prepend>
              <v-icon 
                :color="en.enrollmentStatus === 'Enrolled' ? 'blue' : 
                        en.enrollmentStatus === 'Completed' ? 'green' : 
                        en.enrollmentStatus === 'Pending' ? 'orange' : 'red'" 
                class="mr-3"
              >
                {{ getStatusIcon(en.enrollmentStatus) }}
              </v-icon>
            </template>
            <v-list-item-title class="text-white font-weight-medium">
              {{ en.course?.Title || 'Untitled Course' }}
            </v-list-item-title>
            <v-list-item-subtitle 
              :class="en.enrollmentStatus === 'Dropped' ? 'text-red-lighten-3' : 
                      en.enrollmentStatus === 'Completed' ? 'text-green-lighten-3' : 
                      en.enrollmentStatus === 'Pending' ? 'text-orange-lighten-3' : 'text-blue-lighten-3'"
            >
              Status: <span class="font-weight-bold">{{ en.enrollmentStatus }}</span>
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        
        <p v-else class="text-center text-grey-lighten-1 italic py-4">No active enrollments found.</p>

        <v-card-actions class="px-0 pt-6">
          <v-btn block color="blue" variant="tonal" rounded="lg" @click="dialogView = false">CLOSE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" max-width="550" persistent>
      <v-card class="glass-modal-modern pa-8">
        <div class="text-center mb-6">
          <div class="icon-glow mb-2">
            <v-icon size="48" color="blue-lighten-2">mdi-account-edit</v-icon>
          </div>
          <h2 class="text-h5 font-weight-bold text-white">Update Profile</h2>
          <p class="text-caption text-grey-lighten-1">Modify student details in the system</p>
        </div>

        <v-card-text class="px-0">
          <v-text-field v-model="editedItem.FirstName" label="First Name" variant="outlined" class="custom-field mb-4" hide-details />
          <v-text-field v-model="editedItem.LastName" label="Last Name" variant="outlined" class="custom-field mb-4" hide-details />
          <v-text-field v-model="editedItem.Email" label="Email Address" variant="outlined" class="custom-field" hide-details />
        </v-card-text>

        <v-card-actions class="px-0 pt-6">
          <v-btn variant="text" color="grey-lighten-1" class="text-none" @click="close">CANCEL</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue" variant="elevated" rounded="lg" class="text-none px-8" :loading="saving" @click="saveUpdate">
            Update Now
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="450">
      <v-card class="glass-modal-modern pa-8 text-center">
        <v-avatar color="red-lighten-4" size="80" class="mb-4 shadow-glow-red">
          <v-icon size="48" color="red-darken-2">mdi-alert-circle-outline</v-icon>
        </v-avatar>
        <h2 class="text-h5 text-white font-weight-bold mb-2">Confirm Delete</h2>
        <p class="text-body-1 text-grey-lighten-1 mb-8">
          Are you sure you want to remove <br>
          <strong class="text-white">{{ editedItem.FirstName }} {{ editedItem.LastName }}</strong>?
        </p>
        <div class="d-flex justify-center gap-4">
          <v-btn variant="text" color="white" @click="dialogDelete = false">NO, KEEP IT</v-btn>
          <v-btn color="red-darken-1" variant="elevated" rounded="lg" class="px-6" @click="deleteStudentConfirm">YES, DELETE</v-btn>
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
  </div>
</template>

<style scoped>
.shadow-glow { box-shadow: 0 0 20px rgba(33, 150, 243, 0.3); }
.shadow-glow-red { box-shadow: 0 0 20px rgba(244, 67, 54, 0.3); }
.border-list { border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.gap-4 { gap: 16px; }

.glass-search :deep(.v-field) { background: rgba(255, 255, 255, 0.05) !important; border-radius: 16px !important; color: white !important; }
.glass-search :deep(.v-field__input), .glass-search :deep(.v-label), .glass-search :deep(.v-field__prepend-inner .v-icon) { color: white !important; opacity: 1 !important; }
.glass-modal-modern { background: rgba(18, 18, 18, 0.9) !important; backdrop-filter: blur(25px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.1) !important; border-radius: 32px !important; }
.border-success { border: 1px solid rgba(76, 175, 80, 0.3) !important; }
.icon-glow { display: inline-block; padding: 15px; background: rgba(33, 150, 243, 0.1); border-radius: 20px; }
.icon-glow-green { box-shadow: 0 0 20px rgba(76, 175, 80, 0.2); }
.custom-field :deep(.v-field) { background: rgba(255, 255, 255, 0.05) !important; border-radius: 12px !important; color: white !important; }
.glass-table-card { background: rgba(255, 255, 255, 0.02) !important; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05) !important; border-radius: 24px !important; }
.glass-table { background: transparent !important; }
:deep(.v-data-table-header) { background: rgba(255, 255, 255, 0.05) !important; }
:deep(.v-data-table__th) { color: #64B5F6 !important; font-weight: bold !important; }
</style>