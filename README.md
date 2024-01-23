# MD5 Token for larger files in Azure Blob Storage

This repo provides sample code in TypeScript when you are uploading bigger files using <a href="https://learn.microsoft.com/en-us/javascript/api/%40azure/storage-blob/blockblobclient?view=azure-node-latest#@azure-storage-blob-blockblobclient-uploaddata">uploadData</a> (Parallel uploading option) which does not generate md5 by default.


Blobs uploaded by PutBlob will have Content-MD5 calculated by Storage service. But Blobs uploaded PutBlock/PutBlockList won’t have it, and client needs to calculate locally.
Below is sample snippet to upload parallely with setting MD5 hash manually:

```javascript
// Upload the file content to the block blob
await blockBlobClient.uploadData(fileContentBuffer, {
    blobHTTPHeaders: {
        blobContentMD5: Buffer.from(md5Hash, "hex")
    },
    metadata: {
        // Add any additional metadata if needed
        key1: "value1",
        key2: "value2",
    }
});
```

For detailed code snippet, please see index.ts file. To run repo on locally follow steps:

1) Copy .env.sample to .env and replace all env variables with your Azure Portal access keys
2) Run npm install
3) npm run dev


