import { message } from 'antd'

export default function CopyToClipboardFromTableBody(tables) {
  let text = ''
  for (let x = 0; x < tables.length; x++) {
    for (let i = 0; i < tables[x].rows.length; i++) {
      for (let j = 0; j < tables[x].rows[i].cells.length; j++) {
        text += `${tables[x].rows[i].cells[j].innerText}`
        text += j + 1 === tables[x].rows[i].cells.length ? '' : '\t'
      }
      text += '\n'
    }
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
