import awsExports from "../aws-exports";

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === "[::1]" ||
  // 127.0.0.1/8 is considered localhost for IPv4.
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

// Assuming you have two redirect URIs, and the first is for localhost and second is for production
const [
  productionRedirectSignIn,
  localRedirectSignIn,
] = awsExports.oauth.redirectSignIn.split(",");

const [
  productionRedirectSignOut,
  localRedirectSignOut,
] = awsExports.oauth.redirectSignOut.split(",");

export const AWSConfig = {
  ...awsExports,
  oauth: {
    ...awsExports.oauth,
    domain: 'waifu-management.auth.unthrottled.io',
    redirectSignIn: isLocalhost ? localRedirectSignIn : productionRedirectSignIn,
    redirectSignOut: isLocalhost ? localRedirectSignOut : productionRedirectSignOut,
  },
  Storage: {
    AWSS3: {
      bucket: `waifu-motivation-assets${isLocalhost ? '-nonprod' : ''}`,
      region: 'us-east-1',
    },
    customPrefix: {
      public: ''
    }
  }
}
