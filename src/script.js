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
const _ = require("lodash")
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
      if (key == "MaxCapacity") {
        //let heading = document.getElementById("heading")
        let mtr = document.getElementById("mtr")
        mtr.value = ((stdout["MaxCapacity"] / stdout["DesignCapacity"]) * 100).toFixed(2)
        // mtr.min = 0
        // mtr.max = 100
        // mtr.low = 50
        // mtr.high = 79
        // mtr.optimum = 80
        //document.getElementById("heading").appendChild(mtr)
      }
      //alert(`Capacity: ${((stdout["MaxCapacity"] / stdout["DesignCapacity"]) * 100).toFixed(2)}`)
      document.getElementById('info').innerHTML += `<b>${_.startCase(key)}</b> ${data}<br/>`
    })
    console.log(stdout)
  }
})
//nativeImage.createThumbnailFromPath("/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/com.apple.macpro-cylinder.icns",
let comp = nativeImage.createFromNamedImage("NSComputer")
console.log(comp.getScaleFactors())
//comp = Buffer.from(comp.toPNG())
require("fs").writeFile("out.png", comp.toPNG(), 'binary', function (err) {
  console.log(err);
})
document.getElementById("compicon").src = comp.toDataURL()
// todo: find the right Mac icon to show in the interface and get battery age
// get battery percentage with `pmset -g batt | awk 'FNR==2{print $3}'`