
import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'cafeArameshVueTables'

const initialTables = [
  { id: 1, title: 'میز دونفره لب پنجره', capacity: 2, isReserved: false, isLocked: false },
  { id: 2, title: 'میز چهار نفره کنار دیوار', capacity: 4, isReserved: true, isLocked: false },
  { id: 3, title: 'میز شش نفره خانوادگی', capacity: 6, isReserved: false, isLocked: false },
  { id: 4, title: 'میز دونفره دنج', capacity: 2, isReserved: false, isLocked: false },
  { id: 5, title: 'میز چهار نفره حیاط', capacity: 4, isReserved: false, isLocked: false },
  { id: 6, title: 'میز شش نفره مخصوص گروه', capacity: 6, isReserved: false, isLocked: false }
]

const addonsList = [
  { id: 1, title: 'قهوه اسپرسو', price: 80000 },
  { id: 2, title: 'چیزکیک', price: 90000 },
  { id: 3, title: 'ماکیاتو', price: 100000 },
  { id: 4, title: 'کیک روز', price: 70000 }
]


function loadTables() {
  try {
    const savedTables = localStorage.getItem(STORAGE_KEY)

    if (savedTables) {
      const parsedTables = JSON.parse(savedTables)

      if (Array.isArray(parsedTables) && parsedTables.length > 0) {
        return parsedTables.map(savedTable => ({
          ...savedTable,
          isLocked: false
        }))
      }
    }
  } catch (error) {
    console.error('خطا در بازیابی وضعیت میزها:', error)
  }

  return initialTables.map(table => ({ ...table }))
}

export const useBookingStore = defineStore('booking', () => {
  const tables = ref(loadTables())
  const selectedTable = ref(null)
  const bookingTime = ref('')
  const addons = ref([])
  const customer = ref({ name: '' })
  const bookingId = ref('')
  const temporaryLock = ref(false)
  const reservations = ref([])

  // ذخیره خودکار وضعیت میزها در حافظه مرورگر
  watch(
    tables,
    (newTables) => {
      try {
        const tablesToSave = newTables.map(table => ({
          ...table,
          isLocked: false
        }))

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(tablesToSave)
        )
      } catch (error) {
        console.error('خطا در ذخیره وضعیت میزها:', error)
      }
    },
    { deep: true }
  )

  const tablePrice = computed(() =>
    selectedTable.value ? selectedTable.value.capacity * 50000 : 0
  )

  const addonsTotal = computed(() =>
    addons.value.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
  )

  const totalPrice = computed(() =>
    tablePrice.value + addonsTotal.value
  )

  function selectTable(table) {
    if (table.isReserved || table.isLocked) return false

    table.isLocked = true
    selectedTable.value = table
    temporaryLock.value = true

    return true
  }

  function releaseSelectedTable() {
    if (selectedTable.value && !selectedTable.value.isReserved) {
      selectedTable.value.isLocked = false
    }

    selectedTable.value = null
    temporaryLock.value = false
  }

  function setAddons(items) {
    addons.value = items
  }

  function saveReservation() {
    if (!selectedTable.value || !temporaryLock.value) return null

    const table = selectedTable.value
    const id = `CAFE-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 10)}`

    table.isLocked = false
    table.isReserved = true

    bookingId.value = id
    temporaryLock.value = false

    const reservation = {
      bookingId: id,
      tableId: table.id,
      tableTitle: table.title,
      capacity: table.capacity,
      customerName: customer.value.name,
      bookingTime: bookingTime.value,
      addons: addons.value.map(item => ({ ...item })),
      totalPrice: totalPrice.value
    }

    reservations.value.push(reservation)

    return reservation
  }

  function clearStore() {
    selectedTable.value = null
    bookingTime.value = ''
    addons.value = []
    customer.value = { name: '' }
    bookingId.value = ''
    temporaryLock.value = false
  }

  return {
    tables,
    addonsList,
    selectedTable,
    bookingTime,
    addons,
    customer,
    bookingId,
    temporaryLock,
    reservations,
    tablePrice,
    addonsTotal,
    totalPrice,
    selectTable,
    releaseSelectedTable,
    setAddons,
    saveReservation,
    clearStore
  }
})

