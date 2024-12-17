export interface SpecialRange {
  prefix: string;
  alternateFormats?: string[];
  type: string;
  description: string;
  category: "Unicast" | "Multicast" | "Anycast" | "Reserved";
  scope?: string;
}

export const SPECIAL_RANGES: SpecialRange[] = [
  {
    prefix: "::1",
    alternateFormats: [
      "0:0:0:0:0:0:0:1",
      "0000:0000:0000:0000:0000:0000:0000:0001"
    ],
    type: "Localhost",
    category: "Unicast",
    scope: "Host",
    description: "Loopback address for the local machine"
  },
  {
    prefix: "::",
    alternateFormats: [
      "0:0:0:0:0:0:0:0",
      "0000:0000:0000:0000:0000:0000:0000:0000"
    ],
    type: "Unspecified",
    category: "Reserved",
    description: "Address indicating the absence of an address"
  },
  {
    prefix: "fe80:",
    alternateFormats: ["fe80:0000:0000:0000::/64"],
    type: "Link-local",
    category: "Unicast",
    scope: "Link",
    description: "Addresses for communication within a local network segment"
  },
  {
    prefix: "ff00:",
    alternateFormats: ["ff00::/8"],
    type: "Multicast",
    category: "Multicast",
    description: "Used for sending packets to multiple destinations"
  },
  {
    prefix: "2001:db8:",
    alternateFormats: ["2001:0db8::/32"],
    type: "Documentation",
    category: "Reserved",
    description: "Reserved for use in documentation and example code"
  },
  {
    prefix: "2001:",
    alternateFormats: ["2001::/32"],
    type: "Teredo",
    category: "Unicast",
    description: "Used for IPv6 tunneling through IPv4 networks"
  },
  {
    prefix: "2002:",
    alternateFormats: ["2002::/16"],
    type: "6to4",
    category: "Unicast",
    description: "Addresses for 6to4 transition mechanism"
  },
  {
    prefix: "fc00:",
    alternateFormats: ["fc00::/7"],
    type: "Unique Local",
    category: "Unicast",
    scope: "Global",
    description: "Addresses for local communications within a site"
  },
  {
    prefix: "::ffff:",
    alternateFormats: ["::ffff:0:0/96"],
    type: "IPv4-mapped",
    category: "Reserved",
    description: "Represents IPv4 addresses in IPv6 format"
  }
];