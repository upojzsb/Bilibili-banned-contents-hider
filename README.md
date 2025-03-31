# Bilibili-banned-contents-hider

Hide contents from banned users on Bilibili. Bilibili may push content created by blacklisted users, this script is used to remove them.

This JavaScript file can be used in Tampermonkey.

# Range of affected URLs

|Description|URL|Affected Class Name|
|--|--|--|
|Main Page (主页)|https://www.bilibili.com/ or https://www.bilibili.com/?*|.feed-card, .bili-video-card, .bili-video-card.is-rcmd[class="bili-video-card is-rcmd"]|
|Popular (入站必刷)|https://www.bilibili.com/v/popular/history*|.video-card|
|Rank (排行榜)|https://www.bilibili.com/v/popular/rank/all*|.rank-item|
|Video (视频页)|https://www.bilibili.com/video/*|.video-page-operator-card-small, .video-card-ad-small|

# Updates

- V0.3
  Support remove promotion and advertisement contents on **Main Page**;
  
  Support remove advertisement contents on **Video**.

- V0.2

  Support remove contents on **Video**;

  Repeatedly run the script in order to handle AJAX requests.

- V0.1 (2024-01-11)

  Init version, support remove contents on **Main page**, **Popular**, **Rank**.
