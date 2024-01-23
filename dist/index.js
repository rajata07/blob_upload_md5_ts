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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
dotenv.config();
// Get BlobServiceClient
const auth_get_client_1 = require("./auth-get-client");
const blobServiceClient = (0, auth_get_client_1.getBlobServiceClientFromDefaultAzureCredential)();
// <Snippet_UploadBlob>
function uploadBlobFromBuffer(containerClient, blobName, buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create blob client from container client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        // Upload buffer
        yield blockBlobClient.uploadData(buffer);
    });
}
// </Snippet_UploadBlob>
function main(blobServiceClient) {
    return __awaiter(this, void 0, void 0, function* () {
        const blobs = [];
        const containerClient = blobServiceClient.getContainerClient('biggerbucket');
        // Get fully qualified path of file
        const localFilePath = path_1.default.join('files', 'DEU_232079_lang_expose.pdf');
        // because no type is passed, open file as buffer
        const buffer = yield fs_1.promises.readFile(localFilePath);
        // create blobs with Promise.all
        // include the file extension
        for (let i = 0; i < 10; i++) {
            blobs.push(uploadBlobFromBuffer(containerClient, `sample-${i}.txt`, buffer));
        }
        yield Promise.all(blobs);
    });
}
main(blobServiceClient)
    .then(() => console.log('success'))
    .catch((err) => {
    if (err instanceof Error) {
        console.log(err.message);
    }
});
