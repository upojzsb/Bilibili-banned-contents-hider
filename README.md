# Bilibili-banned-contents-hider
 Hide content from banned users on Bilibili. Bilibili may push content created by blacklisted users, this script is used to remove them.


This JavaScript file can be used in Tampermonkey.

## Range of affected URLs

|Description|URL|Affected Class Name|
|--|--|--|
|Main page (主页)|https://www.bilibili.com/|.feed-card, .bili-video-card|
|Popular (入站必刷)|https://www.bilibili.com/v/popular/history|.video-card|
|Rank (排行榜)|https://www.bilibili.com/v/popular/rank/all|.rank-item|
