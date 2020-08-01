<template>
  <v-layout v-if="permissions.includes('list-applicants')">
    <applicants-datatable
      title="Calon Peserta"
      router-name="applicants"
      status="new"
      :page="page"
      :per-page="perPage"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      :allow-list="permissions.includes('list-applicants')"
      :allow-view="permissions.includes('view-applicants')"
      :allow-create="permissions.includes('manage-applicants')"
      :allow-edit="permissions.includes('manage-applicants')"
      :allow-delete="permissions.includes('manage-applicants')"
      :no-actions="true"
    />
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'
import ApplicantsDatatable from '@/components/ApplicantsDatatable'

export default {
  middleware: 'auth',
  components: {
    ApplicantsDatatable
  },

  data() {
    return {
      page: 1,
      perPage: 15,
      sortBy: 'created_at',
      sortOrder: 'desc'
    }
  },

  computed: {
    ...mapGetters('auth', ['permissions'])
  },

  mounted() {
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

  head() {
    return {
      title: 'Calon Peserta'
    }
  }
}
</script>
