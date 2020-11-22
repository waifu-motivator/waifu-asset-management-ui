<p align="center"><img style="max-width: 150px; max-height: 150px; object-fit: contain" src="https://media1.tenor.com/images/0dae54a91ebefe6dcd0dd2250ffb4aa7/tenor.gif?itemid=16026778" height="424px" alt="Waifu Motivator Plugin Logo"></p>


# Waifu Asset Management UI

A convenient administration dashboard that makes viewing, uploading, and editing the [Waifu Motivator Plugin's](https://github.com/waifu-motivator/waifu-motivator-plugin) assets.

## Usage

Whenever you make any changes to any of the assets, a `Sync Changes` button will appear in the bottom right-hand corner of the application.
The application works by keeping thing cached locally. 
If you where to refresh your browser before syncing your changes, you will lose any changes not synced to the appropriate bucket.

That being said, you are free to navigate to other areas of the application using the navigation side bar.
Such as if you need to add a new waifu definition, after you have dropped in a bunch of new assets.

**Roles**

Any authenticated user has the ability to view all the assets available!
However, only users in the `Admin` group have the ability to create, update, and delete assets.

At the moment you have the ability to:

- [View all assets](https://waifu-management.unthrottled.io/)
- [Edit Asset](https://waifu-management.unthrottled.io/assets/view/185cb47ce6b0e5157d3bb7b66b79e35a)
- [Upload Assets](https://waifu-management.unthrottled.io/asset/upload)
- [Categorize Assets](https://waifu-management.unthrottled.io/character/definition)

### Asset Categorization

[Asset categorization](https://waifu-management.unthrottled.io/character/definition) enables us to define and group Waifu by the anime they appear in.
If you want to tag a waifu in an asset, you'll have to create her definition inside the anime she appears in.

### Edit Assets

[Editing an asset](https://waifu-management.unthrottled.io/assets/view/185cb47ce6b0e5157d3bb7b66b79e35a) allows you to:

- Define character tags.
- What kind of asset categories it belongs to
- Add/update/remove any related assets
- Add/Update the image alt.

You will **not** be able to change the image path after an asset has been uploaded.

## Local Development

To avoid breaking things for our users, we have a `non-prod` env `https://waifu-motivation-assets-nonprod.s3.amazonaws.com`.
Assets will be uploaded to that bucket.

## AWS Amplify 

This application uses the [AWS Amplify](https://aws.amazon.com/amplify/) platform.

**Handy commands**
`npm install -g @aws-amplify/cli`
`amplify pull`

> Note: this is only needed if any of the platform needs to be updated. It is not required to do local development.

**Handy links**

- https://docs.amplify.aws/lib/auth/social/q/platform/js
- https://aws.amazon.com/blogs/mobile/building-fine-grained-authorization-using-amazon-cognito-user-pools-groups/
- https://stackoverflow.com/questions/44043289/aws-invalid-identity-pool-configuration-check-assigned-iam-roles-for-this-poo
