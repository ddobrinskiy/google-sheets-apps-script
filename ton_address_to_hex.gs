/***********
 * Convert user address to raw hex format
 * code by Max Voloshinskii
 ***********/


/**
 * 
 *
 * @param {string} input address
 * @return {string} Hex address
 * @customfunction
 */
function hexAddressFromUserFriendly(input) {
  let addressUint8Array = Buffer.from(input, 'base64').data;
  let workchain = addressUint8Array[1];
  let addr = addressUint8Array.slice(2, 34);
  let hex = workchain.toString(16) + ":" + uint8ArrayToHex(addr)
  console.log(hex);
  return hex
}


function uint8ArrayToHex(byteArray) {
  const hexArray = [];

  for (let byte of byteArray) {
    const hex = byte.toString(16).padStart(2, '0');
    hexArray.push(hex);
  }

  return hexArray.join('');
}

function atob(base64String) {
  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=';

  if (base64String.length % 4 !== 0) {
    throw new Error('Invalid base64 string');
  }

  let output = '';
  let buffer = 0;
  let bits = 0;

  for (let i = 0; i < base64String.length; i++) {
    const char = base64String.charAt(i);
    if (char === '=') {
      break;
    }

    const value = base64Chars.indexOf(char);
    if (value === -1) {
      throw new Error('Invalid character found in base64 string');
    }

    buffer = (buffer << 6) | value;
    bits += 6;

    if (bits >= 8) {
      bits -= 8;
      output += String.fromCharCode((buffer >> bits) & 0xFF);
    }
  }

  return output;
}

class Buffer {
  constructor(size) {
    this.data = new Uint8Array(size);
    this.length = size;
  }

  static from(input, encoding = 'utf-8') {
    if (typeof input === 'string') {
      return Buffer._fromString(input, encoding);
    } else if (Array.isArray(input)) {
      return new Buffer(input.length)._fromArray(input);
    } else if (input instanceof ArrayBuffer || input instanceof Uint8Array) {
      return new Buffer(input.byteLength)._fromArrayBuffer(input);
    } else {
      throw new Error('Unsupported input type');
    }
  }

  static _fromString(string, encoding) {
    if (encoding === 'utf-8' || encoding === 'utf8') {
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(string);
      return new Buffer(encodedData.length)._fromArrayBuffer(encodedData);
    } else if (encoding === 'base64') {
      const decodedData = Buffer._decodeBase64(string);
      return new Buffer(decodedData.length)._fromArray(decodedData);
    } else {
      throw new Error('Unsupported encoding');
    }
  }

  static _decodeBase64(base64String) {
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes;
  }

  _fromArray(array) {
    this.data.set(array);
    return this;
  }

  _fromArrayBuffer(arrayBuffer) {
    this.data.set(new Uint8Array(arrayBuffer));
    return this;
  }

  toString(encoding = 'utf-8') {
    if (encoding === 'utf-8' || encoding === 'utf8') {
      const decoder = new TextDecoder();
      return decoder.decode(this.data);
    } else if (encoding === 'base64') {
      return Buffer._encodeBase64(this.data);
    } else {
      throw new Error('Unsupported encoding');
    }
  }

  static _encodeBase64(bytes) {
    // Encode Uint8Array to Base64 string
    let binary = '';
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
  }

  readUInt8(offset) {
    this._checkOffset(offset, 1);
    return this.data[offset];
  }

  writeUInt8(value, offset) {
    this._checkOffset(offset, 1);
    this.data[offset] = value;
  }

  _checkOffset(offset, byteLength) {
    if (offset < 0 || offset + byteLength > this.length) {
      throw new RangeError('Offset is out of bounds');
    }
  }
}



