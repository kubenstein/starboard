//
// taken from:
// http://stackoverflow.com/a/14573049

export default function base64UrlToDataBuffer(base46urlString) {
  const data = base46urlString.split(',')[1];

  if (typeof Buffer.from === 'function') {
    return Buffer.from(data, 'base64'); // Node 5.10+
  }
  return new Buffer(data, 'base64'); // older Node versions
}
