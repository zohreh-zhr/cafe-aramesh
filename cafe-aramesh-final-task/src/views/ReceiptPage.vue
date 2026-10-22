<template>
  <MainLayout>
    <q-page class="page-width q-py-xl">
      <div class="text-center q-mb-lg">
        <div class="text-h4 text-weight-bold cafe-brown">🎫 بلیت دیجیتال رزرو</div>
        <div class="text-subtitle1 q-mt-sm">رزرو شما با موفقیت ثبت شد.</div>
      </div>

      <q-card class="receipt-ticket q-pa-md" flat>
        <q-card-section class="text-center">
          <div class="text-h5 text-weight-bold">کافه آرامش ☕</div>
          <q-chip color="brown-1" text-color="brown-9" class="q-mt-md">
            {{ bookingId }}
          </q-chip>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <div class="text-caption">میز</div>
              <div class="text-subtitle1 text-weight-bold">
                {{ bookingStore.selectedTable?.title || 'میز رزرو شده' }}
              </div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-caption">ظرفیت</div>
              <div class="text-subtitle1">
                {{ bookingStore.selectedTable?.capacity || '-' }} نفر
              </div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-caption">نام مشتری</div>
              <div class="text-subtitle1">{{ bookingStore.customer.name || '-' }}</div>
            </div>

            <div class="col-12 col-sm-6">
              <div class="text-caption">ساعت حضور</div>
              <div class="text-subtitle1">{{ bookingStore.bookingTime || '-' }}</div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-md">پکیج پذیرایی</div>

          <div v-if="bookingStore.addons.length">
            <div
              v-for="item in bookingStore.addons"
              :key="item.id"
              class="row justify-between q-py-xs"
            >
              <span>{{ item.title }} × {{ item.quantity }}</span>
              <span>{{ (item.price * item.quantity).toLocaleString('fa-IR') }} تومان</span>
            </div>
          </div>

          <div v-else class="text-grey-7">بدون پکیج پذیرایی</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="row justify-between text-h6">
          <span>مبلغ نهایی</span>
          <strong>{{ bookingStore.totalPrice.toLocaleString('fa-IR') }} تومان</strong>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            label="بازگشت به رزرو میز"
            class="cafe-btn text-white"
            unelevated
            to="/reservation"
          />
        </q-card-actions>
      </q-card>
    </q-page>
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import { useBookingStore } from '../stores/bookingStore'

const route = useRoute()
const bookingStore = useBookingStore()

const bookingId = computed(() => route.params.bookingId)
</script>