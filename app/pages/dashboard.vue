<script setup>
definePageMeta({
  layout: 'default'
})

const {
  students,
  subjects,
  subsidiaryLedger,
  accountingSummary,
} = usePmccStore()

const hideAmounts = ref(false)

const formatPeso = (val) => {
  if (hideAmounts.value) return '₱ ••••••'
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(Number(val || 0))
}
</script>

<template>
  <div>
    <!-- Frosted Dark Hero Card -->
    <v-card class="glass-hero-dark pa-5 pa-md-6 mb-6">
      <div class="d-flex flex-wrap align-center justify-space-between ga-4">
        <div>
          <div class="text-caption text-light-green-lighten-3 font-weight-bold mb-1" style="letter-spacing: 1px;">
            PERFECTO MAHUSAY COMMUNITY COLLEGE
          </div>
          <h1 class="text-h5 text-md-h4 font-weight-bold text-white mb-1">
            Enrollment & <span class="glass-serif">Accounting</span> Glass Hub
          </h1>
          <p class="text-body-2 text-grey-lighten-2 mb-0">
            Frosted glass workspace for fee assessments, student balances, and exam permit clearances.
          </p>
        </div>

        <div class="d-flex flex-wrap ga-2">
          <v-btn
            to="/enrollments"
            color="#ffffff"
            variant="flat"
            class="text-none rounded-pill font-weight-bold"
            style="color: #141c18 !important;"
            prepend-icon="mdi-plus-circle-outline"
          >
            Assess & Enroll
          </v-btn>
          <v-btn
            to="/accounting"
            variant="outlined"
            color="#bbf7d0"
            class="text-none rounded-pill font-weight-semibold"
            prepend-icon="mdi-cash-fast"
          >
            Record Payment
          </v-btn>
        </div>
      </div>
    </v-card>

    <!-- Balance & KPI Row -->
    <div class="d-flex align-center justify-space-between mb-3">
      <div class="d-flex align-center ga-2">
        <span class="text-subtitle-1 font-weight-bold text-grey-darken-4">Glass Balances & Metrics</span>
        <v-btn
          :icon="hideAmounts ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          size="x-small"
          variant="text"
          color="grey-darken-3"
          @click="hideAmounts = !hideAmounts"
        />
      </div>
      <span class="text-caption text-grey-darken-2 font-weight-semibold">
        Collection Rate: {{ accountingSummary.collectionRate.toFixed(1) }}%
      </span>
    </div>

    <v-row class="mb-6">
      <v-col cols="12" sm="6" lg="3">
        <v-card class="glass-panel pa-5 h-100">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="glass-icon-chip">
              <v-icon size="20" color="#141c18">mdi-scale-balance</v-icon>
            </div>
            <v-chip size="x-small" color="amber-darken-3" variant="tonal" class="font-weight-bold">
              AR CONTROL
            </v-chip>
          </div>
          <div class="text-caption text-grey-darken-2 font-weight-medium">Unpaid Student Balances</div>
          <div class="text-h5 font-weight-extrabold text-grey-darken-4 mt-1">
            {{ formatPeso(accountingSummary.arControlTotal) }}
          </div>
          <div class="text-caption text-grey-darken-2 mt-1">
            Net Billings: {{ formatPeso(accountingSummary.totalBillings) }}
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="glass-panel pa-5 h-100">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="glass-icon-chip">
              <v-icon size="20" color="#141c18">mdi-cash-check</v-icon>
            </div>
            <v-chip size="x-small" color="green-darken-2" variant="tonal" class="font-weight-bold">
              COLLECTED
            </v-chip>
          </div>
          <div class="text-caption text-grey-darken-2 font-weight-medium">Total Tuition Collections</div>
          <div class="text-h5 font-weight-extrabold text-grey-darken-4 mt-1">
            {{ formatPeso(accountingSummary.totalCollections) }}
          </div>
          <div class="text-caption text-green-darken-3 font-weight-semibold mt-1">
            {{ accountingSummary.collectionRate.toFixed(1) }}% collected
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="glass-panel pa-5 h-100">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="glass-icon-chip">
              <v-icon size="20" color="#141c18">mdi-shield-lock-outline</v-icon>
            </div>
            <v-chip size="x-small" color="red-darken-2" variant="tonal" class="font-weight-bold">
              PERMITS
            </v-chip>
          </div>
          <div class="text-caption text-grey-darken-2 font-weight-medium">Exam Permit Holds</div>
          <div class="text-h5 font-weight-extrabold text-grey-darken-4 mt-1">
            {{ accountingSummary.blockedPermitsCount }} Blocked
          </div>
          <div class="text-caption text-grey-darken-2 mt-1">
            {{ accountingSummary.clearedPermitsCount }} Cleared (₱0 Balance)
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="3">
        <v-card class="glass-panel pa-5 h-100">
          <div class="d-flex align-center justify-space-between mb-3">
            <div class="glass-icon-chip">
              <v-icon size="20" color="#141c18">mdi-account-school-outline</v-icon>
            </div>
            <v-chip size="x-small" color="grey-darken-3" variant="tonal" class="font-weight-bold">
              CATALOG
            </v-chip>
          </div>
          <div class="text-caption text-grey-darken-2 font-weight-medium">Registered & Subjects</div>
          <div class="text-h5 font-weight-extrabold text-grey-darken-4 mt-1">
            {{ students.length }} Students
          </div>
          <div class="text-caption text-grey-darken-2 mt-1">
            {{ subjects.length }} Subjects Offered
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Frosted Shortcut Tiles -->
    <div class="text-subtitle-1 font-weight-bold text-grey-darken-4 mb-3">Quick Shortcuts</div>
    <v-row class="mb-6">
      <v-col cols="6" sm="3">
        <v-card to="/students" hover class="glass-panel pa-4 text-center h-100">
          <div class="glass-shortcut-icon mx-auto mb-2">
            <v-icon size="20" color="#141c18">mdi-account-plus-outline</v-icon>
          </div>
          <div class="text-caption font-weight-bold text-grey-darken-4">Students & Scholars</div>
        </v-card>
      </v-col>

      <v-col cols="6" sm="3">
        <v-card to="/courses" hover class="glass-panel pa-4 text-center h-100">
          <div class="glass-shortcut-icon mx-auto mb-2">
            <v-icon size="20" color="#141c18">mdi-book-open-outline</v-icon>
          </div>
          <div class="text-caption font-weight-bold text-grey-darken-4">Subjects & Rates</div>
        </v-card>
      </v-col>

      <v-col cols="6" sm="3">
        <v-card to="/enrollments" hover class="glass-panel pa-4 text-center h-100">
          <div class="glass-shortcut-icon mx-auto mb-2">
            <v-icon size="20" color="#141c18">mdi-file-document-outline</v-icon>
          </div>
          <div class="text-caption font-weight-bold text-grey-darken-4">Assessment & SOA</div>
        </v-card>
      </v-col>

      <v-col cols="6" sm="3">
        <v-card to="/accounting" hover class="glass-panel pa-4 text-center h-100">
          <div class="glass-shortcut-icon mx-auto mb-2">
            <v-icon size="20" color="#141c18">mdi-receipt-text-outline</v-icon>
          </div>
          <div class="text-caption font-weight-bold text-grey-darken-4">Cashier & Reports</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Subsidiary Ledger Glass Rows -->
    <v-card class="glass-panel pa-5">
      <div class="d-flex flex-wrap align-center justify-space-between ga-2 mb-4">
        <div>
          <h2 class="text-h6 font-weight-bold text-grey-darken-4">Student Subsidiary Balances</h2>
          <p class="text-caption text-grey-darken-2 mb-0">
            Reconciles automatically with the Accounts Receivable Control Total.
          </p>
        </div>
        <v-btn
          to="/accounting"
          variant="text"
          color="grey-darken-4"
          class="text-none font-weight-bold"
          append-icon="mdi-arrow-right"
        >
          Open Full Ledger
        </v-btn>
      </div>

      <div class="d-flex flex-column ga-3">
        <div
          v-for="row in subsidiaryLedger"
          :key="row.student?.id"
          class="glass-subrow pa-4 rounded-2xl d-flex flex-wrap align-center justify-space-between ga-3"
        >
          <div>
            <div class="d-flex align-center ga-2 flex-wrap">
              <span class="text-subtitle-2 font-weight-bold text-grey-darken-4">
                {{ row.student?.fullName }}
              </span>
              <v-chip size="x-small" color="#141c18" variant="flat" class="text-white font-weight-semibold">
                {{ row.student?.scholarshipType }}
              </v-chip>
            </div>
            <div class="text-caption text-grey-darken-2 mt-1">
              {{ row.student?.studentNo }} • {{ row.student?.program }} • Paid: {{ formatPeso(row.totalPayments) }}
            </div>
          </div>

          <div class="d-flex align-center ga-3">
            <div class="text-right">
              <div class="text-caption text-grey-darken-2">Balance</div>
              <div
                class="text-subtitle-1 font-weight-extrabold"
                :class="row.balance > 0 ? 'text-amber-darken-4' : 'text-green-darken-3'"
              >
                {{ formatPeso(row.balance) }}
              </div>
            </div>

            <v-chip
              size="small"
              variant="flat"
              class="font-weight-bold"
              :color="
                row.examPermitStatus === 'CLEARED'
                  ? 'green-darken-2'
                  : row.examPermitStatus === 'BLOCKED'
                  ? 'red-darken-2'
                  : 'grey-darken-1'
              "
            >
              {{ row.examPermitStatus }}
            </v-chip>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.glass-icon-chip,
.glass-shortcut-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.glass-subrow {
  background: rgba(255, 255, 255, 0.56);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.78);
}
</style>