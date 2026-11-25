export interface PmccStudent {
  id: string
  studentNo: string
  fullName: string
  program: string
  yearLevel: string
  scholarshipType: string
  discountRate: number
}

export interface PmccSubject {
  id: string
  code: string
  title: string
  units: number
  ratePerUnit: number
  labFee: number
}

export interface PmccEnrollment {
  id: string
  studentId: string
  term: string
  subjectIds: string[]
  miscFee: number
  termStarted: boolean
  date: string
}

export interface PmccPayment {
  id: string
  studentId: string
  orNumber: string
  amount: number
  date: string
  remarks: string
}

export interface PmccJournalEntry {
  id: string
  date: string
  reference: string
  description: string
  debitAccount: string
  creditAccount: string
  amount: number
}

export interface PmccStudentLedger {
  student: PmccStudent | undefined
  enrollment: PmccEnrollment | undefined
  enrolledSubjects: PmccSubject[]
  totalUnits: number
  tuition: number
  labFees: number
  miscFees: number
  totalAssessment: number
  discountAmount: number
  netAmountDue: number
  totalPayments: number
  balance: number
  examPermitStatus: 'CLEARED' | 'BLOCKED' | 'NOT ENROLLED'
}

const STORAGE_KEY = 'pmcc_enrollment_accounting_v1'
const LEGACY_STORAGE_KEY = 'pmcc_enrollment_data_v1'
const AUTH_STORAGE_KEY = 'pmcc_admin_auth_v1'

const DEFAULT_STUDENTS: PmccStudent[] = [
  {
    id: 'stu-1',
    studentNo: 'PMCC-2026-0001',
    fullName: 'Juan Dela Cruz',
    program: 'BS Information Technology',
    yearLevel: '2nd Year',
    scholarshipType: '20% Academic Scholar',
    discountRate: 0.2,
  },
  {
    id: 'stu-2',
    studentNo: 'PMCC-2026-0002',
    fullName: 'Maria Clara Santos',
    program: 'BS Accountancy',
    yearLevel: '3rd Year',
    scholarshipType: 'None',
    discountRate: 0,
  },
]

const DEFAULT_SUBJECTS: PmccSubject[] = [
  { id: 'sub-1', code: 'IT 201', title: 'Data Structures & Algorithms', units: 3, ratePerUnit: 500, labFee: 500 },
  { id: 'sub-2', code: 'IT 202', title: 'Object-Oriented Programming', units: 3, ratePerUnit: 500, labFee: 500 },
  { id: 'sub-3', code: 'IT 203', title: 'Database Management Systems', units: 3, ratePerUnit: 500, labFee: 500 },
  { id: 'sub-4', code: 'GE 105', title: 'Purposive Communication', units: 3, ratePerUnit: 500, labFee: 0 },
  { id: 'sub-5', code: 'GE 106', title: 'The Contemporary World', units: 3, ratePerUnit: 500, labFee: 0 },
  { id: 'sub-6', code: 'PE 3', title: 'Physical Activities Toward Health', units: 3, ratePerUnit: 500, labFee: 0 },
  { id: 'sub-7', code: 'NSTP 2', title: 'Civic Welfare Training Service 2', units: 3, ratePerUnit: 500, labFee: 0 },
]

const DEFAULT_ENROLLMENTS: PmccEnrollment[] = [
  {
    id: 'enr-1',
    studentId: 'stu-1',
    term: '1st Semester AY 2026-2027',
    subjectIds: ['sub-1', 'sub-2', 'sub-3', 'sub-4', 'sub-5', 'sub-6', 'sub-7'],
    miscFee: 2000,
    termStarted: true,
    date: '2026-11-26',
  },
]

const DEFAULT_PAYMENTS: PmccPayment[] = [
  {
    id: 'pay-1',
    studentId: 'stu-1',
    orNumber: 'OR-2026-0001',
    amount: 5000,
    date: '2026-11-26',
    remarks: 'Initial Tuition Installment',
  },
]

