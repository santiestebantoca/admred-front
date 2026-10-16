<template>
  <BModal centereds size="lg">
    <BRow>
      <BCol cols="auto">
        <ILucideRss class="fs-1 text-info mx-4 my-2" />
      </BCol>
      <BCol>
        <h5>ADM Red</h5>
        <p>
          Version 2.1.1 (Transicional) (16/10/2026)
        </p>
        <p>
          Esta versión incluye cambios menores, parches y refactorización.
        </p>
        <p>
          Está pensada como preparación para cambios mayores contemplados en
          el proyecto I+D+i de ETECSA NA161CA095-022.
        </p>
      </BCol>
    </BRow>
    <template #footer>
      <div class="w-auto mx-auto">
        <div class="fw-semibold">Aviso:</div>
        Reporte fallos encontrados al
        <span class="numero" v-tippy="'Contacto: Jorge Lino Santiesteban Toca'">
          52885984</span>,
        le atenderá un miembro del equipo de desarrollo.
      </div>
    </template>
  </BModal>
</template>

<style scoped>
.numero {
  text-decoration: underline dotted;
  text-underline-offset: 3px;
  font-weight: 600;
  cursor: default;
}
</style>