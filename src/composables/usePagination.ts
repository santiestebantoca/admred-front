import { ref, computed, watch } from 'vue'

export default function usePagination() {
    const page_ = ref(1) // current page
    const base = ref(10) // rows per page
    const total = ref(0) // total number of rows to paginate
    const pages = computed(() => Math.ceil(total.value / base.value) || 1)
    watch(pages, val => (page_.value > val) && (page_.value = val))
    const data = computed({
        get() { return page_.value },
        set(val) {
            if (val < 1) page_.value = 1
            else if (val > pages.value) page_.value = pages.value
            else page_.value = val
        }
    })
    const range = computed(() => {
        const max = page_.value * base.value
        const min = max - base.value
        return min + ',' + max
    })
    const text = computed(() => {
        if (total.value === 0) return '0 de 0'
        let max = page_.value * base.value
        const min = max - base.value + 1
        if (max > total.value) max = total.value
        return min + '-' + max + ' de ' + total.value
    })
    const nextDisabled = computed(() => page_.value >= pages.value)
    const prevDisabled = computed(() => page_.value <= 1)
    const next = () => (page_.value < pages.value) && page_.value++
    const prev = () => (page_.value > 1) && page_.value--
    const first = () => page_.value = 1
    const last = () => page_.value = pages.value
    return { data, range, text, base, total, next, prev, first, last, nextDisabled, prevDisabled }
}