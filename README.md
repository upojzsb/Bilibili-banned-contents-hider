# Bilibili-banned-contents-hider

Hide contents from banned users on Bilibili. Bilibili may push content created by blacklisted users, this script is used to remove them.

This JavaScript file can be used in Tampermonkey.

# Range of affected URLs

|Description|URL|Affected Class Name|
|--|--|--|
|Main Page (主页)|https://www.bilibili.com/ or https://www.bilibili.com/?*|.feed-card, .bili-video-card, .bili-video-card.is-rcmd[class="bili-video-card is-rcmd"]|
|Popular (入站必刷)|https://www.bilibili.com/v/popular/history*|.video-card|
|Rank (排行榜)|https://www.bilibili.com/v/popular/rank/all*|.rank-item|
|Video (视频页)|https://www.bilibili.com/video/*|.video-page-operator-card-small, .video-card-ad-small, .video-page-game-card-small|

# Updates

- V0.3
  Support removing promotion and advertisement contents on the **Main Page**;
  
  // Support removing advertisement contents on **Video**.

  // Remove support for **Video** page bacause of kinda bugs.

- V0.2

  Support removing contents on **Video**;

  Repeatedly run the script to handle AJAX requests.

- V0.1 (2024-01-11)

  Initial version, support removing contents on **Main page**, **Popular**, and **Rank**.
