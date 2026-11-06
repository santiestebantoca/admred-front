<!-- Basic behavour
1. Upload file
   / update uploaded [{key, filename, filesize}]
   / upload file and get it from backend
   / update uploaded [{id, file, filename, filesize}]
2. Delete uploaded file
   / delete uploaded file from backend
   / update uploaded
-->
<!-- Para adjuntos heredados del padre (reenvío) o de sí (reedición de respuesta)
Se recibe la propiedad adjuntosHeredados Array[{id, solicitud_id, upload_id, {...upload}]
1. Se concatenan sus ids con uploadedIds
2. Delete
   / update id de adjuntosHeredados
-->
<script lang="ts" setup>
import useFileSize from '@/composables/useFileSize'
import { useUploadCreate, useUploadDelete } from '@/stores/uploads'
import type { AdjuntoSolicitud } from '@/types/models'
import { reactive, ref, computed, watchEffect, useTemplateRef } from 'vue'

/** Adjunto en cola de subida o ya subido en esta sesión del formulario. */
type AdjuntoSubiendo = {
  id?: number
  key: string
  filename: string
  filesize: number
  file?: string
  archivo?: File
  estado: 'subiendo' | 'listo' | 'error'
  progreso: number
  error?: string
  eliminando?: boolean
}

const uploadedIds = defineModel<number[]>()
const adjuntosHeredados = defineModel<AdjuntoSolicitud[]>('adjuntosHeredados')

const { fileSize } = useFileSize()
const { mutateAsync: crearUpload } = useUploadCreate()
const { mutateAsync: eliminarUpload } = useUploadDelete()
const input = useTemplateRef<HTMLInputElement>('input')

let secuencia = 0
const uploaded = ref<AdjuntoSubiendo[]>([])
const heredados = computed(() => adjuntosHeredados.value ?? [])
const heredadosPintables = computed(() => {
  // Este filtro se aplica porque, al enviar el formulario, se actualiza la query de la solicitud y
  // el control pinta el mismo upload también como heredado de la solicitud actualizada.
  const idsExcluidos = uploaded.value.map(d => d.id).filter(d => d)
  return heredados.value.filter((d) => !idsExcluidos.includes(d.upload_id))
})

// El formulario que contiene al componente usa esto para no enviarse mientras
// todavía hay archivos en vuelo.
const subiendo = computed(() => uploaded.value.some(d => d.estado === 'subiendo'))

// Resumen para lectores de pantalla: cambia con el estado de cada archivo, no
// con cada tick del porcentaje, así no se repiten anuncios innecesarios.
const mensajeEstado = computed(() => {
  const enVuelo = uploaded.value.filter(d => d.estado === 'subiendo').length
  const conError = uploaded.value.filter(d => d.estado === 'error').length
  if (enVuelo) return `Subiendo ${enVuelo} ${enVuelo === 1 ? 'archivo' : 'archivos'}…`
  if (conError) return `${conError} ${conError === 1 ? 'archivo no se pudo subir' : 'archivos no se pudieron subir'}.`
  return ''
})

watchEffect(() => uploadedIds.value = uploaded.value.map(d => d.id).filter(d => d)
  .concat(heredados.value.map((adjunto) => adjunto.upload_id)))

const select = () => input.value.click()
// Thunderbird, checks file path... allowing files with same name
const check = (name: string) => !uploaded.value.some(v => v.filename === name)

function change({ target }: Event) {
  const el = target as HTMLInputElement
  if (el.files.length) {
    [...el.files].forEach((file) => check(file.name) && subir(file))
  }
  // Permite volver a seleccionar el mismo archivo (por ejemplo, después de un error).
  el.value = ''
}

function subir(file: File, existente: AdjuntoSubiendo | null = null) {
  const item = existente ?? reactive<AdjuntoSubiendo>({
    key: `archivo-${++secuencia}`,
    filename: file.name,
    filesize: file.size,
    archivo: file,
    estado: 'subiendo',
    progreso: 0,
  })

  item.estado = 'subiendo'
  item.progreso = 0
  item.error = undefined
  if (!existente) uploaded.value.push(item)

  const data = new FormData()
  data.append('upload', file)
  data.append('filename', file.name)
  data.append('filesize', String(file.size))
  data.append('filemodified', String(file.lastModified))

  crearUpload({
    data,
    onProgress: ({ loaded, total }) => {
      if (total) item.progreso = Math.round((loaded / total) * 100)
    },
  })
    .then((res) => {
      const pos = uploaded.value.findIndex(d => d.key === item.key)
      if (pos !== -1) {
        uploaded.value[pos] = { ...res, key: item.key, estado: 'listo', progreso: 100 }
      }
    })
    .catch(() => {
      item.estado = 'error'
      item.progreso = 0
    })
}

const reintentar = (item: AdjuntoSubiendo) => {
  if (item.estado === 'subiendo') return
  item.archivo && subir(item.archivo, item)
}

const eliminar = (item: AdjuntoSubiendo) => {
  if (item.eliminando) return
  item.eliminando = true
  eliminarUpload(item.id)
    .then(() => uploaded.value = uploaded.value.filter(d => d.id !== item.id))
    .catch(() => { item.eliminando = false })
}

const delAdjuntoHeredado = (adjuntoId: number) => {
  adjuntosHeredados.value = adjuntosHeredados.value.filter(adjunto => adjunto.id !== adjuntoId)
}

defineExpose({ select, subiendo })
// TODO: del(uploaded files) if not submitted
</script>

<template>
  <p class="visually-hidden" role="status" aria-live="polite">{{ mensajeEstado }}</p>
  <ul>
    <li v-for="{ id, filename, file, filesize } in heredadosPintables" :key="id">
      <div class="fila">
        <a v-tippy="filename" :href="file" class="text-truncate">
          {{ filename }}
        </a>
        <span class="text-nowrap text-muted">
          ({{ fileSize(filesize) }})
        </span>
        <span class="acciones">
          <BButton v-if="id" variant="close" :aria-label="`Quitar ${filename}`"
            @click.prevent.stop="delAdjuntoHeredado(id)" v-tippy="'Quitar adjunto'" />
        </span>
      </div>
    </li>
    <li v-for="item in uploaded" :key="item.id || item.key" :class="{ error: item.estado === 'error' }"
      :aria-busy="item.estado === 'subiendo' || item.eliminando ? 'true' : undefined">
      <div class="fila">
        <a v-tippy="item.filename" :class="{ error: item.estado === 'error' }" :href="item.file"
          class="text-truncate">
          {{ item.filename }}
        </a>
        <span class="text-nowrap text-muted">
          ({{ fileSize(item.filesize) }})
        </span>
        <span class="acciones">
          <BSpinner v-if="item.eliminando" small :label="`Quitando ${item.filename}`" />
          <BButton v-else-if="item.id" variant="close" :aria-label="`Quitar ${item.filename}`"
            @click.prevent.stop="eliminar(item)" v-tippy="'Quitar adjunto'" />
          <BSpinner v-else-if="item.estado === 'subiendo'" small :label="`Subiendo ${item.filename}`" />
        </span>
      </div>
      <div v-if="item.estado === 'subiendo'" class="mt-1">
        <BProgress :value="item.progreso" striped animated height="4px" :aria-label="`Subiendo ${item.filename}`"
          aria-valuemin="0" aria-valuemax="100" :aria-valuenow="item.progreso" />
        <span class="small text-muted">Subiendo… {{ item.progreso }}%</span>
      </div>
      <div v-else-if="item.estado === 'error'" class="small text-danger">
        No se pudo subir el archivo.
        <BButton variant="link link-danger p-0 align-baseline" @click.prevent.stop="reintentar(item)">
          Reintentar
        </BButton>
      </div>
    </li>
  </ul>
  <input type="file" multiple class="d-none" ref="input" @change="change" />
</template>

<style scoped lang="scss">
ul {
  max-width: 540px;
  list-style: none;
  padding-left: 0;

  li {
    background-color: var(--bs-primary-100);
    margin-bottom: 2px;
    border-radius: var(--bs-border-radius-lg);
    // Sangría a la izquierda para que el texto no nazca pegado al borde redondeado.
    padding: 3px 6px 3px 12px;

    &.error {
      background-color: var(--bs-danger-100);
    }

    a {
      text-decoration: none;

      &.error {
        color: var(--bs-secondary);
      }
    }
  }
}

.fila {
  display: flex;
  align-items: center;
  gap: 8px;
}

.acciones {
  // Ancho fijo: el botón y el spinner comparten hueco, así la fila no se
  // desplaza cuando uno reemplaza al otro. Empuja al extremo derecho.
  flex: 0 0 20px;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

// Bootstrap dimensiona .btn-close con width/height en em, no con
// --bs-btn-font-size, así que el tamaño se ajusta con font-size.
.btn-close {
  font-size: var(--bs-x-small);
  padding: 4px;
}
</style>
