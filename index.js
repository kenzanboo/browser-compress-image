/**
 * This reads the file into base64 and compresses it
 * The compression does not scale. it only uses a lossier jpeg compression to reduce size.
 * It does so by putting the image onto a canvas and scaling down the canvas.
 * We then display the preview image as the compressed image.
 * Sample image data
 * Compression at 0.7 takes us from 1526923 to 727359 which is .47
 * Compression at 0.6 takes us from 1526923 to 601531 which is .39
 * Compression at 0.5 takes us from 1526923 to 512327 which is .33
 *
 * Important Note! if we re-compress a compressed file, it actually gets bigger. Marginally.
 * It redraws the previously compressed image onto the canvas and the output is larger.
 */
export default function compressImage(photoFile, compressionRate = 0.5) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      // image loaded from file system
      const fullImageBase64 = reader.result // FULL RES
      const img = new Image()
      img.onload = function imgOnLoad() {
        // shrink image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.canvas.width = img.width
        ctx.canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        const shrunkBase64 = canvas.toDataURL('image/jpeg', compressionRate)  // Actual compression step
        const blob = dataURItoBlob(shrunkBase64) // eslint-disable-line
        const compressedFile = new File([blob], photoFile.name)
        resolve({
          shrunkBase64,
          compressedFile,
        })
      }
      img.src = fullImageBase64
    }
    reader.readAsDataURL(photoFile)
  })
}

/**
 * based off of Stoive's answer on
 * http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
 */
function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(dataURI.split(',')[1]);
  } else {
    byteString = decodeURI(dataURI.split(',')[1]);
  }
  // separate out the mime component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], { type:mimeString });
}
