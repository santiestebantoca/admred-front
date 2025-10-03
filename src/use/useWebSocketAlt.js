// To react to data modification on the server
// This modifications are notified through Messages like { table, action } 
// Messages are sent by server through websocket (which is not working)
// Or, client components using handlePost (as alternative)

import useFolderStore from '@/stores/folder'
import useItemStore from '@/stores/item'

export default function () {
  const item = useItemStore()
  const folder = useFolderStore()
  // const socket = new WebSocket(import.meta.env.VITE_WSS_URL)
  const wsStatus = {}
  // socket.onchange = ev => wsStatus = ev
  // socket.onmessage = msg => handler(msg)
  function handler(msg) {
    // console.log('Recieve from wss:')
    // console.log(msg)
    // return
    // Simple handler (the efficient one is quite complicated)
    if (
      ['create', 'forward', 'assign', 'reply', 'approve'].includes(msg.action)
    ) {
      folder.get()
      folder.pending.get()
    }
    if (
      ['forward', 'assign', 'reply', 'approve', 'rate'].includes(msg.action)
    ) {
      item.get()
    }
  }
  function handlePost(msg) {
    !wsStatus.active && handler(msg)
  }
  return {
    handlePost
  }
}
