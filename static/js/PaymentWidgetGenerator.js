// eslint-disable-next-line no-unused-vars
class SxcPaymentWidget {
  constructor(data) {
    this.data = data
    this.initialize()
  }

  initialize() {
    var baseUrl = !this.data.url
      ? 'https://market.southxchange.com'
      : this.data.url
    var path = !this.data.path ? '/Content/widget/index.html' : this.data.path
    var container = document.getElementById(this.data.elementId)

    var iframe = document.createElement('iframe')
    iframe.setAttribute('src', baseUrl + path)
    iframe.setAttribute('width', '100%')
    iframe.setAttribute('height', '100%')
    iframe.setAttribute(
      'style',
      'border:2px solid #337ab7; border-radius: 6px;'
    )
    this.iframe = iframe

    iframe.addEventListener('load', () => {
      var params = Object.assign({}, this.data)
      delete params.elementId

      this.iframe.contentWindow.postMessage(
        { call: 'sendParams', params: params },
        baseUrl
      )
    })

    container.appendChild(iframe)
  }
}
