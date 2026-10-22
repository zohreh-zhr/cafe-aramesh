<template>
  <MainLayout>
    <q-page class="page-width q-py-xl">
      <div class="text-h4 text-center text-weight-bold cafe-brown q-mb-lg">
        میزهای کافه آرامش
      </div>

      <div class="row justify-center q-mb-xl">
        <q-select
          v-model="capacityFilter"
          :options="capacityOptions"
          label="فیلتر ظرفیت"
          outlined
          emit-value
          map-options
          style="min-width: 250px"
        />
      </div>

      <div class="row q-col-gutter-lg">
        <div
          v-for="table in filteredTables"
          :key="table.id"
          class="col-12 col-sm-6 col-md-4"
        >
          <TableCard :table="table" @select="openBooking" />
        </div>
      </div>

      <div v-if="filteredTables.length === 0" class="text-center q-pa-xl">
        میزی با این ظرفیت پیدا نشد.
      </div>

      <q-dialog v-model="dialogOpen" persistent>
        <q-card style="width: 520px; max-width: 95vw">
          <q-card-section>
            <div class="text-h6">رزرو {{ bookingStore.selectedTable?.title }}</div>
            <div class="text-body2 q-mt-sm">
              میز برای ۵ دقیقه به صورت موقت برای شما قفل می‌شود.
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="timer-box q-pa-md text-center q-mb-lg">
              <div class="text-caption">زمان باقی‌مانده برای تکمیل رزرو</div>
              <div class="text-h4 text-weight-bold">{{ formattedTime }}</div>
            </div>

            <q-input
              v-model="bookingStore.customer.name"
              outlined
              label="نام مشتری"
              class="q-mb-md"
            />

            <q-select
              v-model="bookingStore.bookingTime"
              outlined
              label="ساعت حضور"
              :options="timeOptions"
              class="q-mb-lg"
            />

            <CafeAddons
              v-model="bookingStore.addons"
              :items="bookingStore.addonsList"
            />

            <q-separator class="q-my-lg" />

            <div class="row justify-between text-subtitle1">
              <span>مبلغ نهایی:</span>
              <strong>{{ bookingStore.totalPrice.toLocaleString('fa-IR') }} تومان</strong>
            </div>
          </q-card-section>

          <q-card-actions align="between" class="q-pa-md">
            <q-btn flat label="انصراف" color="grey-7" @click="cancelBooking" />
            <q-btn
              label="تایید و دریافت بلیت"
              class="cafe-btn text-white"
              unelevated
              :disable="!canSubmit"
              @click="confirmBooking"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </MainLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import MainLayout from '../layouts/MainLayout.vue'
import TableCard from '../components/TableCard.vue'
import CafeAddons from '../components/CafeAddons.vue'
import { useBookingStore } from '../stores/bookingStore'
import { useBookingTimer } from '../composables/useBookingTimer'

const router = useRouter()
const $q = useQuasar()
const bookingStore = useBookingStore()

const capacityFilter = ref('all')
const dialogOpen = ref(false)

const capacityOptions = [
  { label: 'همه میزها', value: 'all' },
  { label: '۲ نفره', value: 2 },
  { label: '۴ نفره', value: 4 },
  { label: '۶ نفره', value: 6 }
]

const timeOptions = ['18:00', '19:00', '20:00', '21:00', '22:00']

const filteredTables = computed(() => {
  if (capacityFilter.value === 'all') return bookingStore.tables

  return bookingStore.tables.filter(
    table => table.capacity === Number(capacityFilter.value)
  )
})

const canSubmit = computed(() =>
  Boolean(
    bookingStore.selectedTable &&
    bookingStore.customer.name.trim().length >= 3 &&
    bookingStore.bookingTime
  )
)

const { formattedTime, start, stop } = useBookingTimer(() => {
  dialogOpen.value = false
  bookingStore.releaseSelectedTable()

  $q.notify({
    type: 'warning',
    message: 'زمان ۵ دقیقه‌ای شما تمام شد و میز آزاد شد.',
    position: 'top',
    icon: 'timer_off'
  })
})

function openBooking(table) {
  if (!bookingStore.selectTable(table)) return

  dialogOpen.value = true
  start()
}

function cancelBooking() {
  stop()
  dialogOpen.value = false
  bookingStore.releaseSelectedTable()

  $q.notify({
    type: 'info',
    message: 'رزرو موقت لغو شد و میز دوباره آزاد است.',
    position: 'top'
  })
}

function confirmBooking() {
  if (!canSubmit.value) {
    $q.notify({
      type: 'negative',
      message: 'لطفاً نام و ساعت حضور را کامل کنید.'
    })
    return
  }

  stop()
  const id = bookingStore.saveReservation()

  dialogOpen.value = false

  $q.notify({
    type: 'positive',
    message: `میز ${bookingStore.selectedTable.title} با موفقیت برای شما رزرو شد!`,
    position: 'top',
    icon: 'celebration'
  })

  router.push(`/receipt/${id}`)
}
</script>