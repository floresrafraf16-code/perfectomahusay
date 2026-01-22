<template>
  <div class="pa-4">
    <div class="d-flex align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold text-white mb-1">Enroll Pro Dashboard</h1>
        <p class="text-subtitle-2 text-grey-lighten-1">Real-time system monitoring and statistics</p>
      </div>
      <v-spacer></v-spacer>
      <v-chip color="blue-lighten-3" variant="outlined" prepend-icon="mdi-sync" class="glass-chip">
        Live System Data
      </v-chip>
    </div>
    
    <v-row>
      <v-col cols="12" md="3">
        <v-card class="glass-card pa-4 overflow-hidden">
          <div class="d-flex align-center mb-4">
            <v-avatar color="blue-darken-1" size="50" class="elevation-4 mr-3">
              <v-icon icon="mdi-account-group" color="white"></v-icon>
            </v-avatar>
            <span class="text-overline text-grey-lighten-1">Registered Students</span>
          </div>
          <v-card-text class="text-h3 font-weight-bold text-white pa-0 mb-4">
            {{ totalStudents }}
          </v-card-text>
          <v-card-actions class="pa-0">
            <v-btn variant="text" color="blue-lighten-3" to="/students" prepend-icon="mdi-arrow-right-circle" class="px-0">
              Manage Students
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="glass-card pa-4 overflow-hidden">
          <div class="d-flex align-center mb-4">
            <v-avatar color="purple-darken-1" size="50" class="elevation-4 mr-3">
              <v-icon icon="mdi-book-multiple" color="white"></v-icon>
            </v-avatar>
            <span class="text-overline text-grey-lighten-1">Active Courses</span>
          </div>
          <v-card-text class="text-h3 font-weight-bold text-white pa-0 mb-4">
            {{ totalCourses }}
          </v-card-text>
          <v-card-actions class="pa-0">
            <v-btn variant="text" color="purple-lighten-3" to="/courses" prepend-icon="mdi-arrow-right-circle" class="px-0">
              Manage Courses
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="glass-card pa-4 overflow-hidden">
          <div class="d-flex align-center mb-4">
            <v-avatar color="orange-darken-2" size="50" class="elevation-4 mr-3">
              <v-icon icon="mdi-account-tie" color="white"></v-icon>
            </v-avatar>
            <span class="text-overline text-grey-lighten-1">Faculty Members</span>
          </div>
          <v-card-text class="text-h3 font-weight-bold text-white pa-0 mb-4">
            {{ totalInstructors }}
          </v-card-text>
          <v-card-actions class="pa-0">
            <v-btn variant="text" color="orange-lighten-3" to="/instructors" prepend-icon="mdi-arrow-right-circle" class="px-0">
              View Faculty
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="glass-card pa-4 overflow-hidden">
          <div class="d-flex align-center mb-4">
            <v-avatar color="green-darken-1" size="50" class="elevation-4 mr-3">
              <v-icon icon="mdi-clipboard-text-outline" color="white"></v-icon>
            </v-avatar>
            <span class="text-overline text-grey-lighten-1">Enrollments</span>
          </div>
          <v-card-text class="text-h3 font-weight-bold text-white pa-0 mb-4">
            {{ totalEnrollments }}
          </v-card-text>
          <v-card-actions class="pa-0">
            <v-btn variant="text" color="green-lighten-3" to="/enrollments" prepend-icon="mdi-arrow-right-circle" class="px-0">
              Check Status
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="8" class="mt-4">
        <v-card class="glass-card pa-6">
          <div class="d-flex align-center mb-4">
            <v-icon color="blue-lighten-3" class="mr-2">mdi-history</v-icon>
            <h3 class="text-h6 text-white">Recent Enrollment Activity</h3>
          </div>
          <v-table theme="dark" class="glass-table bg-transparent">
            <thead>
              <tr>
                <th class="text-blue-lighten-3">Student Name</th>
                <th class="text-blue-lighten-3">Course</th>
                <th class="text-blue-lighten-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="en in recentData?.data" :key="en.id">
                <td class="text-white">{{ en.student?.FirstName }} {{ en.student?.LastName }}</td>
                <td class="text-grey-lighten-1">{{ en.course?.Title }}</td>
                <td>
                  <v-chip 
                    size="x-small" 
                    :color="en.enrollmentStatus === 'Enrolled' ? 'blue' : 
                            en.enrollmentStatus === 'Completed' ? 'green' : 
                            en.enrollmentStatus === 'Pending' ? 'orange' : 'red'"
                    variant="tonal"
                  >
                    {{ en.enrollmentStatus }}
                  </v-chip>
                </td>
              </tr>
              <tr v-if="!recentData?.data?.length">
                <td colspan="3" class="text-center text-grey">No recent transactions.</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" class="mt-4">
        <v-card class="glass-card pa-6 h-100">
          <h3 class="text-h5 text-white mb-2">System Info</h3>
          <p class="text-body-2 text-grey-lighten-1 mb-6">Database synchronization is active.</p>
          
          <div class="mb-4">
            <p class="text-caption text-blue-lighten-3 mb-0">API ENDPOINT</p>
            <p class="text-body-2 text-white font-weight-medium">Connected (Strapi v5)</p>
          </div>
          
          <div class="mb-8">
            <p class="text-caption text-green-lighten-3 mb-0">AUTH STATUS</p>
            <p class="text-body-2 text-white font-weight-medium">Administrator Session</p>
          </div>

          <v-btn color="blue" block variant="elevated" class="mb-3 rounded-lg" to="/enrollments">
            NEW TRANSACTION
          </v-btn>
          <v-btn color="white" block variant="outlined" class="rounded-lg" to="/students">
            STUDENT LIST
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

// Section: Fetching Data
const { data: students, refresh: refreshStudents } = await useFetch('http://localhost:1337/api/students')
const { data: courses, refresh: refreshCourses } = await useFetch('http://localhost:1337/api/courses')
const { data: instructors, refresh: refreshInstructors } = await useFetch('http://localhost:1337/api/instructors')
const { data: enrollments, refresh: refreshEnrollments } = await useFetch('http://localhost:1337/api/enrollments')

// Section: Fetching Recent Activity (Last 5 with population)
const { data: recentData, refresh: refreshRecent } = await useFetch('http://localhost:1337/api/enrollments?populate=*&pagination[limit]=5&sort[0]=id:desc')

// Section: Accurate Counting
const totalStudents = computed(() => students.value?.meta?.pagination?.total || 0)
const totalCourses = computed(() => courses.value?.meta?.pagination?.total || 0)
const totalInstructors = computed(() => instructors.value?.meta?.pagination?.total || 0)
const totalEnrollments = computed(() => enrollments.value?.meta?.pagination?.total || 0)

onMounted(() => {
  refreshStudents()
  refreshCourses()
  refreshInstructors()
  refreshEnrollments()
  refreshRecent()
})
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.07) !important;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 24px !important;
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.1) !important;
}

.glass-chip {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(5px);
}

.glass-table :deep(thead) {
  background: rgba(255, 255, 255, 0.03);
}

.glass-table :deep(td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}
</style>