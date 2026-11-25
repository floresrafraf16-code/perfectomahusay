<script setup>
definePageMeta({
  layout: 'default'
})

const {
  students,
  payments,
  journalEntries,
  subsidiaryLedger,
  accountingSummary,
  uncollectibleRate,
  getStudentLedger,
  recordPayment,
} = usePmccStore()

const selectedStudentId = ref('stu-1')
const paymentAmount = ref(6900)
const paymentRemarks = ref('Tuition / Balance Payment')

const filterDate = ref('2026-11-26')
const uncollectiblePercentInput = ref(Number((uncollectibleRate.value * 100).toFixed(1)))

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

watch(
  selectedStudentId,
  (newId) => {
    const ledger = getStudentLedger(newId)
    paymentAmount.value = ledger.balance > 0 ? ledger.balance : 1000
  },
  { immediate: true }
)

watch(uncollectiblePercentInput, (val) => {
  const num = Math.max(0, Math.min(100, Number(val || 0)))
  uncollectibleRate.value = num / 100
})

const handlePostPayment = () => {
  const amt = Number(paymentAmount.value || 0)
  if (!selectedStudentId.value || amt <= 0) {
    snackText.value = 'Please select a student and enter a valid payment amount greater than ₱0.'
    snackColor.value = 'warning'
    snackbar.value = true
    return
  }

  recordPayment(selectedStudentId.value, amt, paymentRemarks.value.trim() || 'Tuition Payment')

  const updatedLedger = getStudentLedger(selectedStudentId.value)
  paymentAmount.value = updatedLedger.balance > 0 ? updatedLedger.balance : 0

  snackText.value = `Payment posted! New balance: ${formatPeso(updatedLedger.balance)} (Permit: ${updatedLedger.examPermitStatus})`
  snackColor.value = 'success'
  snackbar.value = true
}

const dailyCollections = computed(() => {
  if (!filterDate.value) return payments.value
  return payments.value.filter((p) => p.date === filterDate.value)
})

const dailyCollectionTotal = computed(() => {
  return dailyCollections.value.reduce((sum, p) => sum + Number(p.amount || 0), 0)
})

const getStudentName = (studentId) => {
  return students.value.find((s) => s.id === studentId)?.fullName || 'Unknown Student'
}

