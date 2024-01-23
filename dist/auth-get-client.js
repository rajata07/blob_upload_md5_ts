"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockBlobClientFromDefaultAzureCredential = exports.getBlobClientFromAccountAndKey = exports.getContainerClientFromSharedKeyCredential = exports.getContainerClientFromSasToken = exports.getContainerClientFromDefaultAzureCredential = exports.getBlobServiceClientWithAccountAndKey = exports.getBlobServiceClientWithAnonymousCredential = exports.getBlobServiceClientFromDefaultAzureCredential = exports.getBlobServiceClientFromConnectionString = void 0;
const identity_1 = require("@azure/identity");
const storage_blob_1 = require("@azure/storage-blob");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
/*

    Client objects include BlobServiceClient, ContainerClient, and BlobClient

    Client objects can be create with, in order of most secure to least secure

    . managed identity using DefaultAzureCredential
    . SAS token
    . account name and key
    . connection string

*/
function getBlobServiceClientFromConnectionString() {
    const connString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!connString)
        throw Error('Azure Storage Connection string not found');
    const storagePipelineOptions = {};
    const client = storage_blob_1.BlobServiceClient.fromConnectionString(connString, storagePipelineOptions);
    return client;
}
exports.getBlobServiceClientFromConnectionString = getBlobServiceClientFromConnectionString;
function getBlobServiceClientFromDefaultAzureCredential() {
    // Connect without secrets to Azure
    // Learn more: https://www.npmjs.com/package/@azure/identity#DefaultAzureCredential
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    if (!accountName)
        throw Error('Azure Storage accountName not found');
    const client = new storage_blob_1.BlobServiceClient(`https://${accountName}.blob.core.windows.net`, new identity_1.DefaultAzureCredential());
    return client;
}
exports.getBlobServiceClientFromDefaultAzureCredential = getBlobServiceClientFromDefaultAzureCredential;
function getBlobServiceClientWithAnonymousCredential() {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    if (!accountName)
        throw Error('Azure Storage accountName not found');
    const blobServiceUri = `https://${accountName}.blob.core.windows.net`;
    const blobServiceClient = new storage_blob_1.BlobServiceClient(blobServiceUri, new storage_blob_1.AnonymousCredential());
    return blobServiceClient;
}
exports.getBlobServiceClientWithAnonymousCredential = getBlobServiceClientWithAnonymousCredential;
function getBlobServiceClientWithAccountAndKey() {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    if (!accountName)
        throw Error('Azure Storage accountName not found');
    if (!accountKey)
        throw Error('Azure Storage accountKey not found');
    const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(accountName, accountKey);
    const blobServiceClient = new storage_blob_1.BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);
    return blobServiceClient;
}
exports.getBlobServiceClientWithAccountAndKey = getBlobServiceClientWithAccountAndKey;
function getContainerClientFromDefaultAzureCredential(containerName) {
    // Azure Storage resource name
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    if (!accountName)
        throw Error('Azure Storage accountName not found');
    const baseUrl = `https://${accountName}.blob.core.windows.net`;
    // Create ContainerClient
    const containerClient = new storage_blob_1.ContainerClient(`${baseUrl}/${containerName}`, new identity_1.DefaultAzureCredential());
    return containerClient;
}
exports.getContainerClientFromDefaultAzureCredential = getContainerClientFromDefaultAzureCredential;
function getContainerClientFromSasToken(containerName, sasToken) {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    // Create Url
    // SAS token is the query string with typical `?` delimiter
    const sasUrl = `https://${accountName}.blob.core.windows.net/${containerName}?${sasToken}`;
    console.log(`\nContainerUrl = ${sasUrl}\n`);
    // Create container client from SAS token url
    const containerClient = new storage_blob_1.ContainerClient(sasUrl);
    return containerClient;
}
exports.getContainerClientFromSasToken = getContainerClientFromSasToken;
function getContainerClientFromSharedKeyCredential(containerName) {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    if (!accountName)
        throw Error('Azure Storage accountName not found');
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    if (!accountKey)
        throw Error('Azure Storage accountKey not found');
    const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(accountName, accountKey);
    const baseUrl = `https://${accountName}.blob.core.windows.net`;
    const containerClient = new storage_blob_1.ContainerClient(`${baseUrl}/${containerName}`, sharedKeyCredential);
    return containerClient;
}
exports.getContainerClientFromSharedKeyCredential = getContainerClientFromSharedKeyCredential;
function getBlobClientFromAccountAndKey(containerName, blobName) {
    // Credential secrets
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    if (!accountName)
        throw Error('AZURE_STORAGE_ACCOUNT_NAME not found');
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    if (!accountKey)
        throw Error('AZURE_STORAGE_ACCOUNT_KEY not found');
    // Create credential
    const sharedKeyCredential = new storage_blob_1.StorageSharedKeyCredential(accountName, accountKey);
    // Set resource names - must already exist
    const baseUrl = `https://${accountName}.blob.core.windows.net`;
    // create blob from BlockBlobClient
    const blockBlobClient = new storage_blob_1.BlockBlobClient(`${baseUrl}/${containerName}/${blobName}`, sharedKeyCredential);
    return blockBlobClient;
}
exports.getBlobClientFromAccountAndKey = getBlobClientFromAccountAndKey;
function getBlockBlobClientFromDefaultAzureCredential(containerName, blobName) {
    // Credential secrets
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    if (!accountName)
        throw Error('AZURE_STORAGE_ACCOUNT_NAME not found');
    const baseUrl = `https://${accountName}.blob.core.windows.net`;
    const client = new storage_blob_1.BlockBlobClient(`${baseUrl}/${containerName}/${blobName}`, new identity_1.DefaultAzureCredential());
    return client;
}
exports.getBlockBlobClientFromDefaultAzureCredential = getBlockBlobClientFromDefaultAzureCredential;
