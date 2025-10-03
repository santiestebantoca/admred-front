<template>
  <div class="grid">
    <div class="card border-0 shadow p-3 mb-5">
      <p>Sesión terminada por el usuario.</p>
      <br>
      <div class="text-end">
        <bs-btn :to="{ name: 'auth-login' }" label="Iniciar sesión" color="primary" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  max-width: 400px;
  margin: 0 auto;
  min-height: inherit;
  display: grid;
  align-items: center;
}

@media (max-width: 767.98px) {
  .shadow {
    box-shadow: none !important;
  }
}
</style>