const printReport = () => {
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
            CASHIER & ACCOUNTING LEDGER
          </div>
          <h1 class="text-h5 text-md-h4 font-weight-bold text-white mb-1">
            Payments, AR Ledger & <span class="glass-serif">Journals</span>
          </h1>
          <p class="text-body-2 text-grey-lighten-2 mb-0">
            Post official receipts, reconcile Subsidiary Ledger with AR Control, and print Daily Collection Reports.
          </p>
        </div>

        <v-btn
          color="#ffffff"
          variant="flat"
          class="text-none rounded-pill font-weight-bold px-5"
          style="color: #141c18 !important;"
          prepend-icon="mdi-printer-outline"
          @click="printReport"
        >
          Print Daily Collection Report
        </v-btn>
      </div>
    </v-card>

    <!-- Accounting Glass Summary Row -->
    <v-row class="mb-6 no-print">
      <v-col cols="12" sm="6" lg="3">
        <v-card class="glass-panel pa-4 h-100">
          <div class="text-caption text-grey-darken-2 font-weight-semibold">AR CONTROL TOTAL</div>
          <div class="text-h5 font-weight-extrabold text-amber-darken-4 mt-1">
            {{ formatPeso(accountingSummary.arControlTotal) }}
          </div>
          <div class="text-caption text-grey-darken-2 mt-1">
            Agrees with Subsidiary Ledger sum
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="glass-panel pa-4 h-100">
          <div class="text-caption text-grey-darken-2 font-weight-semibold">TOTAL COLLECTIONS</div>
          <div class="text-h5 font-weight-extrabold text-green-darken-3 mt-1">
            {{ formatPeso(accountingSummary.totalCollections) }}
          </div>
          <div class="text-caption text-green-darken-3 font-weight-semibold mt-1">
            Collection Rate: {{ accountingSummary.collectionRate.toFixed(1) }}%
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="glass-panel pa-4 h-100">
          <div class="text-caption text-grey-darken-2 font-weight-semibold">ALLOWANCE FOR DOUBTFUL</div>
          <div class="text-h5 font-weight-extrabold text-grey-darken-4 mt-1">
            {{ formatPeso(accountingSummary.allowanceForDoubtful) }}
          </div>
          <div class="d-flex align-center ga-2 mt-1">
            <span class="text-caption text-grey-darken-2">Est. Uncollectible %:</span>
            <input
              v-model.number="uncollectiblePercentInput"
              type="number"
              min="0"
              max="100"
              step="0.5"
              class="glass-rate-input"
            />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="glass-panel pa-4 h-100">
          <div class="text-caption text-grey-darken-2 font-weight-semibold">EXAM PERMIT STATUS</div>
          <div class="text-h6 font-weight-extrabold text-grey-darken-4 mt-1">
            <span class="text-red-darken-2">{{ accountingSummary.blockedPermitsCount }} Blocked</span>
            <span class="text-grey-darken-2 mx-1">/</span>
            <span class="text-green-darken-3">{{ accountingSummary.clearedPermitsCount }} Cleared</span>
          </div>
          <div class="text-caption text-grey-darken-2 mt-1">
            Auto-clears when balance = ₱0.00
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Cashier Payment Form + Daily Collection Report -->
    <v-row class="mb-6">
      <v-col cols="12" lg="5" class="no-print">
        <v-card class="glass-panel pa-5 h-100">
          <div class="d-flex align-center ga-2 mb-4">
            <div class="glass-cash-badge">
              <v-icon size="20" color="white">mdi-cash-register</v-icon>
            </div>
            <h2 class="text-h6 font-weight-bold text-grey-darken-4">Cashier Payment Entry</h2>
          </div>

          <v-select
            v-model="selectedStudentId"
            :items="students"
            item-title="fullName"
            item-value="id"
            label="Select Student"
            variant="outlined"
            density="comfortable"
            class="mb-3"
          />

          <div class="glass-info-box pa-3 rounded-xl mb-3">
            <div class="d-flex justify-space-between text-caption text-grey-darken-2 mb-1">
              <span>Current Student Balance:</span>
              <span class="font-weight-extrabold text-amber-darken-4">
                {{ formatPeso(getStudentLedger(selectedStudentId).balance) }}
              </span>
            </div>
            <div class="d-flex justify-space-between text-caption text-grey-darken-2">
              <span>Current Exam Permit:</span>
              <span class="font-weight-bold text-grey-darken-4">
                {{ getStudentLedger(selectedStudentId).examPermitStatus }}
              </span>
            </div>
          </div>

          <v-text-field
            v-model.number="paymentAmount"
            type="number"
            min="1"
            label="Payment Amount (₱)"
            variant="outlined"
            density="comfortable"
            class="mb-3"
          />

          <v-text-field
            v-model="paymentRemarks"
            label="Payment Remarks / OR Note"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          />

          <v-btn
            block
            size="large"
            color="#141c18"
            variant="flat"
            class="text-none rounded-pill text-white font-weight-bold"
            prepend-icon="mdi-receipt-text-check-outline"
            @click="handlePostPayment"
          >
            Post Official Receipt & Update Balance
          </v-btn>
        </v-card>
      </v-col>

      <!-- Daily Collection Report -->
      <v-col cols="12" lg="7">
        <v-card class="glass-panel pa-5 h-100 d-flex flex-column justify-space-between">
          <div>
            <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-4">
              <div>
                <h2 class="text-h6 font-weight-bold text-grey-darken-4">Daily Collection Report</h2>
                <div class="text-caption text-grey-darken-2">
                  Cashier receipts recorded for the selected date
                </div>
              </div>

              <v-text-field
                v-model="filterDate"
                type="date"
                label="Collection Date"
                variant="outlined"
                density="compact"
                hide-details
                style="max-width: 195px;"
              />
            </div>

            <div class="d-flex flex-column ga-2">
              <div
                v-for="pay in dailyCollections"
                :key="pay.id"
                class="glass-row-item pa-3 rounded-xl d-flex flex-wrap align-center justify-space-between ga-2"
              >
                <div>
                  <div class="text-body-2 font-weight-bold text-grey-darken-4">
                    {{ pay.orNumber }} — {{ getStudentName(pay.studentId) }}
                  </div>
                  <div class="text-caption text-grey-darken-2">
                    {{ pay.date }} • {{ pay.remarks }}
                  </div>
                </div>
                <div class="text-subtitle-2 font-weight-extrabold text-green-darken-3">
                  {{ formatPeso(pay.amount) }}
                </div>
              </div>

              <div v-if="dailyCollections.length === 0" class="glass-row-item pa-5 rounded-xl text-center text-caption text-grey-darken-2">
                No collections recorded for {{ filterDate }}.
              </div>
            </div>
          </div>

          <div class="d-flex align-center justify-space-between mt-4 pt-3" style="border-top: 1px solid rgba(20, 28, 24, 0.12);">
            <span class="text-subtitle-2 font-weight-bold text-grey-darken-4">Daily Collection Total:</span>
            <span class="text-h6 font-weight-extrabold text-green-darken-3">
              {{ formatPeso(dailyCollectionTotal) }}
            </span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Subsidiary Ledger Reconciled to AR Control Total -->
    <v-card class="glass-panel pa-5 mb-6">
      <div class="d-flex flex-wrap align-center justify-space-between ga-2 mb-4">
        <div>
          <h2 class="text-h6 font-weight-bold text-grey-darken-4">Accounts Receivable Subsidiary Ledger</h2>
          <p class="text-caption text-grey-darken-2 mb-0">
            Sum of individual student balances agrees with the AR Control Total.
          </p>
        </div>
        <v-chip color="#141c18" variant="flat" class="text-white font-weight-bold">
          AR Control Total: {{ formatPeso(accountingSummary.arControlTotal) }}
        </v-chip>
      </div>

      <div class="d-flex flex-column ga-2">
        <div
          v-for="row in subsidiaryLedger"
          :key="row.student?.id"
          class="glass-row-item pa-3 rounded-xl d-flex flex-wrap align-center justify-space-between ga-3"
        >
          <div>
            <div class="text-body-2 font-weight-bold text-grey-darken-4">
              {{ row.student?.fullName }}
              <span class="text-caption text-grey-darken-2 ml-2">{{ row.student?.studentNo }}</span>
            </div>
            <div class="text-caption text-grey-darken-2">
              Net Due: {{ formatPeso(row.netAmountDue) }} • Paid: {{ formatPeso(row.totalPayments) }}
            </div>
          </div>

          <div class="d-flex align-center ga-3">
            <div class="text-right">
              <div class="text-caption text-grey-darken-2">Subsidiary Balance</div>
              <div
                class="text-subtitle-2 font-weight-extrabold"
                :class="row.balance > 0 ? 'text-amber-darken-4' : 'text-green-darken-3'"
              >
                {{ formatPeso(row.balance) }}
              </div>
            </div>

            <v-chip
              size="x-small"
              variant="flat"
              class="font-weight-bold"
              :color="row.examPermitStatus === 'CLEARED' ? 'green-darken-2' : row.examPermitStatus === 'BLOCKED' ? 'red-darken-2' : 'grey-darken-1'"
            >
              {{ row.examPermitStatus }}
            </v-chip>
          </div>
        </div>
      </div>
    </v-card>

    <!-- Automatic Accounting Journal Entries -->
    <v-card class="glass-panel pa-5 no-print">
      <h2 class="text-h6 font-weight-bold text-grey-darken-4 mb-1">Accounting Journal Entries</h2>
      <p class="text-caption text-grey-darken-2 mb-4">
        Accrual entries on enrollment and cash receipt entries on payment posting.
      </p>

      <div class="d-flex flex-column ga-3">
        <div
          v-for="je in journalEntries"
          :key="je.id"
          class="glass-row-item pa-4 rounded-xl"
        >
          <div class="d-flex flex-wrap align-center justify-space-between ga-2 mb-2">
            <div>
              <span class="text-caption font-weight-bold text-grey-darken-4">{{ je.reference }}</span>
              <span class="text-caption text-grey-darken-2 ml-2">{{ je.date }} • {{ je.description }}</span>
            </div>
            <span class="text-subtitle-2 font-weight-extrabold text-grey-darken-4">
              {{ formatPeso(je.amount) }}
            </span>
          </div>

          <div class="d-flex justify-space-between text-caption text-grey-darken-3">
            <span><strong>Dr.</strong> {{ je.debitAccount }}</span>
            <span class="font-weight-bold text-green-darken-3">{{ formatPeso(je.amount) }}</span>
          </div>
          <div class="d-flex justify-space-between text-caption text-grey-darken-3 pl-4 mt-1">
            <span><strong>Cr.</strong> {{ je.creditAccount }}</span>
            <span class="font-weight-bold text-amber-darken-4">{{ formatPeso(je.amount) }}</span>
          </div>
        </div>
      </div>
    </v-card>

    <v-snackbar v-model="snackbar" :color="snackColor" :timeout="3000" rounded="lg">
      {{ snackText }}
    </v-snackbar>
  </div>
</template>

<style scoped>
.glass-cash-badge {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: #141c18;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glass-info-box,
.glass-row-item {
  background: rgba(255, 255, 255, 0.58);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.82);
}

.glass-rate-input {
  width: 64px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(20, 28, 24, 0.22);
  border-radius: 8px;
  color: #111827;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 6px;
}
</style>