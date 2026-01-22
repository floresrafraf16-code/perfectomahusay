<script setup>
definePageMeta({ layout: 'default' })
const router = useRouter()

const loading = ref(false)
const dialogSuccess = ref(false)
const dialogError = ref(false)
const statusMessage = ref('')

const form = ref({
  StudentID: '',
  FirstName: '',
  LastName: '',
  Email: ''
})

const submitForm = async () => {
  loading.value = true
  try {
    await $fetch('http://localhost:1337/api/students', {
      method: 'POST',
      body: { 
        data: {
          StudentID: form.value.StudentID,
          FirstName: form.value.FirstName,
          LastName: form.value.LastName,
          Email: form.value.Email
        } 
      }
    })
    
    // Imbes na alert, ipakita ang Success Popup
    statusMessage.value = "Student added to Enroll Pro successfully."
    dialogSuccess.value = true 
  } catch (error) {
    console.error(error)
    // Imbes na alert, ipakita ang Error Popup
    statusMessage.value = "Error: Check Strapi permissions or data format."
    dialogError.value = true
  } finally {
    loading.value = false
  }
}

// Function para sa button ng Success Modal
const handleSuccessDone = () => {
  dialogSuccess.value = false
  router.push('/students') 
}
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card max-width="550" width="100%" class="glass-form-card pa-8" elevation="0">
      
      <div class="text-center mb-6">
        <div class="icon-glow mb-4">
          <v-icon size="50" color="blue-lighten-3">mdi-account-plus-outline</v-icon>
        </div>
        <v-card-title class="text-h5 font-weight-bold text-white pa-0">Add New Student</v-card-title>
        <p class="text-caption text-grey-lighten-1">Enter student details to register in the system</p>
      </div>

      <v-form @submit.prevent="submitForm">
        <v-text-field v-model="form.StudentID" label="Student ID" variant="outlined" class="glass-input mb-2" required />
        <v-text-field v-model="form.FirstName" label="First Name" variant="outlined" class="glass-input mb-2" required />
        <v-text-field v-model="form.LastName" label="Last Name" variant="outlined" class="glass-input mb-2" required />
        <v-text-field v-model="form.Email" label="Email Address" type="email" variant="outlined" class="glass-input mb-6" required />
        
        <v-row>
          <v-col cols="6">
            <v-btn variant="text" color="grey-lighten-1" block to="/students" class="rounded-lg text-none">
              Cancel
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn type="submit" color="blue-darken-1" block size="large" class="rounded-lg login-btn" :loading="loading">
              Save Student
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <v-dialog v-model="dialogSuccess" max-width="400" persistent>
      <v-card class="glass-modal-modern pa-8 text-center border-success">
        <v-avatar color="green-lighten-4" size="80" class="mb-4 icon-glow-green">
          <v-icon size="48" color="green-darken-2">mdi-check-circle</v-icon>
        </v-avatar>
        <h2 class="text-h5 font-weight-bold text-white mb-2">Success!</h2>
        <p class="text-body-1 text-grey-lighten-1 mb-6">{{ statusMessage }}</p>
        <v-btn color="green-darken-1" block size="large" rounded="lg" class="text-white font-weight-bold" @click="handleSuccessDone">
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
        <v-btn color="red-darken-1" block size="large" rounded="lg" class="text-white font-weight-bold" @click="dialogError = false">
          TRY AGAIN
        </v-btn>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
/* Glassmorphism Effect */
.glass-form-card {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(25px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 30px !important;
}

/* Glass Modal Standard */
.glass-modal-modern {
  background: rgba(18, 18, 18, 0.9) !important;
  backdrop-filter: blur(25px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 32px !important;
}

.border-success { border: 1px solid rgba(76, 175, 80, 0.4) !important; }
.border-error { border: 1px solid rgba(244, 67, 54, 0.4) !important; }

/* Icon Glows */
.icon-glow {
  display: inline-block;
  padding: 10px;
  background: rgba(33, 150, 243, 0.1);
  border-radius: 20px;
}
.icon-glow-green { box-shadow: 0 0 20px rgba(76, 175, 80, 0.2); }
.icon-glow-red { box-shadow: 0 0 20px rgba(244, 67, 54, 0.2); }

/* Glassy Input styling */
.glass-input :deep(.v-field) {
  background: rgba(255, 255, 255, 0.05) !important;
  border-radius: 12px !important;
  color: white !important;
}
.glass-input :deep(input) { color: white !important; }
.glass-input :deep(.v-label) { color: rgba(255, 255, 255, 0.6) !important; }

.login-btn {
  text-transform: none !important;
  font-weight: bold !important;
  letter-spacing: 0.5px !important;
}
</style>