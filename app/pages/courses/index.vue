<script setup>
definePageMeta({ layout: 'default' })

// Section 1: Data Fetching (Added populate to see Instructor)
const { data: courses, pending, refresh } = await useFetch('http://localhost:1337/api/courses?populate=*')
const { data: instructors } = await useFetch('http://localhost:1337/api/instructors')

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
  CourseCode: '',
  Title: '',
  Credits: 0,
  instructor: null // Added for Relationship
})

const headers = [
  { title: 'Course Code', key: 'CourseCode' }, 
  { title: 'Course Name', key: 'Title' },   
  { title: 'Instructor', key: 'instructor' }, // Added Column
  { title: 'Credits/Units', key: 'Credits' },          
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

// Section 5: Methods
const openAddDialog = () => {
  editedItem.value = { documentId: '', CourseCode: '', Title: '', Credits: null, instructor: null }
  dialog.value = true
}

const editCourse = (item) => {
  // Sinisiguro natin na makuha ang documentId ng tama
  editedItem.value = { 
    documentId: item.documentId, 
    CourseCode: item.CourseCode, 
    Title: item.Title, 
    Credits: item.Credits,
    instructor: item.instructor?.documentId || null // Kunin ang ID ng instructor kung meron
  }
  dialog.value = true
}

const close = () => {
  dialog.value = false
  nextTick(() => {
    editedItem.value = { documentId: '', CourseCode: '', Title: '', Credits: null, instructor: null }
  })
}

const saveCourse = async () => {
  if (!editedItem.value.CourseCode || !editedItem.value.Title) {
    showError("Please fill in the required fields.")
    return
  }

  saving.value = true
  const isUpdate = !!editedItem.value.documentId
  
  // FIXED URL PATH
  const url = isUpdate 
    ? `http://localhost:1337/api/courses/${editedItem.value.documentId}` 
    : 'http://localhost:1337/api/courses'
  
  try {
    await $fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      body: { 
        data: {
          CourseCode: editedItem.value.CourseCode,
          Title: editedItem.value.Title,
          Credits: Number(editedItem.value.Credits),
          instructor: editedItem.value.instructor // Link to instructor
        } 
      }
    })
    await refresh()
    close()
    showSuccess(isUpdate ? 'Course Updated Successfully!' : 'New Course Added Successfully!')
  } catch (error) {
    showError('Operation failed. Check if documentId is valid.')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item) => {
  // Importante: I-assign ang buong item para makuha ang documentId
  editedItem.value = { ...item }
  dialogDelete.value = true
}

