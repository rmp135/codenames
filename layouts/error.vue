<template lang="pug">
  section.container.is-fluid
    .columns
      .column.is-4.is-offset-4
        img(src="../assets/img/baby.png" alt="Logo" class="logo")
        h1.title {{ error.statusCode }}
        h2.subtitle {{ error.message }}
        nuxt-link.button(to="/") Homepage
</template>

<script>
  export default {
    props: ['error']
  }
</script>