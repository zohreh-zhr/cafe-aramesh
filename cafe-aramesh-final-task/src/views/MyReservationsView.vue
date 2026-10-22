<template>
  <MainLayout>
    <q-page class="page-width q-py-xl">
      <div class="text-h4 text-center text-weight-bold cafe-brown q-mb-xl">
        رزروهای من
      </div>

      <q-card class="cafe-card" flat bordered>
        <q-card-section class="text-center">
          <div class="text-h6">رزروهای ثبت‌شده</div>
          <p class="q-mb-none">
            آخرین بلیت دیجیتال شما در همین صفحه قابل مشاهده است.
          </p>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            label="مشاهده بلیت آخرین رزرو"
            class="cafe-btn text-white"
            unelevated
            :disable="!lastBookingId"
            :to="lastBookingId ? `/receipt/${lastBookingId}` : undefined"
          />
        </q-card-actions>
      </q-card>

      <div v-if="!lastBookingId" class="text-center q-pa-xl">
        هنوز رزروی در این نشست ثبت نشده است.
      </div>
    </q-page>
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import { useBookingStore } from '../stores/bookingStore'

const bookingStore = useBookingStore()
const lastBookingId = computed(() => bookingStore.bookingId)
</script>