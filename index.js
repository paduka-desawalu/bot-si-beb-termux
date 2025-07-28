const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const { state, saveState } = useSingleFileAuthState('./auth.json')

async function startBot() {
  const sock = makeWASocket({ auth: state, printQRInTerminal: true })
  sock.ev.on('creds.update', saveState)
  sock.ev.on('connection.update', ({ connection }) => {
    if (connection === 'close') startBot()
    else if (connection === 'open') console.log('Si Beb Aktif!')
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return
    const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').toLowerCase()
    const from = msg.key.remoteJid

    if (text.includes('laporan')) {
      await sock.sendMessage(from, { text:
        '📊 Laporan Keuangan BUMDes:\nPendapatan: RpX\nBiaya: RpY\nLaba: RpZ\nSalam, Paduka 🙏'
      })
    } else if (text.includes('pak bayan')) {
      await sock.sendMessage(from, { text:
        'Pak Bayan, niki puniko informasinipun. Monggo dipun waca.'
      })
    } else if (text.includes('curhat')) {
      await sock.sendMessage(from, { text:
        'Curhat kemawon, Bot siap nyimak 😇'
      })
    } else {
      await sock.sendMessage(from, { text:
        'Halo! Ketik *laporan* / *pak bayan* / *curhat* supaya saya balas.' })
    }
  })
}

startBot()
