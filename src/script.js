if (process.platform !== 'darwin') {
  alert('Sorry, this app only supports macOS.')
  /* const { remote } = require('electron')
  let w = remote.getCurrentWindow()
  w.close() */
  const { remote } = require('electron')
  remote.getCurrentWindow().close()
}
const { exec } = require('child_process')
const { app, nativeImage } = require('electron').remote
// todo: find a way to get battery age and manufacture date
/* exec('ioreg -abrc AppleSmartBattery | npx plist-to-json /dev/stdin', (err, stdout) => {
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
}) */
exec('ioreg -abrc AppleSmartBattery', (err, stdout) => {
  if (err) {
    alert(err)
  } else {
    stdout = require("plist").parse(stdout)[0]
    Object.keys(stdout).forEach((key) => {
      let data
      if (stdout[key] instanceof Buffer) {
        data = atob(btoa(stdout[key]))
      } else {
        data = typeof stdout[key] === 'string' ? stdout[key] : JSON.stringify(stdout[key])
      }
      document.getElementById('info').innerHTML += `<b>${key}</b> ${data}<br/>`
    })
    console.log(stdout)
  }
})
nativeImage.createThumbnailFromPath("/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/com.apple.macpro-cylinder.icns",
  { width: 500, height: 500 })
  .then((a) => console.log(Buffer.from(a.toPNG())))
  // todo: save this picture and see if it's the right icon