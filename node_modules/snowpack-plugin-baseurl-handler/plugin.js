const pkt = require('./package.json')

const defaultFileExt= ['.html', '.js', '.jsx', '.css']
const defaultBaseUrl= ''

function formatOptions(options) {
  const {
    exts = defaultFileExt,
    baseUrl = defaultBaseUrl,
    debug = false,
  } = options || {};

  return {
    exts: Array.isArray(exts) && exts.length > 0 ? exts : defaultFileExt,
    baseUrl: baseUrl !== '' ? baseUrl.replace(/\/$/, '').replace(/^\//, '') : defaultBaseUrl,
    debug: typeof Boolean ? debug : false
  };
}


module.exports = function (snowpackConfig, pluginOptions) {

  const { exts, baseUrl, debug } = formatOptions(pluginOptions);

  let isDev = true;
  let _baseurl = baseUrl && baseUrl !== '/' ? `/${baseUrl}` : ''
  return {
    name: pkt.name,
    async run(options) {
      isDev = !!options.isDev;
      _baseurl = isDev ? '' : _baseurl
      if (debug) {
        console.log(`baseurl: ${_baseurl}`)
      }
    },
    async transform({filePath, fileExt, contents}) {

      if (exts.find(ext => ext === fileExt)) {
        if (debug) {
          console.log(`${filePath}:`, 'transformed')
        }
        return contents.replace(/%BASE_URL%/gi, `${_baseurl}`)
      }
      return
    },
  };
}
