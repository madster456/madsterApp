import BigNumber from "bignumber.js";

export interface IPv6Info {
    address: string;
    normalizedAddress: string;
    position: BigNumber;
    type?: string;
    description?: string;
    isPopularService?: boolean;
    isSpecialRange?: boolean;
  }
  
  export interface AddressMatch {
    type: string;
    description: string;
    isPopularService?: boolean;
    isSpecialRange?: boolean;
  }