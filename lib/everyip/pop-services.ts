export interface PopularService {
    address: string;
    type: string;
    description: string;
    alternateFormats?: string[];
  }
  
  export const POPULAR_SERVICES: PopularService[] = [
    {
      address: "2404:6800:4008:c07::67",
      alternateFormats: [
        "2404:6800:4008:c07:0:0:0:67",
        "2404:6800:4008:c07:0000:0000:0000:0067"
      ],
      type: "Google",
      description: "Google's main IPv6 address"
    },
    {
      address: "2a03:2880:f003:c07:face:b00c::2",
      alternateFormats: [
        "2a03:2880:f003:c07:face:b00c:0:2",
        "2a03:2880:f003:c07:face:b00c:0000:0002"
      ],
      type: "Facebook",
      description: "Facebook's main IPv6 address"
    },
    {
      address: "2606:4700:4700::1111",
      alternateFormats: [
        "2606:4700:4700:0:0:0:0:1111",
        "2606:4700:4700:0000:0000:0000:0000:1111"
      ],
      type: "Cloudflare",
      description: "Cloudflare DNS (1.1.1.1)"
    },
    {
      address: "2620:fe::fe",
      alternateFormats: [
        "2620:00fe:0:0:0:0:0:00fe",
        "2620:00fe:0000:0000:0000:0000:0000:00fe"
      ],
      type: "Google DNS",
      description: "Google Public DNS (8.8.8.8)"
    },
    {
      address: "2600:1901:0:1::",
      alternateFormats: [
        "2600:1901:0:1:0:0:0:0",
        "2600:1901:0000:0001:0000:0000:0000:0000"
      ],
      type: "Netflix",
      description: "Netflix CDN"
    },
    {
      address: "2a00:1450:4025:401::2a",
      alternateFormats: [
        "2a00:1450:4025:401:0:0:0:2a",
        "2a00:1450:4025:0401:0000:0000:0000:002a"
      ],
      type: "Gmail",
      description: "Gmail servers"
    }
  ];