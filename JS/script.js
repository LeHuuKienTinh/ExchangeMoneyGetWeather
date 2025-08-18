const valueFromCr = {}

document.addEventListener('DOMContentLoaded', loadCurrencyOptions)
document
  .getElementById('converter-form')
  .addEventListener('submit', async function (e) {
    e.preventDefault()

    const amount = parseFloat(document.getElementById('amount').value)

    const from = document.getElementById('from-currency').value
    console.log("from ne",from)
    getCapitalBiggest(
      from,
      'weather-from',
      'capital-name-from',
      'img-from',
      'detail-from',
      'time-update-from'
    )

    const to = document.getElementById('to-currency').value
    getCapitalBiggest(
      to,
      'weather-to',
      'capital-name-to',
      'img-to',
      'detail-to',
      'time-update-to'
    )

    if (isNaN(amount) || amount < 0) {
      document.getElementById('result').textContent =
        'Please enter a valid amount.'
      return
    }
    try {
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/e1a4a8b00caf26bdf5029f84/pair/${from}/${to}`
      )
      if (!res.ok) {
        throw new Error('Faid to exchange money')
      }
      const data = await res.json()
      const tempResult = (data.conversion_rate * amount).toLocaleString()
      document.getElementById('result').textContent = `${
        amount + ' ' + from
      } = ${tempResult + ' ' + to} `
    } catch (err) {
      console.error('ERROR', err.message)
    }
  })

async function loadCurrencyOptions() {
  try {
    const res = await fetch('https://openexchangerates.org/api/currencies.json')
    if (!res.ok) throw new Error('Failed to fetch currency list')

    const data = await res.json()

    const fromSelect = document.getElementById('from-currency')
    const toSelect = document.getElementById('to-currency')

    Object.entries(data).forEach(([key, value]) => {
      valueFromCr[key] = value
      const optionFrom = document.createElement('option')
      optionFrom.value = key
      optionFrom.textContent = key
      fromSelect.appendChild(optionFrom)

      const optionTo = document.createElement('option')
      optionTo.value = key
      optionTo.textContent = key
      toSelect.appendChild(optionTo)
    })
  } catch (err) {
    console.error(err)
  }
}

async function loadWeatherFromTo(
  location,
  idEl,
  idCap,
  idImg,
  idDetail,
  idTimeUpdate
) {
  //GET THE CAPITAL
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=b4ffd155284443eebac42057251408&q=${location}&aqi=no`
    )
    if (!res.ok) throw new Error('Failed to fetch currency list')
    const data = await res.json()
    const temp_c = data.current.temp_c  
    document.getElementById(`${idEl}`).textContent = temp_c + '°C'
    document.getElementById(`${idCap}`).textContent = data.location.name
    document.getElementById(`${idImg}`).src = data.current.condition.icon
    document.getElementById(`${idDetail}`).textContent =
      data.current.condition.text

    const localtime = data.current.last_updated
    const dateObj = new Date(localtime.replace(' ', 'T'))
    const formatted = dateObj.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    document.getElementById(`${idTimeUpdate}`).textContent ='Last updated: ' + formatted
    console.log(data.current.last_updated)
    console.log('tên tp', data.location.name)
  } catch (err) {
    console.error('Lỗi', err.message)
  }
}

async function getCapitalBiggest(
  from,
  idEl,
  idCap,
  idImg,
  idDetail,
  idTimeUpdate
) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/currency/${from}`)
    if (!res.ok) {
      throw new Error('lỗi khi truy cập vào nước')
    }
    const data = await res.json()
    const mostPopulated = data.reduce((max, country) => {
      return country.population > max.population ? country : max
    })
    const capitalOfCurrency = mostPopulated.capital[0]
    loadWeatherFromTo(
      capitalOfCurrency,
      idEl,
      idCap,
      idImg,
      idDetail,
      idTimeUpdate
    )
  } catch (err) {
    console.err('Lỗi', err.message)
  }
}
