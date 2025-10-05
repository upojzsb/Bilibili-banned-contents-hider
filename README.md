# Bilibili-banned-contents-hider

This script hides content from users on your Bilibili blacklist and removes most promotions and ads. Since Bilibili sometimes pushes content from blacklisted users, this script ensures it gets removed.

Requires a userscript manager (like [Tampermonkey](https://www.tampermonkey.net/)) to run. It uses a local cache to ensure your blocks are always active.

You can install the script from [Greasy Fork](https://greasyfork.org/en/scripts/484601-bilibili-banned-contents-hider).

# Range of affected URLs

|Description|URL|Affected Class Name|
|--|--|--|
|Main Page (主页)|https://www.bilibili.com/ or https://www.bilibili.com/?*|.feed-card, .bili-video-card, .bili-video-card.is-rcmd[class="bili-video-card is-rcmd"]|
|Popular (入站必刷)|https://www.bilibili.com/v/popular/history*|.video-card|
|Rank (排行榜)|https://www.bilibili.com/v/popular/rank/all*|.rank-item|
|Video (视频页)|https://www.bilibili.com/video/*|.video-page-operator-card-small, .video-card-ad-small, .video-page-game-card-small|

# Changelog

- V0.5

  Replaced the periodic scan with a MutationObserver for vastly improved performance.

- V0.4
  
  Added a local blacklist cache for improved reliability when the API is down.

  Fixed critical bugs and improved stability by safely hiding content (set `card.style.display = 'none';`) instead of removing it. 

  Cleaned up the browser console for a better user experience.


- V0.3
  
  Added removal of promotions and ads on the **Main Page**.

  ~~(Support for the **Video** page was temporarily removed due to bugs).~~

- V0.2

  Support removing contents on **Video**;
  
  ~~Repeatedly run the script to handle AJAX requests.~~

- V0.1 (2024-01-11)
  
  Initial version, support removing contents on **Main page**, **Popular**, and **Rank**.