import { message } from 'antd'

export default function CopyToClipboardFromTableBody(el) {
  let text = ''
  for (let i = 0; i < el.rows.length; i++) {
    for (let j = 0; j < el.rows[i].cells.length; j++) {
      text += `${el.rows[i].cells[j].innerText}\t`
    }
    text += '\n'
  }
  copyToClipboard(text)
  message.success('Copied to clipboard')
}

const copyToClipboard = str => {
  const el = document.createElement('textarea')
  el.value = str
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}
