export type User = {
  fullName: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  guid: string;
  avatar?: string;
  localAvatar?: string;
};

export interface UserProfile {
  email: string,
  firstName: string,
  lastName: string,
  userName: string,
}

export interface UserOnBoarding {
  welcomed?: boolean;
  TacModNotified?: boolean;
  TacModDownloaded?: boolean;
  TacModThanked?: boolean;
}
export type UserResponse = {
  information: User;
  security: {verificationKey: string};
  misc: {
    onboarding: UserOnBoarding;
  };
};
