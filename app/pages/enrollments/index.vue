<script setup>
definePageMeta({ layout: 'default' })

// Section 1: Data Fetching
const { data: enrollments, refresh, pending } = await useFetch('http://localhost:1337/api/enrollments?populate=*')
const { data: students } = await useFetch('http://localhost:1337/api/students')
const { data: courses } = await useFetch('http://localhost:1337/api/courses')

// Section 2: UI States
const search = ref('')
const dialog = ref(false)
const menu = ref(false)
const saving = ref(false)
const dialogSuccess = ref(false)
const dialogError = ref(false)
const statusMessage = ref('')

const isEditing = ref(false)
const dialogDelete = ref(false)
const selectedId = ref(null)

// Section 3: Form State
const form = ref({
  student: null,
  course: null,
  EnrollmentDate: new Date(),
  enrollmentStatus: 'Enrolled'
})

// Helper para i-format ang date sa table
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Helper para sa Calendar Input Display
const formattedDateInput = computed(() => {
  return form.value.EnrollmentDate ? new Date(form.value.EnrollmentDate).toISOString().substr(0, 10) : ''
})

const headers = [
  { title: 'Student Name', key: 'studentName' },
  { title: 'Course Enrolled', key: 'courseTitle' },
  { title: 'Enrollment Date', key: 'EnrollmentDate' },
  { title: 'Status', key: 'enrollmentStatus', align: 'center' },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]

// Section 4: Methods
const openAdd = () => {
  isEditing.value = false
  form.value = { 
    student: null, 
    course: null, 
    EnrollmentDate: new Date(), 
    enrollmentStatus: 'Enrolled' 
  }
  dialog.value = true
}

const openEdit = (item) => {
  isEditing.value = true
  selectedId.value = item.documentId
  form.value = {
    student: item.student?.documentId,
    course: item.course?.documentId,
    EnrollmentDate: new Date(item.EnrollmentDate),
    enrollmentStatus: item.enrollmentStatus
  }
  dialog.value = true
}

const confirmDelete = (id) => {
  selectedId.value = id
  dialogDelete.value = true
}

const deleteEnrollment = async () => {
  saving.value = true
  try {
    await $fetch(`http://localhost:1337/api/enrollments/${selectedId.value}`, {
      method: 'DELETE'
    })
    await refresh()
    dialogDelete.value = false
    statusMessage.value = "Enrollment record deleted successfully."
    dialogSuccess.value = true
  } catch (error) {
    statusMessage.value = "Failed to delete record."
    dialogError.value = true
  } finally {
    saving.value = false
  }
}

const saveEnrollment = async () => {
  if (!form.value.student || !form.value.course) {
    statusMessage.value = "Please select a student and a course."
    dialogError.value = true
    return
  }

  saving.value = true
  try {
    const payload = {
      ...form.value,
      EnrollmentDate: new Date(form.value.EnrollmentDate).toISOString().substr(0, 10)
    }

    const url = isEditing.value 
      ? `http://localhost:1337/api/enrollments/${selectedId.value}` 
      : 'http://localhost:1337/api/enrollments'
    
    const method = isEditing.value ? 'PUT' : 'POST'

    await $fetch(url, {
      method: method,
      body: { data: payload }
    })
    
    await refresh()
    dialog.value = false
    statusMessage.value = isEditing.value ? "Record updated successfully!" : "Student successfully enrolled!"
    dialogSuccess.value = true
  } catch (error) {
    statusMessage.value = "Operation failed. Please check your connection."
    dialogError.value = true
  } finally {
    saving.value = false
  }
}

// In-update para kasama ang Pending (Orange) at Completed (Green)
const getStatusColor = (status) => {
  if (status === 'Enrolled') return 'blue-lighten-4'
  if (status === 'Dropped') return 'red-lighten-3'
  if (status === 'Completed') return 'green-lighten-3'
  if (status === 'Pending') return 'orange-lighten-3'
  return 'grey'
}
</script>

