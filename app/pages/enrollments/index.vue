<script setup>
definePageMeta({
  layout: 'default'
})

const {
  students,
  subjects,
  saveEnrollment,
  getStudentLedger,
  subsidiaryLedger,
} = usePmccStore()

const selectedStudentId = ref('stu-1')
const term = ref('1st Semester AY 2026-2027')
const selectedSubjectIds = ref(['sub-1', 'sub-2', 'sub-3', 'sub-4', 'sub-5', 'sub-6', 'sub-7'])
const miscFee = ref(2000)
const termStarted = ref(true)

const soaDialog = ref(false)
const soaLedger = ref(null)

const snackbar = ref(false)
const snackText = ref('')
const snackColor = ref('success')

const formatPeso = (val) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(Number(val || 0))
}

const currentStudent = computed(() => {
  return students.value.find((s) => s.id === selectedStudentId.value) || null
})

watch(
  selectedStudentId,
  (newId) => {
    const ledger = getStudentLedger(newId)
    if (ledger.enrollment) {
      term.value = ledger.enrollment.term
      selectedSubjectIds.value = [...ledger.enrollment.subjectIds]
      miscFee.value = Number(ledger.enrollment.miscFee)
      termStarted.value = Boolean(ledger.enrollment.termStarted)
    } else {
      term.value = '1st Semester AY 2026-2027'
      selectedSubjectIds.value = []
      miscFee.value = 2000
      termStarted.value = true
    }
  },
  { immediate: true }
)

const liveAssessment = computed(() => {
  const chosen = subjects.value.filter((sub) => selectedSubjectIds.value.includes(sub.id))
  const totalUnits = chosen.reduce((sum, sub) => sum + Number(sub.units || 0), 0)
  const tuition = chosen.reduce((sum, sub) => sum + Number(sub.units || 0) * Number(sub.ratePerUnit || 0), 0)
  const labFees = chosen.reduce((sum, sub) => sum + Number(sub.labFee || 0), 0)
  const misc = Math.max(0, Number(miscFee.value || 0))
  const totalAssessment = tuition + labFees + misc

  const discountRate = currentStudent.value ? Number(currentStudent.value.discountRate || 0) : 0
  const discountAmount = Math.round(tuition * discountRate)
  const netAmountDue = Math.max(0, totalAssessment - discountAmount)

  const existingPayments = getStudentLedger(selectedStudentId.value).totalPayments || 0
  const estimatedBalance = Math.max(0, netAmountDue - existingPayments)

  return {
    chosen,
    totalUnits,
    tuition,
    labFees,
    misc,
    totalAssessment,
    discountRate,
    discountAmount,
    netAmountDue,
    existingPayments,
    estimatedBalance,
  }
})

const handleSaveEnrollment = () => {
  if (!selectedStudentId.value) {
    snackText.value = 'Please select a student first.'
    snackColor.value = 'warning'
    snackbar.value = true
    return
  }

  if (selectedSubjectIds.value.length === 0) {
    snackText.value = 'Please select at least one subject to enroll.'
    snackColor.value = 'warning'
    snackbar.value = true
    return
  }

  saveEnrollment({
    studentId: selectedStudentId.value,
    term: term.value.trim() || '1st Semester AY 2026-2027',
    subjectIds: [...selectedSubjectIds.value],
    miscFee: Math.max(0, Number(miscFee.value || 0)),
    termStarted: termStarted.value,
  })

  snackText.value = 'Enrollment assessed, saved, and posted to Accounts Receivable!'
  snackColor.value = 'success'
  snackbar.value = true
}

const openSoa = (studentId) => {
  soaLedger.value = getStudentLedger(studentId)
  soaDialog.value = true
}

const printSoa = () => {
  if (typeof window !== 'undefined') {
    window.print()
  }
}
</script>

