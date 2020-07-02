export default function ({ $axios, redirect }) {
  $axios.setBaseURL(process.env.apiUrl)
  $axios.setHeader('Accept', 'application/json')

  $axios.onRequest((config) => {
    // console.log('Making request to ' + config.url)
  })

  $axios.onError((error) => {
    if (typeof error.response === 'undefined') {
      return alert(
        'Gagal menyambungkan ke server, silahkan coba beberapa saat kembali.'
      )
    }

    const code = parseInt(error.response && error.response.status)

    /*
    @TODO move all messages to static/dictionary strings
     */

    if (code === 401) {
      alert(
        'Waktu sesi Anda telah habis, silahkan refresh halaman ini atau login kembali.'
      )
      return redirect('/login')
    }

    if (code === 403) {
      return alert('Anda tidak memiliki hak akses.')
    }

    if (code === 429) {
      return alert(
        'Terlalu banyak Request, silahkan tunggu beberapa saat kembali.'
      )
    }

    if (code > 500) {
      return alert(
        'Telah terjadi kesalahan sistem, silahkan ulangi beberapa saat kembali.'
      )
    }
  })
}
