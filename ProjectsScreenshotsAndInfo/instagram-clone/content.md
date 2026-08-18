# Instagram Clone

**Stack:** Dart + Flutter (iOS) · Firebase (Auth, Firestore, Storage)

## Summary

A functional Instagram clone built with Flutter and Firebase, covering the core social-app loop end to end: account creation, an authenticated home feed, posting photos from the camera or gallery, liking and commenting, following/unfollowing other users, live user search, and a personal profile grid.

## What it does

- **Auth**: email/password login and signup, with a profile photo picker on registration
- **Feed**: a scrollable home feed of posts from followed users, each with like, comment, and share actions and a live like count
- **Comments**: a dedicated comment thread per post with author, timestamp, and per-comment like
- **Search**: a photo-grid discovery view plus live-filtered user search as you type
- **Profiles**: post count / follower / following counts, a follow/unfollow action on other users' profiles, and a grid of a user's own posts with sign-out on their own profile
- **Posting**: a native action sheet to take a photo or choose from the gallery, followed by a caption/"Post to" screen before publishing

## Technical highlights

- **Firebase as the full backend**: Firebase Auth for identity, Firestore for posts/comments/follow relationships/likes, and Firebase Storage for uploaded photos and profile pictures — no custom server.
- **Real-time data, not static fetches**: follower/following/post counts and the feed reflect live Firestore state rather than one-off REST calls, which is the natural fit for Firestore's snapshot-listener model.
- **Native device integration**: the post-creation flow uses the device camera directly (not just a file picker), which on iOS means handling camera permissions and image capture through Flutter's platform channels.
- **Denormalized social graph**: following/follower counts and relationships are modelled explicitly (visible in the follow/unfollow UI and per-user counts), which in a Firestore app means deliberately choosing a document/collection structure that keeps read costs reasonable as the graph grows, rather than querying relationships naively.

## Screenshots

| File | Shows |
| --- | --- |
| `01-login.jpg` | Login screen |
| `02-signup.jpg` | Sign-up screen with profile photo picker |
| `03-feed.jpg` | Home feed — posts with likes, captions, and comment counts |
| `04-comments.jpg` | Comment thread on a post |
| `05-search-grid.jpg` | Search/discovery photo grid |
| `06-search-autocomplete.jpg` | Live user search-as-you-type |
| `07-user-profile.jpg` | Another user's profile with follow/unfollow |
| `08-create-post.jpg` | Post-creation action sheet (camera / gallery) |
| `09-post-caption.jpg` | Caption entry before publishing a post |
| `10-own-profile.jpg` | Own profile — post grid, stats, sign-out |

*Screenshots captured on a real device/simulator run of the app during development.*
