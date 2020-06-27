<template>
  <v-layout>
    <applicants-datatable
      title="Daftar Peserta"
      router-name="applicants-approved"
      status="approved"
      :page="page"
      :per-page="perPage"
      :sort-by="sortBy"
      :sort-order="sortOrder"
    />
  </v-layout>
</template>

<script>
import ApplicantsDatatable from '@/components/ApplicantsDatatable'

export default {
  middleware: 'auth',
  components: {
    ApplicantsDatatable
  },

  data () {
    return {
      page: 1,
      perPage: 15,
      sortBy: 'created_at',
      sortOrder: 'desc'
    }
  },

  mounted () {
    if (this.$route.query.page) {
      this.page = parseInt(this.$route.query.page)
    }

    if (this.$route.query.per_page) {
      this.perPage = parseInt(this.$route.query.per_page)
    }

    if (this.$route.query.sort_by) {
      this.sortBy = this.$route.query.sort_by
    }

    if (this.$route.query.sort_order) {
      this.sortOrder = this.$route.query.sort_order
    }
  },

  head () {
    return {
      title: 'Daftar Peserta'
    }
  }
}
</script>
