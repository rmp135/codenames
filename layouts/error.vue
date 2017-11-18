<style lang="scss" scoped>
  .container {
    text-align: center;
  }
</style>

<template lang="pug">
  section.section
    .container
      .columns.is-centered
        .column.is-4
          h1.title {{ error.statusCode }}
          h2.subtitle {{ error.message }}
          nuxt-link.button(to="/") Homepage
</template>

<script>
  export default {
    props: ['error']
  }
</script>