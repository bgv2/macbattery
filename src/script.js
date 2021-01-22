if (process.platform !== 'darwin') {
  alert('Sorry, this app only supports macOS.')
  /* const { remote } = require('electron')
  let w = remote.getCurrentWindow()
  w.close() */
  const { remote } = require('electron')
  remote.getCurrentWindow().close()
}
const { exec } = require('child_process')
exec('ioreg -abrc AppleSmartBattery | plist-to-json /dev/stdin', (err, stdout) => {
  if (err) {
    alert(err)
  } else {
    stdout = JSON.parse(stdout)[0][0]
    Object.keys(stdout).forEach((key) => {
      const data = typeof stdout[key] === 'string' ? stdout[key] : JSON.stringify(stdout[key])
      document.getElementById('info').innerHTML += `<b>${key}</b> ${data}<br/>`
    })
    console.log(stdout)
  }
})
