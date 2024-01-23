# MD5 Token for Larger Files in Azure Blob Storage

This repo provides sample code in TypeScript when you are uploading larger files using <a href="https://learn.microsoft.com/en-us/javascript/api/%40azure/storage-blob/blockblobclient?view=azure-node-latest#@azure-storage-blob-blockblobclient-uploaddata">uploadData</a> (Parallel uploading option) which does not generate md5 by default.


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

1) Copy .env.sample to .env and replace all following env variables with your Azure Portal values:
```
    AZURE_STORAGE_CONNECTION_STRING=""
    AZURE_STORAGE_ACCOUNT_NAME=""
    AZURE_STORAGE_ACCOUNT_KEY=""
    AZURE_TENANT_ID=""
    AZURE_CLIENT_ID=""
    AZURE_CLIENT_SECRET=""
    AZURE_CONTAINER_NAME=""
```

2) Run npm install

3) Place a larger file (<300MB) under files directory and specify the path under hard coded variable localFilePath in index.ts
   Feel free to use following command to generate a larger file:
   
   ``` dd if=/dev/urandom of=1GB.bin bs=64M count=16 iflag=fullblock ```

4) Replace file name in index.ts. This is the file from step 3 and this will be uploaded to Blob.

5) Execute ```npm run dev``` to run the app which will upload the file to Blob Storage which you configured. 