<template>
  <div class="pa-6">
    <v-row class="mb-6 d-flex align-center">
      <v-col>
        <h1 class="text-h4 font-weight-bold text-white">Enrollment System</h1>
        <p class="text-subtitle-2 text-grey-lighten-1">Manage student course registrations</p>
      </v-col>
      <v-col class="text-right">
        <v-btn color="blue" prepend-icon="mdi-plus" rounded="lg" class="text-none px-6" elevation="4" @click="openAdd">
          NEW ENROLLMENT
        </v-btn>
      </v-col>
    </v-row>

    <v-card class="glass-table-card" elevation="0">
      <v-data-table 
        :headers="headers" 
        :items="enrollments?.data || []" 
        :loading="pending"
        :search="search"
        theme="dark" 
        class="glass-table"
      >
        <template v-slot:item.studentName="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="32" color="blue-darken-3" class="me-3 text-caption text-white font-weight-bold">
              {{ item.student?.FirstName?.[0] }}{{ item.student?.LastName?.[0] }}
            </v-avatar>
            <span class="font-weight-medium text-white">
              {{ item.student?.FirstName }} {{ item.student?.LastName }}
            </span>
          </div>
        </template>

        <template v-slot:item.courseTitle="{ item }">
          <v-chip variant="text" prepend-icon="mdi-book-open-variant" class="text-blue-lighten-3">
            {{ item.course?.Title || 'No Course' }}
          </v-chip>
        </template>

        <template v-slot:item.EnrollmentDate="{ item }">
          <span class="text-grey-lighten-1">{{ formatDate(item.EnrollmentDate) }}</span>
        </template>

        <template v-slot:item.enrollmentStatus="{ item }">
          <v-chip 
            :color="getStatusColor(item.enrollmentStatus)" 
            size="small" 
            variant="flat" 
            class="text-black font-weight-bold px-4"
          >
            {{ item.enrollmentStatus }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon size="small" color="blue-lighten-3" class="me-3" @click="openEdit(item)">mdi-pencil</v-icon>
          <v-icon size="small" color="red-lighten-3" @click="confirmDelete(item.documentId)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="550" persistent>
      <v-card class="glass-modal-modern pa-8">
        <div class="text-center mb-6">
          <div class="icon-glow mb-2">
            <v-icon size="48" color="blue-lighten-2">{{ isEditing ? 'mdi-pencil' : 'mdi-school-outline' }}</v-icon>
          </div>
          <h2 class="text-h5 font-weight-bold text-white">{{ isEditing ? 'Edit Registration' : 'Student Registration' }}</h2>
          <p class="text-caption text-grey-lighten-1">Complete the enrollment details below</p>
        </div>
        
        <v-card-text class="px-0">
          <v-select
            v-model="form.student"
            :items="students?.data || []"
            item-title="FirstName"
            item-value="documentId"
            label="Select Student"
            variant="outlined"
            class="custom-field mb-4"
            hide-details
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :title="item.raw.FirstName + ' ' + item.raw.LastName" :subtitle="item.raw.Email"></v-list-item>
            </template>
          </v-select>

          <v-select
            v-model="form.course"
            :items="courses?.data || []"
            item-title="Title"
            item-value="documentId"
            label="Select Course"
            variant="outlined"
            class="custom-field mb-4"
            hide-details
          />

          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="formattedDateInput"
                label="Date of Enrollment"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="props"
                variant="outlined"
                class="custom-field mb-4"
                hide-details
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="form.EnrollmentDate"
              @update:model-value="menu = false"
              color="blue-darken-2"
              theme="dark"
            ></v-date-picker>
          </v-menu>
          
          <v-select
            v-model="form.enrollmentStatus"
            :items="['Pending', 'Enrolled', 'Dropped', 'Completed']"
            label="Status"
            variant="outlined"
            class="custom-field"
            hide-details
          />
        </v-card-text>

        <v-card-actions class="px-0 pt-6">
          <v-btn variant="text" color="grey-lighten-1" @click="dialog = false">CANCEL</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue" variant="elevated" rounded="lg" class="px-8 font-weight-bold" :loading="saving" @click="saveEnrollment">
            {{ isEditing ? 'UPDATE RECORD' : 'CONFIRM ENROLLMENT' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogSuccess" max-width="400">
      <v-card class="glass-modal-modern pa-8 text-center border-success">
        <v-avatar color="green-lighten-4" size="80" class="mb-4 icon-glow-green">
          <v-icon size="48" color="green-darken-2">mdi-check-circle</v-icon>
        </v-avatar>
        <h2 class="text-h5 font-weight-bold text-white mb-2">Success!</h2>
        <p class="text-body-1 text-grey-lighten-1 mb-6">{{ statusMessage }}</p>
        <v-btn color="green-darken-1" block size="large" rounded="lg" @click="dialogSuccess = false">GREAT</v-btn>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="450">
      <v-card class="glass-modal-modern pa-8 text-center">
        <v-icon size="64" color="red-lighten-2" class="mb-4">mdi-alert-octagon</v-icon>
        <h2 class="text-h5 font-weight-bold text-white mb-2">Are you sure?</h2>
        <p class="text-grey-lighten-1 mb-6">This action cannot be undone.</p>
        <div class="d-flex gap-2">
          <v-btn variant="text" color="white" flex-grow-1 @click="dialogDelete = false">CANCEL</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red-darken-1" rounded="lg" class="px-8" :loading="saving" @click="deleteEnrollment">DELETE NOW</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
/* Styles remain the same */
:deep(.v-date-picker) { background: rgba(30, 30, 30, 0.95) !important; backdrop-filter: blur(10px); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); }
.glass-table-card { background: rgba(255, 255, 255, 0.02) !important; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05) !important; border-radius: 24px !important; }
.glass-table { background: transparent !important; }
:deep(.v-data-table-header) { background: rgba(255, 255, 255, 0.05) !important; }
:deep(.v-data-table__th) { color: #64B5F6 !important; font-weight: bold !important; }
.glass-modal-modern { background: rgba(18, 18, 18, 0.9) !important; backdrop-filter: blur(25px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.1) !important; border-radius: 32px !important; }
.custom-field :deep(.v-field) { background: rgba(255, 255, 255, 0.05) !important; border-radius: 12px !important; color: white !important; }
.icon-glow { display: inline-block; padding: 15px; background: rgba(33, 150, 243, 0.1); border-radius: 20px; }
.border-success { border: 1px solid rgba(76, 175, 80, 0.3) !important; }
.icon-glow-green { box-shadow: 0 0 20px rgba(76, 175, 80, 0.2); }
</style>