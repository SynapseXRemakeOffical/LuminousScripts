import crypto from 'crypto-js';

// These will be provided by federal - leave blank for now
const SECRET_N1 = ""; // Will be provided
const SECRET_N2 = ""; // Will be provided  
const SECRET_N3 = ""; // Will be provided
const APP_NAME = ""; // Will be provided

interface SyncResponse {
  st: number;
  cf: string;
  nodes: string[];
}

interface KeyCheckResponse {
  code: string;
  message: string;
  data?: {
    note: string;
    total_executions: number;
    auth_expire: number;
  };
  signature?: string;
}

export interface KeyValidationResult {
  isValid: boolean;
  code: string;
  message: string;
  data?: {
    note: string;
    total_executions: number;
    auth_expire: number;
  };
}

// Generate random 16-character alphanumeric string
function randomString(): string {
  const length = 16;
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// SHA1 hash with lowercase hex output
function sha1Hash(data: string): string {
  return crypto.SHA1(data).toString(crypto.enc.Hex);
}

// Generate hardware ID (placeholder - you may want to implement actual HWID generation)
function generateHWID(): string {
  // This is a placeholder HWID - in production you'd want actual hardware fingerprinting
  return `${Math.random().toString(16).substr(2, 8)}-${Math.random().toString(16).substr(2, 8)}-${Math.random().toString(16).substr(2, 8)}-${Math.random().toString(16).substr(2, 8)}`;
}

export async function validateKey(keyToCheck: string): Promise<KeyValidationResult> {
  try {
    // Step 1: Fetch server info
    const syncResponse = await fetch('https://sdkapi-public.luarmor.net/sync');
    const syncData: SyncResponse = await syncResponse.json();
    
    const SERVER_TIME = syncData.st;
    const NODES = syncData.nodes;
    
    // Pick random node
    const randomNode = NODES[Math.floor(Math.random() * NODES.length)];
    
    // Step 2: Check the key
    const clientNonce = randomString();
    const clientHwid = generateHWID();
    
    // Calculate external signature
    const externalSignature = sha1Hash(
      clientNonce + SECRET_N1 + 
      keyToCheck + SECRET_N2 + 
      SERVER_TIME + SECRET_N3 + 
      clientHwid
    );
    
    const checkUrl = `${randomNode}external_check_key?by=${APP_NAME}&key=${keyToCheck}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'clienttime': SERVER_TIME.toString(),
      'externalsignature': externalSignature,
      'clientnonce': clientNonce,
      'clienthwid': clientHwid,
      'executor-fingerprint': clientHwid
    };
    
    const checkResponse = await fetch(checkUrl, {
      method: 'GET',
      headers
    });
    
    const checkData: KeyCheckResponse = await checkResponse.json();
    
    // Verify response signature for KEY_VALID
    if (checkData.code === 'KEY_VALID' && checkData.signature) {
      const expectedSignature = sha1Hash(clientNonce + SECRET_N3 + checkData.code);
      
      if (expectedSignature !== checkData.signature) {
        return {
          isValid: false,
          code: 'SIGNATURE_MISMATCH',
          message: 'Server signature verification failed - response may be tampered'
        };
      }
    }
    
    return {
      isValid: checkData.code === 'KEY_VALID',
      code: checkData.code,
      message: checkData.message,
      data: checkData.data
    };
    
  } catch (error) {
    return {
      isValid: false,
      code: 'NETWORK_ERROR',
      message: 'Failed to validate key. Please check your internet connection and try again.'
    };
  }
}