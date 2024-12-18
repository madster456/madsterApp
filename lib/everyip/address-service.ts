/* eslint-disable @typescript-eslint/no-explicit-any */
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
    try {
      const normalizedInput = normalizeIPv6(input);

      // Check popular services first
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
        // Check exact matches first
        if (range.alternateFormats?.some(format => {
          // Remove CIDR notation if present
          const addr = format.split('/')[0];
          return normalizeIPv6(addr) === normalizedInput;
        })) {
          return {
            type: range.type,
            description: range.description,
            isSpecialRange: true,
            category: range.category,
            scope: range.scope
          };
        }

        // Then check prefix matches
        const prefix = range.prefix.endsWith(':') ? range.prefix.slice(0, -1) : range.prefix;
        const normalizedPrefix = normalizeIPv6(prefix + ':0:0:0:0:0:0:0').substring(0, prefix.length + (prefix.length > 0 ? prefix.split(':').length - 1 : 0));
        
        if (normalizedInput.startsWith(normalizedPrefix)) {
          // Special case for unspecified address (::)
          if (range.prefix === '::' && normalizedInput !== '0000:0000:0000:0000:0000:0000:0000:0000') {
            continue;
          }
          
          return {
            type: range.type,
            description: range.description,
            isSpecialRange: true,
            category: range.category,
            scope: range.scope
          };
        }
      }
    } catch (error) {
      console.error('Error in getAddressInfo:', error);
    }

    return null;
  }

  static searchAddress(query: string): BigNumber {
    // Handle empty query
    if (!query) throw new Error('Empty query');

    try {
      // Handle prefix searches (ending with colon)
      if (query.endsWith(':')) {
        // Remove trailing colon and pad the rest with zeros
        const prefix = query.slice(0, -1);
        const segments = prefix.split(':');
        
        // Validate each segment
        segments.forEach(seg => {
          if (seg && !/^[0-9a-fA-F]{1,4}$/.test(seg)) {
            throw new Error('Invalid hex segment');
          }
        });

        // Pad remaining segments with zeros
        while (segments.length < 8) {
          segments.push('0');
        }

        return ipv6ToNumber(segments.join(':'));
      }

      // Handle special keywords
      const lowerQuery = query.toLowerCase();
      switch (lowerQuery) {
        case 'unspecified':
        case 'default':
        case '::':
          return new BigNumber(0);
        case 'loopback':
        case '::1':
          return new BigNumber(1);
      }

      // Handle hex-only queries (without colons)
      if (query.match(/^[0-9a-fA-F]+$/)) {
        const paddedHex = query.padStart(32, '0');
        const parts = paddedHex.match(/.{1,4}/g) || [];
        return ipv6ToNumber(parts.join(':'));
      }

      // Try to normalize as a regular IPv6 address
      const normalizedQuery = normalizeIPv6(query);
      const ipv6Number = ipv6ToNumber(normalizedQuery);
      return ipv6Number;
    } catch (error: any) {
      throw new Error(`Invalid IPv6 address format: ${error.message}`);
    }
  }
}