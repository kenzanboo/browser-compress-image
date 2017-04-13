# browser-compress-image
Compress a jpeg image in javascript on your browser. Used to compress a phone camera image before sending over the network.

## Install
```
npm install browser-compress-image
```

## Usage
```

handlePhotoSelect = (event) => {
  const photoFile = event.target.files[0]
  compressImage(photoFile).then(({ shrunkBase64, compressedFile }) => {
        self.compressedPhotoFile = compressedFile
        self.setState({ previewPhoto: shrunkBase64 })
  })
}

<input
  type="file"
  accept="image/*"
  onChange={this.handlePhotoSelect}
/>

```

## API
Input is a File. Optionally the second param can be a number that specifies the compression ratio. Default is 0.5
Output is a promise that resolves an object with two keys. { shrunkBase64, compressedFile }
