<template>
  <MainLayout>
    <q-page class="page-width q-py-xl staff-page">

      
      <div class="text-center q-mb-xl">
        <div class="text-overline text-brown-7">کافه آرامش</div>

        <div class="text-h4 text-weight-bold cafe-brown">
          باریستاها و اعضای VIP
        </div>

        <div class="text-body1 text-grey-7 q-mt-sm">
          باریستاهای حاضر در شیفت و اعضای وفادار کافه را آنلاین ببینید.
        </div>
      </div>

      
      <q-card class="cafe-card staff-filter-card q-mb-xl" flat bordered>
        <q-card-section>
          <div class="row q-col-gutter-md items-center">

            <div class="col-12 col-md-7">
              <q-input
                v-model="searchInput"
                outlined
                clearable
                debounce="400"
                label="جستجوی نام باریستا یا عضو VIP"
                placeholder="مثلاً Rick"
                prepend-icon="search"
                @update:model-value="handleSearch"
              />
            </div>

            <div class="col-12 col-md-5">
              <q-btn-toggle
                v-model="staffStore.statusFilter"
                spread
                no-caps
                unelevated
                toggle-color="brown-7"
                color="grey-2"
                text-color="brown-8"
                :options="statusOptions"
                @update:model-value="handleStatus"
              />
            </div>

          </div>
        </q-card-section>
      </q-card>

      
      <div
        v-if="staffStore.isLoading"
        class="row q-col-gutter-lg"
      >
        <div
          v-for="n in 6"
          :key="n"
          class="col-12 col-sm-6 col-md-4"
        >
          <q-card
            class="cafe-card staff-card"
            flat
            bordered
          >
            <q-skeleton height="220px" square />

            <q-card-section>
              <q-skeleton type="text" width="65%" />
              <q-skeleton type="text" width="45%" />
              <q-skeleton type="QBadge" width="70px" />
            </q-card-section>
          </q-card>
        </div>
      </div>

      
      <q-banner
        v-else-if="staffStore.errorMessage"
        rounded
        class="bg-red-1 text-red-9 q-mb-lg"
        icon="wifi_off"
      >
        {{ staffStore.errorMessage }}

        <template #action>
          <q-btn
            flat
            color="red-9"
            label="تلاش دوباره"
            @click="loadStaff"
          />
        </template>
      </q-banner>

      
      <div
        v-else-if="!staffStore.staffList.length"
        class="text-center text-grey-7 q-py-xl"
      >
        موردی با این مشخصات پیدا نشد.
      </div>

      
      <div
        v-else
        class="row q-col-gutter-lg"
      >
        <div
          v-for="member in staffStore.staffList"
          :key="member.id"
          class="col-12 col-sm-6 col-md-4"
        >

          <q-card
            class="cafe-card staff-card"
            flat
            bordered
          >

            
            <q-img
              :src="member.image"
              :ratio="1.15"
              loading="lazy"
            >
              <div class="absolute-top-right q-ma-sm bg-transparent">

                <q-badge
                  :color="member.status === 'Alive' ? 'green-7' : 'grey-7'"
                  rounded
                  class="q-px-sm q-py-xs"
                >
                  {{
                    member.status === 'Alive'
                      ? 'حاضر در کافه'
                      : 'خارج از شیفت'
                  }}
                </q-badge>

              </div>
            </q-img>

            
            <q-card-section>

              
              <div class="row items-center justify-between q-mb-xs">

                <div class="text-h6 text-weight-bold">
                  {{ member.name }}
                </div>

                <q-icon
                  :name="
                    member.status === 'Alive'
                      ? 'check_circle'
                      : 'schedule'
                  "
                  :color="
                    member.status === 'Alive'
                      ? 'green-7'
                      : 'grey-7'
                  "
                />

              </div>

              
              <div class="text-body2 text-grey-7">
                <strong>
                  {{ getCafeRole(member.species) }}
                </strong>
              </div>

            </q-card-section>

          </q-card>

        </div>
      </div>

      
      <div
        v-if="staffStore.totalPages > 1"
        class="flex flex-center q-mt-xl"
      >
        <q-pagination
          v-model="staffStore.currentPage"
          :max="staffStore.totalPages"
          direction-links
          boundary-links
          color="brown-7"
          active-color="brown-7"
          @update:model-value="handlePageChange"
        />
      </div>

    </q-page>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import { useCafeStaffStore } from '../stores/cafeStaffStore'

const staffStore = useCafeStaffStore()

const searchInput = ref('')

const statusOptions = [
  { label: 'همه', value: 'all' },
  { label: 'حاضر در کافه', value: 'present' },
  { label: 'خارج از شیفت', value: 'offline' }
]

function handleSearch(value) {
  searchInput.value = value ?? ''
  staffStore.setSearch(searchInput.value)
}

function handleStatus(value) {
  staffStore.setStatus(value)
}

function handlePageChange(page) {
  staffStore.goToPage(page)

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

function loadStaff() {
  staffStore.fetchStaff()
}


function getCafeRole(species) {
  if (species === 'Human') {
    return 'تخصص: متخصص لته‌آرت'
  }

  if (species === 'Alien') {
    return 'تخصص: متخصص بروئینگ'
  }

  if (species === 'unknown') {
    return 'سطح عضویت: عضویت طلایی'
  }

  return 'تخصص: رستر'
}

onMounted(loadStaff)
</script>