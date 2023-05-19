![npm downloads](https://img.shields.io/npm/dw/fast-node-downloader) 
![npm bundle size](https://img.shields.io/bundlephobia/minzip/fast-node-downloader)

The `fast-node-download` library is a powerful Node.js library that enables multi-threaded downloading and provides a command-line interface (CLI). 
This library is designed to enhance download speeds by utilizing multiple threads simultaneously.

## Installing

Using npm:

```bash
$ npm install fast-node-downloader
```

Using yarn:

```bash
$ yarn add fast-node-downloader
```

Using pnpm:

```bash
$ pnpm add fast-node-downloader
```

## Usage
### CLI
The library provides a command-line interface (CLI) that allows you to easily initiate downloads from the terminal. Here's an example of how to use the CLI:
```bash
$ fnd download <download_url>

Options:
  -c  Number of download connections
  -d  Downloaded file directory
  -h  An object containing HTTP headers to include in the request
```

### API
You can also use the library in your Node.js applications. Here's an example of how to use it:
```javascript
const { download } = require("fast-node-downloader")

const startDownload = async () => {
    try {
        const options = {
            // The local destination path to save the file to.
            // Default value is your Downloads folder.
            directory: "/home/hiepnk/Downloads",

            // Log download progress. Default is false.
            debug: true,

            // The number of parallel connections to use for the download. 
            // Default is cpu multiplier.
            numConnections: 4,

            // Additional headers to use for the download request.
            headers: {
                'Authorization': 'Bearer your_token'
            }
        }
        const key = await download("https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", options);
        console.log("\n" + key)
    } catch (error) {
        console.log(err.message)
    }
}

startDownload();
```

## License
This project is licensed under the MIT License.

### Issues
If you encounter any issues or have suggestions for improvement, please open an issue.
