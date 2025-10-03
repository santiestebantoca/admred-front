import { ref } from "vue"

export function useTeleportTarget(selector) {
    const res = ref(null)
    let interval = 100
    const timer = setInterval(() => {
        if (document.querySelector(selector)) {
            res.value = true
            clearInterval(timer)
        } else interval = 200
    }, interval)
    return res
}