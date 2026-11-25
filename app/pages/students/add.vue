<script setup>
const router = useRouter()
const { addStudent, students } = usePmccStore()

const nextNumber = computed(() => {
  const num = students.value.length + 1
  return `PMCC-2026-${String(num).padStart(4, '0')}`
})

const studentNo = ref('')
const fullName = ref('')
const program = ref('BS Information Technology')
const yearLevel = ref('1st Year')
const scholarshipPreset = ref('None (0%)')
const errorMsg = ref('')

watchEffect(() => {
  if (!studentNo.value) {
    studentNo.value = nextNumber.value
  }
})

const programs = [
  'BS Information Technology',
  'BS Accountancy',
  'BS Business Administration',
  'BS Hospitality Management',
]

const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year']

const scholarshipOptions = [
  { label: 'None (0%)', rate: 0 },
  { label: '20% Academic Scholar', rate: 0.2 },
  { label: '50% Dean / Athletic Scholar', rate: 0.5 },
  { label: '100% Full Tuition Scholar', rate: 1 },
]

const handleSave = () => {
  if (!studentNo.value.trim() || !fullName.value.trim()) {
    errorMsg.value = 'Pakilagay ang Student Number at Full Name.'
    return
  }

  const chosen = scholarshipOptions.find((o) => o.label === scholarshipPreset.value) || scholarshipOptions[0]
  addStudent({
    studentNo: studentNo.value.trim(),
    fullName: fullName.value.trim(),
    program: program.value,
    yearLevel: yearLevel.value,
    scholarshipType: chosen.rate === 0 ? 'None' : chosen.label,
    discountRate: chosen.rate,
  })

  errorMsg.value = ''
  router.push('/students')
}
</script>

<template>
  <div>
    <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-6">
      <div>
        <div class="text-caption font-weight-bold text-green-darken-3" style="letter-spacing: 0.7px;">
          STUDENTS & SCHOLARS
        </div>
        <h1 class="text-h5 font-weight-extrabold text-grey-darken-4">
          Add <span class="glass-serif">Student</span> Profile
        </h1>
      </div>

      <v-btn
        variant="outlined"
        color="grey-darken-3"
        class="text-none rounded-pill font-weight-semibold glass-btn-outline"
        prepend-icon="mdi-arrow-left"
        @click="router.push('/students')"
      >
        Back to Students
      </v-btn>
    </div>

    <v-card class="glass-panel pa-6 pa-md-8 mx-auto" style="max-width: 740px;">
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="studentNo"
            label="Student Number"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-card-account-details-outline"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-select
            v-model="yearLevel"
            :items="yearLevels"
            label="Year Level"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-stairs"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="fullName"
            label="Full Name"
            placeholder="e.g., Pedro Penduko"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-account-outline"
            @keyup.enter="handleSave"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-select
            v-model="program"
            :items="programs"
            label="Program"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-school-outline"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <v-select
            v-model="scholarshipPreset"
            :items="scholarshipOptions.map((o) => o.label)"
            label="Scholarship / Discount"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-certificate-outline"
          />
        </v-col>
      </v-row>

      <v-alert
        v-if="errorMsg"
        type="error"
        variant="tonal"
        density="compact"
        class="mt-2 mb-4"
      >
        {{ errorMsg }}
      </v-alert>

      <div class="d-flex justify-end ga-2 mt-4">
        <v-btn
          variant="text"
          color="grey-darken-3"
          class="text-none rounded-pill"
          @click="router.push('/students')"
        >
          Cancel
        </v-btn>
        <v-btn
          color="#141c18"
          variant="flat"
          class="text-none rounded-pill text-white font-weight-bold px-6"
          prepend-icon="mdi-content-save-outline"
          @click="handleSave"
        >
          Save Student
        </v-btn>
      </div>
    </v-card>
  </div>
</template>