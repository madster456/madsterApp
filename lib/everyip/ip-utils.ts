import BigNumber from 'bignumber.js';

/*
 2^128 - 1 - fuck, this is a big number. Compared to eieio's UUIDv4 number which was 2^122, this is 
 64 times larger than that. Need to collect facts about how large this number is. Maybe a cool visualization piece.
*/
export const MAX_IPv6 = new BigNumber('340282366920938463463374607431768211455');

/**
 * Converts a number to an IPv6 address string
 * Example: 0 -> "0000:0000:0000:0000:0000:0000:0000:0000"
 */
export function numberToIPv6(num: BigNumber): string {
  // Convert to hex and pad to 32 characters (16 bytes)
  const hex = num.toString(16).padStart(32, '0');
  
  // Split into 8 groups of 4 characters
  const segments = hex.match(/.{1,4}/g) || [];
  
  // Join with colons and handle edge cases
  let ipv6 = segments.join(':');
  
  // Compress consecutive zero segments (only the longest run)
  const zeroRegex = /(?:^|:)0(?::0)+(?:$|:)/;
  const match = ipv6.match(zeroRegex);
  if (match) {
    const zeros = match[0];
    const compressed = zeros.length > 3 ? '::' : zeros;
    ipv6 = ipv6.replace(zeros, compressed);
  }
  
  return ipv6;
}

/**
 * Converts an IPv6 address string to a number
 * Example: "::1" -> 1
 */
export function ipv6ToNumber(ip: string): BigNumber {
  // Handle compressed zeros with double colon
  let expandedIP = ip;
  
  if (ip.includes('::')) {
    const parts = ip.split('::');
    if (parts.length !== 2) {
      throw new Error('Invalid IPv6 address: multiple :: found');
    }
    
    const leftParts = parts[0] ? parts[0].split(':') : [];
    const rightParts = parts[1] ? parts[1].split(':') : [];
    const missingCount = 8 - (leftParts.length + rightParts.length);
    
    if (missingCount < 0) {
      throw new Error('Invalid IPv6 address: too many segments');
    }
    
    const middleParts = Array(missingCount).fill('0');
    expandedIP = [...leftParts, ...middleParts, ...rightParts].join(':');
  }

  // Split into segments and pad each to 4 characters
  const finalSegments = expandedIP.split(':').map(seg => seg.padStart(4, '0'));
  
  // Validates segment count
  if (finalSegments.length !== 8) {
    throw new Error('Invalid IPv6 address');
  }

  // Validates each segment is valid hexadecimal
  if (!finalSegments.every(seg => /^[0-9a-fA-F]{1,4}$/.test(seg))) {
    throw new Error('Invalid IPv6 address');
  }

  // Joins all segments and converts from hex to decimal
  const hex = finalSegments.join('');
  return new BigNumber(hex, 16);
}

/**
 * Generates a range of IPv6 addresses
 */
export function* generateIPv6Range(start: BigNumber, count: number): Generator<string> {
  let current = start;
  for (let i = 0; i < count && current.isLessThanOrEqualTo(MAX_IPv6); i++) {
    yield numberToIPv6(current);
    current = current.plus(1);
  }
}

export function normalizeIPv6(ip: string): string {
  // Remove prefix length if present
  ip = ip.split('/')[0].trim();

  // Handle IPv4-mapped addresses (e.g., ::ffff:192.168.1.1)
  if (ip.includes('.')) {
    const lastColon = ip.lastIndexOf(':');
    const ipv4Part = ip.slice(lastColon + 1);
    const ipv4Bytes = ipv4Part.split('.').map(n => parseInt(n, 10));
    
    // Validate IPv4 part
    if (ipv4Bytes.length !== 4 || ipv4Bytes.some(b => isNaN(b) || b < 0 || b > 255)) {
      throw new Error('Invalid IPv4-mapped address');
    }
    
    const hex = ipv4Bytes.map(b => b.toString(16).padStart(2, '0')).join('');
    const ipv6Part = ip.slice(0, lastColon);
    ip = `${ipv6Part}:${hex.slice(0, 4)}:${hex.slice(4)}`;
  }

  // Handle double colon compression
  if (ip.includes('::')) {
    const parts = ip.split('::');
    if (parts.length > 2) throw new Error('Invalid IPv6: multiple :: found');
    
    const left = parts[0] ? parts[0].split(':') : [];
    const right = parts[1] ? parts[1].split(':') : [];
    
    // Validate each part is valid hex
    [...left, ...right].forEach(part => {
      if (part && !/^[0-9a-fA-F]{1,4}$/.test(part)) {
        throw new Error('Invalid IPv6: invalid hex value');
      }
    });
    
    const missing = 8 - (left.length + right.length);
    if (missing < 0) throw new Error('Invalid IPv6: too many segments');
    
    const middle = Array(missing).fill('0');
    ip = [...left, ...middle, ...right].join(':');
  } else {
    // Handle full format or format with some parts omitted
    const parts = ip.split(':');
    if (parts.length !== 8) throw new Error('Invalid IPv6: wrong number of segments');
    
    // Validate each part is valid hex
    parts.forEach(part => {
      if (!/^[0-9a-fA-F]{1,4}$/.test(part)) {
        throw new Error('Invalid IPv6: invalid hex value');
      }
    });
    
    ip = parts.join(':');
  }

  // Normalize each segment to 4 digits
  return ip.split(':')
    .map(s => s.padStart(4, '0'))
    .join(':');
}