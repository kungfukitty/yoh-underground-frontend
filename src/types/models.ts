export type UserDoc = {
  email: string;
  displayName: string;
  isInvited: boolean;
  inviteCode?: string;
  isNDAAccepted: boolean;
  ndaAcceptedAt?: any;
  ndaVersion?: string;
  ndaHash?: string;
  ndaPdfUrl?: string;
  createdAt?: any;
  lastLoginAt?: any;
};

export type EventDoc = {
  title: string;
  date: any;
  venue: string;
  coverUrl?: string;
  tags?: string[];
  capacity?: number;
  visibility: "public" | "members" | "admin";
  createdAt?: any;
  updatedAt?: any;
};

export type NetworkProfile = {
  uid: string;
  headline: string;
  skills: string[];
  location?: string;
  isVisible: boolean;
  socials?: Record<string, string>;
};

export type ResourceDoc = {
  title: string;
  type: "Link" | "Download";
  url: string;
  createdAt?: any;
};
