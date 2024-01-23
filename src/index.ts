import {
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient
} from '@azure/storage-blob';
import * as dotenv from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import filesystem from "fs";
import * as crypto from "crypto";

dotenv.config();

// Get BlobServiceClient
import { getBlobServiceClientFromDefaultAzureCredential } from './auth-get-client';
const blobServiceClient: BlobServiceClient =
  getBlobServiceClientFromDefaultAzureCredential();

// <Snippet_UploadBlob>
async function uploadBlobFromBuffer(
  containerClient: ContainerClient, blobName: string, buffer: Buffer
): Promise<void> {
  // Create blob client from container client
  const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);

  // Upload buffer
  await blockBlobClient.uploadData(buffer);
}
// </Snippet_UploadBlob>

async function main(blobServiceClient: BlobServiceClient) {
  const blobs: Promise<void>[] = [];

  const containerClient = blobServiceClient.getContainerClient('biggerbucket');

  // Get fully qualified path of file
  const localFilePath: string = path.join('files', '1GB.bin');

  // Create the container if it doesn't exist
  await containerClient.createIfNotExists();

  // Get a block blob client
  const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(localFilePath);

  // Read the file content as a buffer
  const fileContentBuffer = filesystem.readFileSync(localFilePath);

  // Calculate MD5 hash for the file
  const md5Hash = calculateContentMD5(fileContentBuffer);

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
}

function calculateContentMD5(content: string | Buffer): string {
  const md5Hash = crypto.createHash("md5").update(content).digest("hex");
  return md5Hash;
}


main(blobServiceClient)
  .then(() => {
    console.log('success')
  })
  .catch((err: unknown) => {
    console.log('failed')
    if (err instanceof Error) {
      console.log(err.message);
    }
  });