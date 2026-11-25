<script setup>
definePageMeta({
  layout: 'default'
})

const {
  students,
  addStudent,
  getStudentLedger,
} = usePmccStore()

const search = ref('')
const dialog = ref(false)
const editMode = ref(false)
const editingId = ref('')
const deleteDialog = ref(false)
const deletingStudent = ref(null)

const snackbar = ref(false)
const snackText = ref('')
const snackColor = ref('success')

const scholarshipOptions = [
  { title: 'None (0% Discount)', value: 'None', rate: 0 },
  { title: '20% Academic Scholar', value: '20% Academic Scholar', rate: 0.20 },
  { title: '50% Partial Scholar', value: '50% Partial Scholar', rate: 0.50 },
  { title: '100% Full Scholar', value: '100% Full Scholar', rate: 1.00 },
]

const programs = [
  'BS Information Technology',
  'BS Accountancy',
  'BS Computer Science',
  'BS Business Administration',
  'Bachelor of Elementary Education',
]

const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year']

const form = ref({
  studentNo: '',
  fullName: '',
  program: 'BS Information Technology',
  yearLevel: '1st Year',
  scholarshipType: 'None',
})

const scholarCount = computed(() => students.value.filter((s) => Number(s.discountRate || 0) > 0).length)
const clearedCount = computed(
  () => students.value.filter((s) => getStudentLedger(s.id).examPermitStatus === 'CLEARED').length
)
const blockedCount = computed(
  () => students.value.filter((s) => getStudentLedger(s.id).examPermitStatus === 'BLOCKED').length
)

const filteredStudents = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return students.value
  return students.value.filter(
    (s) =>
      s.fullName.toLowerCase().includes(q) ||
      s.studentNo.toLowerCase().includes(q) ||
      s.program.toLowerCase().includes(q) ||
      s.scholarshipType.toLowerCase().includes(q)
  )
})

const openAddDialog = () => {
  editMode.value = false
  editingId.value = ''
  const nextNum = String(students.value.length + 1).padStart(4, '0')
  form.value = {
    studentNo: `PMCC-2026-${nextNum}`,
    fullName: '',
    program: 'BS Information Technology',
    yearLevel: '1st Year',
    scholarshipType: 'None',
  }
  dialog.value = true
}

const openEditDialog = (student) => {
  editMode.value = true
  editingId.value = student.id
  form.value = {
    studentNo: student.studentNo,
    fullName: student.fullName,
    program: student.program,
    yearLevel: student.yearLevel,
    scholarshipType: student.scholarshipType,
  }
  dialog.value = true
}

const saveStudent = () => {
  if (!form.value.studentNo.trim() || !form.value.fullName.trim()) {
    snackText.value = 'Please fill in Student Number and Full Name.'
    snackColor.value = 'warning'
    snackbar.value = true
    return
  }

  const selectedScholar = scholarshipOptions.find((o) => o.value === form.value.scholarshipType)
  const discountRate = selectedScholar ? selectedScholar.rate : 0

  if (editMode.value) {
    const idx = students.value.findIndex((s) => s.id === editingId.value)
    if (idx !== -1) {
      students.value[idx] = {
        ...students.value[idx],
        studentNo: form.value.studentNo.trim(),
        fullName: form.value.fullName.trim(),
        program: form.value.program,
        yearLevel: form.value.yearLevel,
        scholarshipType: form.value.scholarshipType,
        discountRate,
      }
    }
    snackText.value = 'Student record and scholarship updated!'
  } else {
    addStudent({
      studentNo: form.value.studentNo.trim(),
      fullName: form.value.fullName.trim(),
      program: form.value.program,
      yearLevel: form.value.yearLevel,
      scholarshipType: form.value.scholarshipType,
      discountRate,
    })
    snackText.value = 'New student registered successfully!'
  }

  snackColor.value = 'success'
  snackbar.value = true
  dialog.value = false
}

const confirmDelete = (student) => {
  deletingStudent.value = student
  deleteDialog.value = true
}

const executeDelete = () => {
  if (!deletingStudent.value) return
  students.value = students.value.filter((s) => s.id !== deletingStudent.value.id)
  deleteDialog.value = false
  deletingStudent.value = null
  snackText.value = 'Student record removed.'
  snackColor.value = 'info'
  snackbar.value = true
}
</script>

