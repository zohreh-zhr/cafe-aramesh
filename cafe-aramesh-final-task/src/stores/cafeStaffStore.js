import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const GRAPHQL_URL = 'https://rickandmortyapi.com/graphql'

const GET_CAFE_STAFF = `
  query GetCafeStaff($page: Int, $name: String, $status: String) {
    characters(page: $page, filter: { name: $name, status: $status }) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        image
      }
    }
  }
`

export const useCafeStaffStore = defineStore('cafeStaff', () => {
  const staffList = ref([])
  const currentPage = ref(1)
  const totalPages = ref(1)
  const searchName = ref('')
  const statusFilter = ref('all')
  const isLoading = ref(false)
  const errorMessage = ref('')

  async function fetchStaff() {
    isLoading.value = true
    errorMessage.value = ''

    const variables = {
      page: currentPage.value,
      name: searchName.value.trim() || undefined,
      status: statusFilter.value === 'all'
        ? undefined
        : statusFilter.value === 'present'
          ? 'Alive'
          : 'Dead'
    }

    try {
      const response = await axios.post(GRAPHQL_URL, {
        query: GET_CAFE_STAFF,
        variables
      })

      if (response.data.errors?.length) {
        throw new Error(response.data.errors[0].message)
      }

      const characters = response.data.data?.characters
      staffList.value = characters?.results ?? []
      totalPages.value = characters?.info?.pages ?? 1
    } catch (error) {
      staffList.value = []
      totalPages.value = 1
      errorMessage.value = 'دریافت اطلاعات باریستاها با مشکل مواجه شد. اینترنت و اتصال API را بررسی کنید.'
      console.error('GraphQL staff error:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function setSearch(value) {
    searchName.value = value
    currentPage.value = 1
    await fetchStaff()
  }

  async function setStatus(value) {
    statusFilter.value = value
    currentPage.value = 1
    await fetchStaff()
  }

  async function goToPage(page) {
    currentPage.value = page
    await fetchStaff()
  }

  return {
    staffList,
    currentPage,
    totalPages,
    searchName,
    statusFilter,
    isLoading,
    errorMessage,
    fetchStaff,
    setSearch,
    setStatus,
    goToPage
  }
})
