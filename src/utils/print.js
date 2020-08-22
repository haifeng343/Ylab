export function print(html) {
  const win = window.open('', '')
  win.document.write(html)
  setTimeout(() => {
    win.print()
  }, 300)
  win.addEventListener('afterprint', () => {
    win.close()
  })
}
