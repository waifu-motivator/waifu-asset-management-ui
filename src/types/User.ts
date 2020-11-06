export interface UserProfile {
  id: string,
  username: string,
  attributes: {
    sub: string,
    email_verified: true,
    given_name: string,
    family_name: string,
    email: string,
    picture: string
  }
}
