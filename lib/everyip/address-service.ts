import { POPULAR_SERVICES } from './pop-services';
import { SPECIAL_RANGES } from './special-ranges';
import { ipv6ToNumber, normalizeIPv6 } from './ip-utils';
import BigNumber from 'bignumber.js';

interface AddressInfo {
  type: string;
  description: string;
  isPopularService?: boolean;
  isSpecialRange?: boolean;
  category?: string;
  scope?: string;
}

export class AddressService {
  static getAddressInfo(input: string): AddressInfo | null {
    // Handle special cases first
    const lowerInput = input.toLowerCase();
    switch (lowerInput) {
      case '::1':
      case '0:0:0:0:0:0:0:1':
      case '0000:0000:0000:0000:0000:0000:0000:0001':
        return {
          type: "Localhost",
          description: "Loopback address for the local machine",
          isSpecialRange: true,
          category: "Unicast",
          scope: "Host"
        };
      case '::':
      case '0:0:0:0:0:0:0:0':
      case '0000:0000:0000:0000:0000:0000:0000:0000':
        return {
          type: "Unspecified",
          description: "Address indicating the absence of an address",
          isSpecialRange: true,
          category: "Reserved"
        };
    }

    try {
      const normalizedInput = normalizeIPv6(input);
      
      // Check popular services
      const popularService = POPULAR_SERVICES.find(service => {
        if (normalizeIPv6(service.address) === normalizedInput) return true;
        if (service.alternateFormats?.some(alt => normalizeIPv6(alt) === normalizedInput)) return true;
        return false;
      });

      if (popularService) {
        return {
          type: popularService.type,
          description: popularService.description,
          isPopularService: true
        };
      }

      // Check special ranges
      for (const range of SPECIAL_RANGES) {
        if (range.prefix.endsWith(':')) {
          const normalizedPrefix = normalizeIPv6(range.prefix + '0'.repeat(32))
            .slice(0, range.prefix.length + 1);
          
          if (normalizedInput.startsWith(normalizedPrefix)) {
            return {
              type: range.type,
              description: range.description,
              isSpecialRange: true,
              category: range.category,
              scope: range.scope
            };
          }
        }
      }
    } catch (error) {
      console.error('Error in getAddressInfo:', error);
    }
    
    return null;
  }

  static searchAddress(query: string): BigNumber {
    try {
      // First try to normalize the query as an IPv6 address
      const normalizedQuery = normalizeIPv6(query);
      return ipv6ToNumber(normalizedQuery);
    } catch {
      // If normalization fails, try other formats
      
      // Check if it's a hex-only query (without colons)
      if (query.match(/^[0-9a-fA-F]+$/)) {
        // Pad to 32 characters (128 bits)
        const paddedHex = query.padStart(32, '0');
        // Insert colons every 4 characters
        const parts = paddedHex.match(/.{1,4}/g) || [];
        return ipv6ToNumber(parts.join(':'));
      }
      
      // Check for special addresses
      const lowerQuery = query.toLowerCase();
      switch (lowerQuery) {
        case 'unspecified':
        case 'default':
        case '::':
          return new BigNumber(0);
        case 'loopback':
        case '::1':
          return new BigNumber(1);
        default:
          throw new Error('Invalid IPv6 address format');
      }
    }
  }
}