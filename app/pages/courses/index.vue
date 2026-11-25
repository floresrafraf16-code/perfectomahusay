<script setup>
definePageMeta({
  layout: 'default'
})

const {
  subjects,
  addSubject,
} = usePmccStore()

const search = ref('')
const dialog = ref(false)
const editMode = ref(false)
const editingId = ref('')
const deleteDialog = ref(false)
const deletingSubject = ref(null)

const snackbar = ref(false)
const snackText = ref('')
const snackColor = ref('success')

const form = ref({
  code: '',
  title: '',
  units: 3,
  ratePerUnit: 500,
  labFee: 0,
})

const filteredSubjects = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return subjects.value
  return subjects.value.filter(
    (sub) =>
      sub.code.toLowerCase().includes(q) ||
      sub.title.toLowerCase().includes(q)
  )
})

const totalCatalogUnits = computed(() => {
  return subjects.value.reduce((sum, s) => sum + Number(s.units || 0), 0)
})

const totalLabCatalog = computed(() => {
  return subjects.value.reduce((sum, s) => sum + Number(s.labFee || 0), 0)
})

const formatPeso = (val) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(Number(val || 0))
}

const openAddDialog = () => {
  editMode.value = false
  editingId.value = ''
  form.value = {
    code: '',
    title: '',
    units: 3,
    ratePerUnit: 500,
    labFee: 0,
  }
  dialog.value = true
}

const openEditDialog = (sub) => {
  editMode.value = true
  editingId.value = sub.id
  form.value = {
    code: sub.code,
    title: sub.title,
    units: Number(sub.units),
    ratePerUnit: Number(sub.ratePerUnit),
    labFee: Number(sub.labFee),
  }
  dialog.value = true
}

const saveSubject = () => {
  if (!form.value.code.trim() || !form.value.title.trim()) {
    snackText.value = 'Please enter Subject Code and Descriptive Title.'
    snackColor.value = 'warning'
    snackbar.value = true
    return
  }

  const cleanPayload = {
    code: form.value.code.trim().toUpperCase(),
    title: form.value.title.trim(),
    units: Math.max(1, Number(form.value.units) || 1),
    ratePerUnit: Math.max(0, Number(form.value.ratePerUnit) || 0),
    labFee: Math.max(0, Number(form.value.labFee) || 0),
  }

  if (editMode.value) {
    const idx = subjects.value.findIndex((s) => s.id === editingId.value)
    if (idx !== -1) {
      subjects.value[idx] = {
        ...subjects.value[idx],
        ...cleanPayload,
      }
    }
    snackText.value = 'Subject updated successfully!'
  } else {
    addSubject(cleanPayload)
    snackText.value = 'New subject added to PMCC catalog!'
  }

  snackColor.value = 'success'
  snackbar.value = true
  dialog.value = false
}

const confirmDelete = (sub) => {
  deletingSubject.value = sub
  deleteDialog.value = true
}

const executeDelete = () => {
  if (!deletingSubject.value) return
  subjects.value = subjects.value.filter((s) => s.id !== deletingSubject.value.id)
  deleteDialog.value = false
  deletingSubject.value = null
  snackText.value = 'Subject removed from catalog.'
  snackColor.value = 'info'
  snackbar.value = true
}
</script>