<template>
  <div>
    <!-- Frosted Dark Hero Card -->
    <v-card class="glass-hero-dark pa-5 pa-md-6 mb-6 no-print">
      <div class="d-flex flex-wrap align-center justify-space-between ga-4">
        <div>
          <div class="text-caption text-light-green-lighten-3 font-weight-bold mb-1" style="letter-spacing: 1px;">
            REGISTRAR & FEE ASSESSMENT
          </div>
          <h1 class="text-h5 text-md-h4 font-weight-bold text-white mb-1">
            Enrollment & <span class="glass-serif">Assessment</span>
          </h1>
          <p class="text-body-2 text-grey-lighten-2 mb-0">
            Select subjects, auto-compute tuition & lab fees, apply scholarships, and check exam permits.
          </p>
        </div>

        <v-btn
          color="#ffffff"
          variant="flat"
          class="text-none rounded-pill font-weight-bold px-5"
          style="color: #141c18 !important;"
          prepend-icon="mdi-content-save-check-outline"
          @click="handleSaveEnrollment"
        >
          Save & Post Assessment
        </v-btn>
      </div>
    </v-card>

    <!-- Builder + Live Computation Glass Grid -->
    <v-row class="mb-6 no-print">
      <v-col cols="12" lg="7">
        <v-card class="glass-panel pa-5 h-100">
          <h2 class="text-h6 font-weight-bold text-grey-darken-4 mb-4">1. Student & Term Setup</h2>

          <v-row class="mb-3">
            <v-col cols="12" sm="6">
              <v-select
                v-model="selectedStudentId"
                :items="students"
                item-title="fullName"
                item-value="id"
                label="Select Student"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="term"
                label="Academic Term"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>

          <v-row class="mb-4">
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="miscFee"
                type="number"
                min="0"
                label="Miscellaneous Fee (₱)"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" sm="6" class="d-flex align-center">
              <v-switch
                v-model="termStarted"
                color="green-darken-2"
                label="Term Already Started (Revenue Earned)"
                hide-details
              />
            </v-col>
          </v-row>

          <h2 class="text-h6 font-weight-bold text-grey-darken-4 mb-3">2. Enrolled Subjects</h2>

          <v-row>
            <v-col v-for="sub in subjects" :key="sub.id" cols="12" sm="6">
              <div class="glass-subject-tile pa-3 rounded-xl">
                <v-checkbox
                  v-model="selectedSubjectIds"
                  :value="sub.id"
                  color="green-darken-2"
                  density="compact"
                  hide-details
                >
                  <template #label>
                    <div class="text-body-2">
                      <span class="font-weight-bold text-grey-darken-4">{{ sub.code }}</span>
                      <span class="text-grey-darken-3"> — {{ sub.title }}</span>
                      <div class="text-caption text-grey-darken-2">
                        {{ sub.units }} units • Lab: {{ formatPeso(sub.labFee) }}
                      </div>
                    </div>
                  </template>
                </v-checkbox>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- Live Fee Assessment Card -->
      <v-col cols="12" lg="5">
        <v-card class="glass-panel pa-5 h-100 d-flex flex-column justify-space-between">
          <div>
            <div class="d-flex align-center justify-space-between ga-2 mb-4">
              <h2 class="text-h6 font-weight-bold text-grey-darken-4">Automatic Fee Breakdown</h2>
              <v-chip size="small" color="#141c18" variant="flat" class="text-white font-weight-semibold">
                {{ currentStudent?.scholarshipType || 'None' }}
              </v-chip>
            </div>

            <div class="glass-line">
              <span class="text-grey-darken-2">Total Enrolled Units</span>
              <span class="font-weight-bold text-grey-darken-4">{{ liveAssessment.totalUnits }} Units</span>
            </div>

            <div class="glass-line">
              <span class="text-grey-darken-2">Tuition ({{ liveAssessment.totalUnits }} u × ₱500)</span>
              <span class="font-weight-semibold text-grey-darken-4">{{ formatPeso(liveAssessment.tuition) }}</span>
            </div>

            <div class="glass-line">
              <span class="text-grey-darken-2">Laboratory Fees</span>
              <span class="font-weight-semibold text-grey-darken-4">{{ formatPeso(liveAssessment.labFees) }}</span>
            </div>

            <div class="glass-line">
              <span class="text-grey-darken-2">Miscellaneous Fees</span>
              <span class="font-weight-semibold text-grey-darken-4">{{ formatPeso(liveAssessment.misc) }}</span>
            </div>

            <div class="glass-sep my-3"></div>

            <div class="glass-line">
              <span class="font-weight-bold text-grey-darken-4">Total Assessment</span>
              <span class="font-weight-bold text-grey-darken-4">{{ formatPeso(liveAssessment.totalAssessment) }}</span>
            </div>

            <div class="glass-line">
              <span class="text-grey-darken-2">
                Scholarship Discount ({{ Math.round(liveAssessment.discountRate * 100) }}% of Tuition)
              </span>
              <span class="font-weight-bold text-green-darken-3">-{{ formatPeso(liveAssessment.discountAmount) }}</span>
            </div>

            <div class="glass-sep my-3"></div>

            <div class="glass-line">
              <span class="text-subtitle-1 font-weight-bold text-grey-darken-4">Net Amount Due</span>
              <span class="text-h6 font-weight-extrabold text-grey-darken-4">{{ formatPeso(liveAssessment.netAmountDue) }}</span>
            </div>

            <div class="glass-line">
              <span class="text-grey-darken-2">Payments Made</span>
              <span class="font-weight-semibold text-green-darken-3">{{ formatPeso(liveAssessment.existingPayments) }}</span>
            </div>

            <div class="glass-line mt-2">
              <span class="text-subtitle-1 font-weight-bold text-amber-darken-4">Remaining Balance</span>
              <span class="text-h6 font-weight-extrabold text-amber-darken-4">
                {{ formatPeso(liveAssessment.estimatedBalance) }}
              </span>
            </div>
          </div>

          <div class="mt-5 pt-4" style="border-top: 1px solid rgba(20, 28, 24, 0.1);">
            <div class="d-flex align-center justify-space-between mb-3">
              <span class="text-caption text-grey-darken-2 font-weight-semibold">Exam Permit Rule:</span>
              <v-chip
                size="small"
                variant="flat"
                class="font-weight-bold"
                :color="liveAssessment.estimatedBalance > 0 ? 'red-darken-2' : 'green-darken-2'"
              >
                {{ liveAssessment.estimatedBalance > 0 ? 'BLOCKED (Balance > ₱0)' : 'CLEARED (₱0 Balance)' }}
              </v-chip>
            </div>

            <v-btn
              block
              color="#141c18"
              variant="flat"
              class="text-none rounded-pill text-white font-weight-bold"
              prepend-icon="mdi-printer-outline"
              @click="openSoa(selectedStudentId)"
            >
              Preview Statement of Account (SOA)
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Assessed Students Glass Feed -->
    <v-card class="glass-panel pa-5 no-print">
      <h2 class="text-h6 font-weight-bold text-grey-darken-4 mb-4">Assessed Students & Exam Permit Clearance</h2>

      <div class="d-flex flex-column ga-3">
        <div
          v-for="item in subsidiaryLedger"
          :key="item.student?.id"
          class="glass-enroll-row pa-4 rounded-2xl d-flex flex-wrap align-center justify-space-between ga-3"
        >
          <div>
            <div class="text-subtitle-2 font-weight-bold text-grey-darken-4">
              {{ item.student?.fullName }}
              <span class="text-caption text-grey-darken-2 ml-2">{{ item.student?.studentNo }}</span>
            </div>
            <div class="text-caption text-grey-darken-2 mt-1">
              {{ item.totalUnits }} units • Net Due: <strong>{{ formatPeso(item.netAmountDue) }}</strong>
            </div>
          </div>

          <div class="d-flex align-center ga-3 flex-wrap">
            <div class="text-right">
              <div class="text-caption text-grey-darken-2">Balance</div>
              <div
                class="text-subtitle-2 font-weight-extrabold"
                :class="item.balance > 0 ? 'text-amber-darken-4' : 'text-green-darken-3'"
              >
                {{ formatPeso(item.balance) }}
              </div>
            </div>

            <v-chip
              size="small"
              variant="flat"
              class="font-weight-bold"
              :color="item.examPermitStatus === 'CLEARED' ? 'green-darken-2' : item.examPermitStatus === 'BLOCKED' ? 'red-darken-2' : 'grey-darken-1'"
            >
              {{ item.examPermitStatus }}
            </v-chip>

            <v-btn
              size="small"
              variant="tonal"
              color="grey-darken-4"
              class="text-none rounded-pill font-weight-semibold"
              prepend-icon="mdi-file-document-outline"
              @click="openSoa(item.student?.id)"
            >
              View SOA
            </v-btn>
          </div>
        </div>
      </div>
    </v-card>

    <!-- Statement of Account (SOA) Modal -->
    <v-dialog v-model="soaDialog" max-width="620">
      <v-card v-if="soaLedger" class="glass-modal pa-7">
        <div class="d-flex align-start justify-space-between mb-4">
          <div>
            <div class="text-caption text-green-darken-3 font-weight-bold">STATEMENT OF ACCOUNT</div>
            <h3 class="text-h5 font-weight-bold text-grey-darken-4">Perfecto Mahusay Community College</h3>
            <div class="text-caption text-grey-darken-2">
              {{ soaLedger.enrollment?.term || '1st Semester AY 2026-2027' }}
            </div>
          </div>
          <v-btn icon="mdi-close" size="small" variant="text" color="grey-darken-3" class="no-print" @click="soaDialog = false" />
        </div>

        <div class="glass-subject-tile pa-4 rounded-xl mb-4">
          <div class="text-subtitle-1 font-weight-bold text-grey-darken-4">{{ soaLedger.student?.fullName }}</div>
          <div class="text-caption text-grey-darken-2">
            ID: {{ soaLedger.student?.studentNo }} • {{ soaLedger.student?.program }} ({{ soaLedger.student?.yearLevel }})
          </div>
          <div class="text-caption text-amber-darken-4 font-weight-semibold mt-1">
            Scholarship: {{ soaLedger.student?.scholarshipType }}
          </div>
        </div>

        <div class="glass-line">
          <span class="text-grey-darken-2">Tuition ({{ soaLedger.totalUnits }} units)</span>
          <span class="text-grey-darken-4 font-weight-semibold">{{ formatPeso(soaLedger.tuition) }}</span>
        </div>
        <div class="glass-line">
          <span class="text-grey-darken-2">Laboratory Fees</span>
          <span class="text-grey-darken-4 font-weight-semibold">{{ formatPeso(soaLedger.labFees) }}</span>
        </div>
        <div class="glass-line">
          <span class="text-grey-darken-2">Miscellaneous Fees</span>
          <span class="text-grey-darken-4 font-weight-semibold">{{ formatPeso(soaLedger.miscFees) }}</span>
        </div>
        <div class="glass-line">
          <span class="text-grey-darken-2">Less: Scholarship Discount</span>
          <span class="text-green-darken-3 font-weight-bold">-{{ formatPeso(soaLedger.discountAmount) }}</span>
        </div>
        <div class="glass-sep my-2"></div>
        <div class="glass-line">
          <span class="font-weight-bold text-grey-darken-4">Net Amount Due</span>
          <span class="font-weight-bold text-grey-darken-4">{{ formatPeso(soaLedger.netAmountDue) }}</span>
        </div>
        <div class="glass-line">
          <span class="text-grey-darken-2">Total Payments Made</span>
          <span class="text-green-darken-3 font-weight-semibold">{{ formatPeso(soaLedger.totalPayments) }}</span>
        </div>
        <div class="glass-line mt-2">
          <span class="text-subtitle-1 font-weight-bold text-amber-darken-4">Remaining Balance</span>
          <span class="text-h6 font-weight-extrabold text-amber-darken-4">{{ formatPeso(soaLedger.balance) }}</span>
        </div>

        <div class="mt-4 d-flex align-center justify-space-between">
          <span class="text-caption text-grey-darken-2 font-weight-semibold">Examination Permit Status:</span>
          <v-chip
            size="small"
            variant="flat"
            class="font-weight-bold"
            :color="soaLedger.examPermitStatus === 'CLEARED' ? 'green-darken-2' : 'red-darken-2'"
          >
            {{ soaLedger.examPermitStatus }}
          </v-chip>
        </div>

        <div class="d-flex justify-end ga-2 mt-6 no-print">
          <v-btn variant="text" color="grey-darken-3" class="text-none rounded-pill" @click="soaDialog = false">
            Close
          </v-btn>
          <v-btn color="#141c18" variant="flat" class="text-none rounded-pill px-5 text-white font-weight-bold" prepend-icon="mdi-printer" @click="printSoa">
            Print SOA
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackColor" :timeout="2800" rounded="lg">
      {{ snackText }}
    </v-snackbar>
  </div>
</template>

<style scoped>
.glass-subject-tile,
.glass-enroll-row {
  background: rgba(255, 255, 255, 0.58);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.82);
}

.glass-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
  font-size: 14px;
}

.glass-sep {
  height: 1px;
  background: rgba(20, 28, 24, 0.12);
}
</style>