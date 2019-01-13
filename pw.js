
const pw_service_uuid = '0000feaa-0000-1000-8000-00805f9b34fb'

navigator.bluetooth.addEventListener('advertisementreceived', event => {
  // https://github.com/google/eddystone/tree/master/eddystone-url
  let eddystone = event.serviceData.get(pw_service_uuid)

  if (!eddystone) { return }

  let type = eddystone.getUint8(0)
  if (type !== 0x10) { return }

  let tx = eddystone.getUint8(1)
  let scheme = eddystone.getUint8(2)

  let url = ''

  switch (scheme) {
    case 0x00: url += 'http://www.'; break
    case 0x01: url += 'https://www.'; break
    case 0x02: url += 'http://'; break
    case 0x03: url += 'https://'; break
    default: console.log('Malformed beacon'); return
  }

  for (let i = 3; i < eddystone.byteLength; i++) {
    let value = eddystone.getUint8(i)

    // Reserved.
    if ((value > 0x0e && value < 0x20) || value > 0x7F) { continue }

    switch (value) {
      case 0x00: url += '.com/'; break
      case 0x01: url += '.org/'; break
      case 0x02: url += '.edu/'; break
      case 0x03: url += '.net/'; break
      case 0x04: url += '.info/'; break
      case 0x05: url += '.biz/'; break
      case 0x06: url += '.gov/'; break
      case 0x07: url += '.com'; break
      case 0x08: url += '.org'; break
      case 0x09: url += '.edu'; break
      case 0x0a: url += '.net'; break
      case 0x0b: url += '.info'; break
      case 0x0c: url += '.biz'; break
      case 0x0d: url += '.gov'; break
      default: url += String.fromCharCode(value)
    }
  }

  console.log('Found a Physical Web beacon: ', tx, url)
})

var scan
function startscan () {
  navigator.bluetooth.requestLEScan({filters:
            [{services: [pw_service_uuid]}]}).then(function (result) {
    scan = result
  })
}

function stopscan () {
  scan.stop()
}