<template>
  <div>
    <!-- Frosted Dark Hero Card -->
    <v-card class="glass-hero-dark pa-5 pa-md-6 mb-6">
      <div class="d-flex flex-wrap align-center justify-space-between ga-4">
        <div>
          <div class="text-caption text-light-green-lighten-3 font-weight-bold mb-1" style="letter-spacing: 1px;">
            CURRICULUM & FEE SCHEDULE
          </div>
          <h1 class="text-h5 text-md-h4 font-weight-bold text-white mb-1">
            Subjects & <span class="glass-serif">Rates</span>
          </h1>
          <p class="text-body-2 text-grey-lighten-2 mb-0">
            Configure credit units, rate per unit (₱500 default), and laboratory fees.
          </p>
        </div>

        <v-btn
          color="#ffffff"
          variant="flat"
          class="text-none rounded-pill font-weight-bold px-5"
          style="color: #141c18 !important;"
          prepend-icon="mdi-book-plus-outline"
          @click="openAddDialog"
        >
          Add Subject
        </v-btn>
      </div>
    </v-card>

    <!-- Summary Glass Row -->
    <v-row class="mb-6">
      <v-col cols="12" sm="4">
        <v-card class="glass-panel pa-4 h-100">
          <div class="text-caption text-grey-darken-2 font-weight-semibold">OFFERED SUBJECTS</div>
          <div class="text-h5 font-weight-extrabold text-grey-darken-4 mt-1">
            {{ subjects.length }} Subjects
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="glass-panel pa-4 h-100">
          <div class="text-caption text-grey-darken-2 font-weight-semibold">TOTAL CATALOG UNITS</div>
          <div class="text-h5 font-weight-extrabold text-grey-darken-4 mt-1">
            {{ totalCatalogUnits }} Units
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="glass-panel pa-4 h-100">
          <div class="text-caption text-grey-darken-2 font-weight-semibold">COMBINED LAB FEES</div>
          <div class="text-h5 font-weight-extrabold text-green-darken-3 mt-1">
            {{ formatPeso(totalLabCatalog) }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Search Glass Bar -->
    <v-card class="glass-panel pa-4 mb-6">
      <div class="d-flex flex-wrap align-center justify-space-between ga-3">
        <v-text-field
          v-model="search"
          placeholder="Search subject code or title..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          hide-details
          style="max-width: 420px; flex: 1;"
        />

        <v-chip color="#141c18" variant="flat" class="text-white font-weight-semibold">
          {{ filteredSubjects.length }} of {{ subjects.length }} Subjects
        </v-chip>
      </div>
    </v-card>

    <!-- Subject Glass Cards Grid -->
    <v-row>
      <v-col
        v-for="sub in filteredSubjects"
        :key="sub.id"
        cols="12"
        md="6"
        xl="4"
      >
        <v-card class="glass-panel pa-5 h-100 d-flex flex-column justify-space-between">
          <div>
            <div class="d-flex align-center justify-space-between ga-2 mb-3">
              <v-chip color="#141c18" variant="flat" size="small" class="text-white font-weight-bold">
                {{ sub.code }}
              </v-chip>
              <v-chip color="green-darken-2" variant="tonal" size="small" class="font-weight-bold">
                {{ sub.units }} Units
              </v-chip>
            </div>

            <div class="text-subtitle-1 font-weight-bold text-grey-darken-4 mb-3">
              {{ sub.title }}
            </div>

            <div class="glass-fee-box pa-3 rounded-xl mb-4">
              <div class="d-flex justify-space-between text-caption text-grey-darken-2 mb-1">
                <span>Rate per Unit:</span>
                <span class="font-weight-bold text-grey-darken-4">{{ formatPeso(sub.ratePerUnit) }}</span>
              </div>
              <div class="d-flex justify-space-between text-caption text-grey-darken-2 mb-1">
                <span>Laboratory Fee:</span>
                <span class="font-weight-bold text-amber-darken-4">{{ formatPeso(sub.labFee) }}</span>
              </div>
              <div class="d-flex justify-space-between text-caption pt-1" style="border-top: 1px dashed rgba(20, 28, 24, 0.14);">
                <span class="font-weight-bold text-grey-darken-4">Base Tuition:</span>
                <span class="font-weight-extrabold text-green-darken-3">
                  {{ formatPeso(Number(sub.units) * Number(sub.ratePerUnit)) }}
                </span>
              </div>
            </div>
          </div>

          <div class="d-flex justify-end ga-1">
            <v-btn
              icon="mdi-pencil-outline"
              size="small"
              variant="tonal"
              color="grey-darken-4"
              @click="openEditDialog(sub)"
            />
            <v-btn
              icon="mdi-delete-outline"
              size="small"
              variant="tonal"
              color="red-darken-2"
              @click="confirmDelete(sub)"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add / Edit Subject Glass Dialog -->
    <v-dialog v-model="dialog" max-width="480">
      <v-card class="glass-modal pa-6">
        <div class="d-flex align-center justify-space-between mb-4">
          <h3 class="text-h6 font-weight-bold text-grey-darken-4">
            {{ editMode ? 'Edit Subject' : 'Add New Subject' }}
          </h3>
          <v-btn icon="mdi-close" size="small" variant="text" color="grey-darken-3" @click="dialog = false" />
        </div>

        <v-text-field
          v-model="form.code"
          label="Subject Code (e.g., IT 204)"
          variant="outlined"
          density="comfortable"
          class="mb-3"
        />

        <v-text-field
          v-model="form.title"
          label="Descriptive Title"
          variant="outlined"
          density="comfortable"
          class="mb-3"
        />

        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model.number="form.units"
              type="number"
              min="1"
              label="Units"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model.number="form.ratePerUnit"
              type="number"
              min="0"
              label="Rate / Unit (₱)"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model.number="form.labFee"
              type="number"
              min="0"
              label="Lab Fee (₱)"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
        </v-row>

        <div class="d-flex justify-end ga-2 mt-5">
          <v-btn variant="text" color="grey-darken-3" class="text-none rounded-pill" @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="#141c18" variant="flat" class="text-none rounded-pill px-5 text-white font-weight-bold" @click="saveSubject">
            {{ editMode ? 'Save Changes' : 'Save Subject' }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Glass Dialog -->
    <v-dialog v-model="deleteDialog" max-width="380">
      <v-card class="glass-modal pa-6">
        <div class="text-h6 font-weight-bold text-grey-darken-4 mb-2">Delete Subject?</div>
        <p class="text-body-2 text-grey-darken-2 mb-5">
          Remove <strong>{{ deletingSubject?.code }} — {{ deletingSubject?.title }}</strong>?
        </p>
        <div class="d-flex justify-end ga-2">
          <v-btn variant="text" color="grey-darken-3" class="text-none rounded-pill" @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn color="red-darken-2" variant="flat" class="text-none rounded-pill text-white" @click="executeDelete">
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
.glass-fee-box {
  background: rgba(255, 255, 255, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.85);
}
</style>