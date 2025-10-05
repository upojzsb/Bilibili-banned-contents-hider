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
|Video (视频页)|https://www.bilibili.com/video/*|.video-card-ad-small, .video-page-game-card-small, .video-page-special-card-small|

# Changelog

For a detailed list of changes, please see the [CHANGELOG.md](CHANGELOG.md) file.