<template>
  <div class="d-flex flex-column ga-5">
    <!-- Dark Sage Glass Hero Banner (Matches Dashboard Banner) -->
    <div class="glass-hero-banner pa-5 pa-md-6 d-flex flex-wrap align-center justify-space-between ga-4">
      <div>
        <div class="text-caption font-weight-bold text-green-lighten-3 mb-1" style="letter-spacing: 1px;">
          STUDENT REGISTRY & SCHOLARSHIPS
        </div>
        <h1 class="text-h4 font-weight-extrabold text-white mb-1" style="letter-spacing: -0.02em;">
          Students & <span class="glass-serif text-green-lighten-2">Scholars</span>
        </h1>
        <p class="text-body-2 text-grey-lighten-2 mb-0">
          Manage student profiles, scholarship discounts (0%, 20%, 50%, 100%), and exam permit standing.
        </p>
      </div>

      <v-btn
        color="white"
        variant="flat"
        class="text-none rounded-pill text-grey-darken-4 font-weight-bold px-6"
        prepend-icon="mdi-account-plus-outline"
        @click="openAddDialog"
      >
        Register Student
      </v-btn>
    </div>

    <!-- Compact Frosted Metrics Strip -->
    <v-row dense>
      <v-col cols="12" sm="4">
        <div class="glass-subcard pa-4">
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-caption font-weight-bold text-grey-darken-2">REGISTERED STUDENTS</span>
            <v-chip size="x-small" color="green-darken-2" variant="tonal" class="font-weight-bold">
              ROSTER
            </v-chip>
          </div>
          <div class="text-h5 font-weight-extrabold text-grey-darken-4">{{ students.length }} Students</div>
          <div class="text-caption text-grey-darken-2 mt-1">Active PMCC student profiles</div>
        </div>
      </v-col>

      <v-col cols="12" sm="4">
        <div class="glass-subcard pa-4">
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-caption font-weight-bold text-grey-darken-2">SCHOLARSHIP GRANTS</span>
            <v-chip size="x-small" color="amber-darken-3" variant="tonal" class="font-weight-bold">
              DISCOUNTS
            </v-chip>
          </div>
          <div class="text-h5 font-weight-extrabold text-grey-darken-4">{{ scholarCount }} Scholars</div>
          <div class="text-caption text-grey-darken-2 mt-1">Applied to tuition computation</div>
        </div>
      </v-col>

      <v-col cols="12" sm="4">
        <div class="glass-subcard pa-4">
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-caption font-weight-bold text-grey-darken-2">PERMIT STANDING</span>
            <v-chip size="x-small" color="#141c18" variant="flat" class="text-white font-weight-bold">
              PERMITS
            </v-chip>
          </div>
          <div class="text-h5 font-weight-extrabold text-grey-darken-4">
            {{ clearedCount }} Cleared • {{ blockedCount }} Blocked
          </div>
          <div class="text-caption text-grey-darken-2 mt-1">Synced with student balances</div>
        </div>
      </v-col>
    </v-row>

    <!-- Search & Table Card -->
    <v-card class="glass-panel pa-5 pa-md-6">
      <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-4">
        <v-text-field
          v-model="search"
          placeholder="Search student name, ID number, program, or scholarship..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          style="max-width: 420px;"
        />

        <div class="text-caption text-grey-darken-2">
          Showing <strong class="text-grey-darken-4">{{ filteredStudents.length }}</strong> of {{ students.length }} students
        </div>
      </div>

      <v-table class="bg-transparent text-grey-darken-4">
        <thead>
          <tr>
            <th class="text-grey-darken-2 font-weight-bold">Student No.</th>
            <th class="text-grey-darken-2 font-weight-bold">Full Name</th>
            <th class="text-grey-darken-2 font-weight-bold">Program & Year</th>
            <th class="text-grey-darken-2 font-weight-bold">Scholarship / Discount</th>
            <th class="text-center text-grey-darken-2 font-weight-bold">Permit Status</th>
            <th class="text-right text-grey-darken-2 font-weight-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stu in filteredStudents" :key="stu.id">
            <td class="font-weight-bold text-green-darken-4">{{ stu.studentNo }}</td>
            <td class="font-weight-bold text-grey-darken-4">{{ stu.fullName }}</td>
            <td>
              <div class="text-grey-darken-4 font-weight-semibold">{{ stu.program }}</div>
              <div class="text-caption text-grey-darken-2">{{ stu.yearLevel }}</div>
            </td>
            <td>
              <v-chip
                size="small"
                variant="tonal"
                :color="stu.discountRate > 0 ? 'amber-darken-3' : 'grey-darken-1'"
                class="font-weight-semibold"
              >
                {{ stu.scholarshipType }}
              </v-chip>
            </td>
            <td class="text-center">
              <v-chip
                size="x-small"
                variant="flat"
                class="text-white font-weight-bold"
                :color="
                  getStudentLedger(stu.id).examPermitStatus === 'CLEARED'
                    ? 'green-darken-2'
                    : getStudentLedger(stu.id).examPermitStatus === 'BLOCKED'
                    ? 'red-darken-2'
                    : 'grey-darken-1'
                "
              >
                {{ getStudentLedger(stu.id).examPermitStatus }}
              </v-chip>
            </td>
            <td class="text-right">
              <v-btn
                icon="mdi-pencil-outline"
                size="small"
                variant="text"
                color="grey-darken-3"
                title="Edit Student & Scholarship"
                @click="openEditDialog(stu)"
              />
              <v-btn
                icon="mdi-delete-outline"
                size="small"
                variant="text"
                color="red-darken-2"
                title="Delete Student"
                @click="confirmDelete(stu)"
              />
            </td>
          </tr>
          <tr v-if="filteredStudents.length === 0">
            <td colspan="6" class="text-center text-grey-darken-2 py-6">
              No matching student records found.
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Add / Edit Student Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card class="glass-modal pa-6">
        <div class="d-flex align-center justify-space-between mb-4">
          <h3 class="text-h6 font-weight-extrabold text-grey-darken-4">
            {{ editMode ? 'Edit Student & Scholarship' : 'Register New Student' }}
          </h3>
          <v-btn icon="mdi-close" size="small" variant="text" color="grey-darken-3" @click="dialog = false" />
        </div>

        <v-text-field
          v-model="form.studentNo"
          label="Student Number"
          variant="outlined"
          density="comfortable"
          class="mb-3"
        />

        <v-text-field
          v-model="form.fullName"
          label="Full Name (First Middle Last)"
          variant="outlined"
          density="comfortable"
          class="mb-3"
        />

        <v-select
          v-model="form.program"
          :items="programs"
          label="Degree Program"
          variant="outlined"
          density="comfortable"
          class="mb-3"
        />

        <v-row>
          <v-col cols="12" sm="5">
            <v-select
              v-model="form.yearLevel"
              :items="yearLevels"
              label="Year Level"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12" sm="7">
            <v-select
              v-model="form.scholarshipType"
              :items="scholarshipOptions"
              item-title="title"
              item-value="value"
              label="Scholarship Grant"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
        </v-row>

        <div class="d-flex justify-end ga-2 mt-4">
          <v-btn variant="text" color="grey-darken-3" class="text-none rounded-pill" @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="#141c18" variant="flat" class="text-none rounded-pill text-white font-weight-bold px-5" @click="saveStudent">
            {{ editMode ? 'Save Changes' : 'Register Student' }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="380">
      <v-card class="glass-modal pa-6">
        <div class="text-h6 font-weight-extrabold text-grey-darken-4 mb-2">Remove Student?</div>
        <p class="text-body-2 text-grey-darken-2 mb-5">
          Are you sure you want to delete <strong class="text-grey-darken-4">{{ deletingStudent?.fullName }}</strong>?
        </p>
        <div class="d-flex justify-end ga-2">
          <v-btn variant="text" color="grey-darken-3" class="text-none rounded-pill" @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn color="red-darken-2" variant="flat" class="text-none rounded-pill text-white font-weight-bold" @click="executeDelete">
            Delete
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackColor" :timeout="2500" rounded="lg">
      {{ snackText }}
    </v-snackbar>
  </div>
</template>

<style scoped>
.glass-hero-banner {
  background: linear-gradient(135deg, rgba(44, 68, 52, 0.92) 0%, rgba(25, 42, 32, 0.95) 100%);
  backdrop-filter: blur(22px) saturate(160%);
  -webkit-backdrop-filter: blur(22px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.24);
  box-shadow:
    0 18px 40px rgba(18, 38, 26, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.28);
  border-radius: 26px;
}

.glass-subcard {
  background: rgba(255, 255, 255, 0.64);
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.88);
  box-shadow:
    0 10px 24px rgba(20, 40, 28, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);
  border-radius: 22px;
}

:deep(.v-table th) {
  border-bottom: 1px solid rgba(20, 28, 24, 0.12) !important;
}
:deep(.v-table td) {
  border-bottom: 1px solid rgba(20, 28, 24, 0.08) !important;
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}
</style>