const DEFAULT_JOURNALS: PmccJournalEntry[] = [
  {
    id: 'je-1',
    date: '2026-11-26',
    reference: 'ENR-stu-1',
    description: 'Assessed tuition & fees for Juan Dela Cruz (net of 20% tuition discount)',
    debitAccount: 'Accounts Receivable - Students',
    creditAccount: 'Tuition & Fee Revenue',
    amount: 11900,
  },
  {
    id: 'je-2',
    date: '2026-11-26',
    reference: 'OR-2026-0001',
    description: 'Cash payment received from Juan Dela Cruz',
    debitAccount: 'Cash',
    creditAccount: 'Accounts Receivable - Students',
    amount: 5000,
  },
]

export const usePmccStore = () => {
  const students = useState<PmccStudent[]>('pmcc_students', () => structuredClone(DEFAULT_STUDENTS))
  const subjects = useState<PmccSubject[]>('pmcc_subjects', () => structuredClone(DEFAULT_SUBJECTS))
  const enrollments = useState<PmccEnrollment[]>('pmcc_enrollments', () => structuredClone(DEFAULT_ENROLLMENTS))
  const payments = useState<PmccPayment[]>('pmcc_payments', () => structuredClone(DEFAULT_PAYMENTS))
  const journalEntries = useState<PmccJournalEntry[]>('pmcc_journals', () => structuredClone(DEFAULT_JOURNALS))
  const uncollectibleRate = useState<number>('pmcc_uncollectible_rate', () => 0.05)
  const isAdminAuthenticated = useState<boolean>('pmcc_is_admin_auth', () => false)
  const initialized = useState<boolean>('pmcc_store_initialized', () => false)

  const persistToStorage = () => {
    if (!import.meta.client) return
    try {
      const payload = {
        students: students.value,
        subjects: subjects.value,
        enrollments: enrollments.value,
        payments: payments.value,
        journalEntries: journalEntries.value,
        uncollectibleRate: uncollectibleRate.value,
      }
      const serialized = JSON.stringify(payload)
      window.localStorage.setItem(STORAGE_KEY, serialized)
      window.localStorage.setItem(LEGACY_STORAGE_KEY, serialized)
    } catch {
      // Ignore storage quota errors in restricted modes
    }
  }

  const hydrateFromStorage = () => {
    if (!import.meta.client) return

    isAdminAuthenticated.value = window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true'

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY) || window.localStorage.getItem(LEGACY_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed.students)) students.value = parsed.students
        if (Array.isArray(parsed.subjects)) subjects.value = parsed.subjects
        if (Array.isArray(parsed.enrollments)) enrollments.value = parsed.enrollments
        if (Array.isArray(parsed.payments)) payments.value = parsed.payments
        if (Array.isArray(parsed.journalEntries)) journalEntries.value = parsed.journalEntries
        if (typeof parsed.uncollectibleRate === 'number') uncollectibleRate.value = parsed.uncollectibleRate
      } else {
        persistToStorage()
      }
    } catch {
      persistToStorage()
    }
  }

  if (import.meta.client && !initialized.value) {
    initialized.value = true
    hydrateFromStorage()

    watch(
      [students, subjects, enrollments, payments, journalEntries, uncollectibleRate],
      () => {
        persistToStorage()
      },
      { deep: true }
    )
  } else if (import.meta.client) {
    // Ensure auth state stays synced on client navigation/reload
    isAdminAuthenticated.value = window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
  }

  const loginAdmin = (emailInput: string, passwordInput: string) => {
    const cleanEmail = emailInput.trim().toLowerCase()
    const cleanPassword = passwordInput.trim()

    if (cleanEmail === 'admin@pmcc.edu.ph' && cleanPassword === 'admin2026') {
      isAdminAuthenticated.value = true
      if (import.meta.client) {
        window.localStorage.setItem(AUTH_STORAGE_KEY, 'true')
        hydrateFromStorage()
      }
      return { ok: true, message: 'Signed in as PMCC Admin.' }
    }

    return {
      ok: false,
      message: 'Invalid Admin credentials. Use admin@pmcc.edu.ph / admin2026.',
    }
  }

  const logoutAdmin = () => {
    isAdminAuthenticated.value = false
    if (import.meta.client) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  const addStudent = (input: Omit<PmccStudent, 'id'>) => {
    const newStudent: PmccStudent = {
      ...input,
      id: `stu-${Date.now()}`,
    }
    students.value = [...students.value, newStudent]
    persistToStorage()
    return newStudent
  }

  const addSubject = (input: Omit<PmccSubject, 'id'>) => {
    const newSubject: PmccSubject = {
      ...input,
      id: `sub-${Date.now()}`,
    }
    subjects.value = [...subjects.value, newSubject]
    persistToStorage()
    return newSubject
  }

  const saveEnrollment = (input: Omit<PmccEnrollment, 'id' | 'date'>) => {
    const today = new Date().toISOString().slice(0, 10)
    const existingIndex = enrollments.value.findIndex((e) => e.studentId === input.studentId)

    let record: PmccEnrollment
    if (existingIndex !== -1) {
      const existing = enrollments.value[existingIndex]!
      record = {
        id: existing.id,
        studentId: input.studentId,
        term: input.term,
        subjectIds: [...input.subjectIds],
        miscFee: Number(input.miscFee || 0),
        termStarted: Boolean(input.termStarted),
        date: today,
      }
      const next = [...enrollments.value]
      next[existingIndex] = record
      enrollments.value = next
    } else {
      record = {
        id: `enr-${Date.now()}`,
        studentId: input.studentId,
        term: input.term,
        subjectIds: [...input.subjectIds],
        miscFee: Number(input.miscFee || 0),
        termStarted: Boolean(input.termStarted),
        date: today,
      }
      enrollments.value = [...enrollments.value, record]
    }

    const student = students.value.find((s) => s.id === input.studentId)
    const chosenSubjects = subjects.value.filter((sub) => input.subjectIds.includes(sub.id))
    const tuition = chosenSubjects.reduce((sum, sub) => sum + Number(sub.units || 0) * Number(sub.ratePerUnit || 0), 0)
    const labFees = chosenSubjects.reduce((sum, sub) => sum + Number(sub.labFee || 0), 0)
    const miscFees = Number(input.miscFee || 0)
    const totalAssessment = tuition + labFees + miscFees
    const discountAmount = Math.round(tuition * Number(student?.discountRate || 0))
    const netAmountDue = Math.max(0, totalAssessment - discountAmount)

    const refCode = `ENR-${student?.studentNo || input.studentId}`
    const filteredJournals = journalEntries.value.filter((j) => j.reference !== refCode)
    journalEntries.value = [
      {
        id: `je-${Date.now()}`,
        date: today,
        reference: refCode,
        description: `Assessed tuition & fees for ${student?.fullName || 'Student'}`,
        debitAccount: 'Accounts Receivable - Students',
        creditAccount: input.termStarted ? 'Tuition & Fee Revenue' : 'Unearned Tuition Revenue',
        amount: netAmountDue,
      },
      ...filteredJournals,
    ]

    persistToStorage()
    return record
  }

  const recordPayment = (studentId: string, amount: number, remarks = 'Tuition Payment') => {
    const cleanAmount = Math.max(0, Number(amount || 0))
    if (!studentId || cleanAmount <= 0) return null

    const today = new Date().toISOString().slice(0, 10)
    const orNumber = `OR-${new Date().getFullYear()}-${String(payments.value.length + 1).padStart(4, '0')}`
    const student = students.value.find((s) => s.id === studentId)
    const enrollment = enrollments.value.find((e) => e.studentId === studentId)

    const paymentRecord: PmccPayment = {
      id: `pay-${Date.now()}`,
      studentId,
      orNumber,
      amount: cleanAmount,
      date: today,
      remarks,
    }
    payments.value = [paymentRecord, ...payments.value]

    const creditAccount = enrollment && !enrollment.termStarted
      ? 'Unearned Tuition Revenue'
      : 'Accounts Receivable - Students'

    const je: PmccJournalEntry = {
      id: `je-${Date.now()}-pay`,
      date: today,
      reference: orNumber,
      description: `${remarks} — ${student?.fullName || 'Student'}`,
      debitAccount: 'Cash',
      creditAccount,
      amount: cleanAmount,
    }
    journalEntries.value = [je, ...journalEntries.value]

    persistToStorage()
    return paymentRecord
  }

  const getStudentLedger = (studentId: string): PmccStudentLedger => {
    const student = students.value.find((s) => s.id === studentId)
    const enrollment = enrollments.value.find((e) => e.studentId === studentId)
    const enrolledSubjects = enrollment
      ? subjects.value.filter((sub) => enrollment.subjectIds.includes(sub.id))
      : []

    const totalUnits = enrolledSubjects.reduce((sum, sub) => sum + Number(sub.units || 0), 0)
    const tuition = enrolledSubjects.reduce((sum, sub) => sum + Number(sub.units || 0) * Number(sub.ratePerUnit || 0), 0)
    const labFees = enrolledSubjects.reduce((sum, sub) => sum + Number(sub.labFee || 0), 0)
    const miscFees = enrollment ? Number(enrollment.miscFee || 0) : 0
    const totalAssessment = tuition + labFees + miscFees
    const discountAmount = Math.round(tuition * Number(student?.discountRate || 0))
    const netAmountDue = enrollment ? Math.max(0, totalAssessment - discountAmount) : 0

    const totalPayments = payments.value
      .filter((p) => p.studentId === studentId)
      .reduce((sum, p) => sum + Number(p.amount || 0), 0)

    const balance = enrollment ? Math.max(0, netAmountDue - totalPayments) : 0

    let examPermitStatus: PmccStudentLedger['examPermitStatus'] = 'NOT ENROLLED'
    if (enrollment) {
      examPermitStatus = balance <= 0 ? 'CLEARED' : 'BLOCKED'
    }

    return {
      student,
      enrollment,
      enrolledSubjects,
      totalUnits,
      tuition,
      labFees,
      miscFees,
      totalAssessment,
      discountAmount,
      netAmountDue,
      totalPayments,
      balance,
      examPermitStatus,
    }
  }

  const subsidiaryLedger = computed<PmccStudentLedger[]>(() => {
    return students.value.map((s) => getStudentLedger(s.id))
  })

  const accountingSummary = computed(() => {
    const totalBillings = subsidiaryLedger.value.reduce((sum, row) => sum + row.netAmountDue, 0)
    const totalCollections = payments.value.reduce((sum, p) => sum + Number(p.amount || 0), 0)
    const arControlTotal = subsidiaryLedger.value.reduce((sum, row) => sum + row.balance, 0)
    const allowanceForDoubtful = Math.round(arControlTotal * Number(uncollectibleRate.value || 0))
    const collectionRate = totalBillings > 0 ? Math.min(100, (totalCollections / totalBillings) * 100) : 0

    const blockedPermitsCount = subsidiaryLedger.value.filter((r) => r.examPermitStatus === 'BLOCKED').length
    const clearedPermitsCount = subsidiaryLedger.value.filter((r) => r.examPermitStatus === 'CLEARED').length

    return {
      totalBillings,
      totalCollections,
      arControlTotal,
      allowanceForDoubtful,
      collectionRate,
      blockedPermitsCount,
      clearedPermitsCount,
    }
  })

  const resetDemoData = () => {
    students.value = structuredClone(DEFAULT_STUDENTS)
    subjects.value = structuredClone(DEFAULT_SUBJECTS)
    enrollments.value = structuredClone(DEFAULT_ENROLLMENTS)
    payments.value = structuredClone(DEFAULT_PAYMENTS)
    journalEntries.value = structuredClone(DEFAULT_JOURNALS)
    uncollectibleRate.value = 0.05
    persistToStorage()
  }

  return {
    students,
    subjects,
    enrollments,
    payments,
    journalEntries,
    uncollectibleRate,
    isAdminAuthenticated,
    subsidiaryLedger,
    accountingSummary,
    loginAdmin,
    logoutAdmin,
    addStudent,
    addSubject,
    saveEnrollment,
    recordPayment,
    getStudentLedger,
    resetDemoData,
  }
}