const deleteCourseConfirm = async () => {
  if (!editedItem.value.documentId) {
    showError('Error: Document ID not found.');
    return;
  }

  saving.value = true
  try {
    // FIXED DELETE CALL
    await $fetch(`http://localhost:1337/api/courses/${editedItem.value.documentId}`, { 
      method: 'DELETE' 
    });
    await refresh();
    dialogDelete.value = false
    showSuccess('Course Record Removed!')
  } catch (error) {
    showError('Could not delete course. Check Strapi permissions.');
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="pa-6">
    <v-row class="mb-6 d-flex align-center">
      <v-col>
        <h1 class="text-h4 font-weight-bold text-white">Academic Programs</h1>
        <p class="text-subtitle-2 text-grey-lighten-1">Manage and organize school curriculum</p>
      </v-col>
      <v-col class="text-right">
        <v-btn color="blue" prepend-icon="mdi-plus" rounded="lg" class="text-none px-6" elevation="4" @click="openAddDialog">
          ADD COURSE
        </v-btn>
      </v-col>
    </v-row>

    <v-text-field 
      v-model="search" 
      prepend-inner-icon="mdi-magnify" 
      label="Search Course..." 
      variant="outlined" 
      class="glass-search mb-8" 
      hide-details 
      clearable 
    />

    <v-card class="glass-table-card" elevation="0">
      <v-data-table 
        :headers="headers" 
        :items="courses?.data || []" 
        :loading="pending" 
        :search="search" 
        theme="dark" 
        class="glass-table"
      >
        <template v-slot:item.instructor="{ item }">
          <v-chip v-if="item.instructor" color="blue-lighten-4" size="small" variant="outlined">
            {{ item.instructor.FirstName }} {{ item.instructor.LastName }}
          </v-chip>
          <span v-else class="text-grey text-caption italic">Unassigned</span>
        </template>

        <template v-slot:item.Credits="{ item }">
          <span class="font-weight-bold">{{ item.Credits }} Units</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon size="small" class="me-4" color="blue-lighten-2" @click="editCourse(item)">mdi-pencil</v-icon>
          <v-icon size="small" color="red-lighten-2" @click="confirmDelete(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="550" persistent>
      <v-card class="glass-modal-modern pa-8">
        <div class="text-center mb-6">
          <div class="icon-glow mb-2">
            <v-icon size="48" color="blue-lighten-2">
              {{ editedItem.documentId ? 'mdi-book-edit' : 'mdi-book-plus-outline' }}
            </v-icon>
          </div>
          <h2 class="text-h5 font-weight-bold text-white">
            {{ editedItem.documentId ? 'Update Course' : 'Add New Course' }}
          </h2>
        </div>

        <v-card-text class="px-0">
          <v-text-field v-model="editedItem.CourseCode" label="Course Code" variant="outlined" class="custom-field mb-4" hide-details />
          <v-text-field v-model="editedItem.Title" label="Course Name" variant="outlined" class="custom-field mb-4" hide-details />
          
          <v-select
            v-model="editedItem.instructor"
            :items="instructors?.data || []"
            item-title="LastName"
            item-value="documentId"
            label="Assign Instructor"
            variant="outlined"
            class="custom-field mb-4"
            hide-details
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :title="item.raw.FirstName + ' ' + item.raw.LastName" :subtitle="item.raw.Department"></v-list-item>
            </template>
          </v-select>

          <v-text-field v-model="editedItem.Credits" label="Credits/Units" type="number" variant="outlined" class="custom-field" hide-details />
        </v-card-text>

        <v-card-actions class="px-0 pt-6">
          <v-btn variant="text" color="grey-lighten-1" class="text-none" @click="close">CANCEL</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue" variant="elevated" rounded="lg" class="text-none px-8" :loading="saving" @click="saveCourse">
            {{ editedItem.documentId ? 'Update Now' : 'Save Course' }}
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
          <strong class="text-white">{{ editedItem.CourseCode }}: {{ editedItem.Title }}</strong>?
        </p>
        <div class="d-flex justify-center gap-4">
          <v-btn variant="text" color="white" @click="dialogDelete = false">CANCEL</v-btn>
          <v-btn color="red-darken-1" variant="elevated" rounded="lg" class="px-6" @click="deleteCourseConfirm" :loading="saving">YES, DELETE</v-btn>
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
/* Keeping your exact CSS for consistency */
.glass-search :deep(.v-field) { background: rgba(255, 255, 255, 0.05) !important; border-radius: 16px !important; color: white !important; }
.glass-modal-modern { background: rgba(18, 18, 18, 0.95) !important; backdrop-filter: blur(25px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.1) !important; border-radius: 32px !important; }
.border-success { border: 1px solid rgba(76, 175, 80, 0.3) !important; }
.border-error { border: 1px solid rgba(244, 67, 54, 0.3) !important; }
.icon-glow { display: inline-block; padding: 15px; background: rgba(33, 150, 243, 0.1); border-radius: 20px; }
.icon-glow-green { box-shadow: 0 0 20px rgba(76, 175, 80, 0.4); }
.icon-glow-red { box-shadow: 0 0 20px rgba(244, 67, 54, 0.4); }
.custom-field :deep(.v-field) { background: rgba(255, 255, 255, 0.05) !important; border-radius: 12px !important; color: white !important; }
.glass-table-card { background: rgba(255, 255, 255, 0.02) !important; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05) !important; border-radius: 24px !important; }
.glass-table { background: transparent !important; }
:deep(.v-data-table-header) { background: rgba(255, 255, 255, 0.05) !important; }
:deep(.v-data-table__th) { color: #64B5F6 !important; font-weight: bold !important; }
</style>