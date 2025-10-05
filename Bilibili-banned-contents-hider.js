// ==UserScript==
// @name         Bilibili-banned-contents-hider
// @name:zh-CN   移除Bilibili黑名单用户的创作内容
// @namespace    https://github.com/upojzsb/Bilibili-banned-contents-hider
// @version      V0.5.0
// @description  Hide banned users' contents on Bilibili. Bilibili may push content created by users from your blacklist. This script is used to remove those contents. Promotions and advertisements will also be removed
// @description:zh-CN 隐藏Bilibili黑名单用户的内容。Bilibiil可能会推送黑名单用户创作的内容，该脚本旨在移除这些内容，广告及推广内容也将被移除
// @author       UPO-JZSB
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @license      GPL-3.0
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

'use strict';
async function runScript() {
  // Return its n-th parentNode
  function returnNthParent(card, n) {
    if (n === 0) {
      return card;
    } else {
      return returnNthParent(card.parentNode, n - 1);
    }
  }

  // Get the blacklist with mid and name
  async function getBlacklist() {
    const CACHE_KEY = 'bilibili_blacklist_cache'; // Define a key for our storage

    try {
      // Step 1: Try to fetch from Bilibili API
      console.debug('Attempting to fetch latest blacklist from Bilibili...');

      // Since the total number of banned users appears in the first page of the API response, we fetch it first to calculate how many pages we need to fetch Each page contains 20 users
      const baseUrl = "https://api.bilibili.com/x/relation/blacks?re_version=0&pn=1&ps=20&jsonp=jsonp";
      let jsonData = await fetchDataJson(baseUrl);

      const blacklist = [];
      const blacklistName = [];

      const totalBannedUserNumber = jsonData.data.total;
      const totalPageNumber = Math.ceil(totalBannedUserNumber / 20);

      for (let i = 1; i <= totalPageNumber; i++) {
        const url = `https://api.bilibili.com/x/relation/blacks?re_version=0&pn=${i}&ps=20&jsonp=jsonp`;
        jsonData = await fetchDataJson(url);
        const itemList = jsonData.data.list;
        for (const item of itemList) {
          blacklist.push(item.mid);
          blacklistName.push(item.uname);
        }
      }

      const freshBlacklist = { mid: blacklist, name: blacklistName };

      // Step 2: Fetch successful, update local data
      console.debug('Successfully fetched blacklist. Updating local cache.');
      await GM_setValue(CACHE_KEY, freshBlacklist); // Save the fresh data

      return freshBlacklist;
    } catch (error) { // Fetch failed, use local data instead
      console.warn(`Could not fetch blacklist from Bilibili: ${error.message}`);
      console.debug('Falling back to locally stored blacklist cache.');

      // Retrieve the cached data. If it doesn't exist, default to empty lists.
      const cachedBlacklist = await GM_getValue(CACHE_KEY, { mid: [], name: [] });

      if (cachedBlacklist.mid.length > 0) {
        console.debug(`Successfully loaded ${cachedBlacklist.mid.length} users from cache.`);
      } else {
        console.warn('No cached blacklist found. Hiding will not be active.');
      }

      return cachedBlacklist;
    }
  }

  // use GET method to get a json from given API
  async function fetchDataJson(url) {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include', // Include credentials (cookies) in the request
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'DNT': '1',
        'Origin': 'https://account.bilibili.com',
        'Referer': 'https://account.bilibili.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const jsonData = await response.json();

    if (jsonData.code !== undefined && jsonData.code !== 0) {
      throw new Error(`Bilibili API Error! Code: ${jsonData.code}, Message: ${jsonData.message}`);
    }

    return jsonData;
  }

  // Remove promotion and advertisements
  function advertisementDelete() {
    const currentUrl = window.location.href;

    if (currentUrl.startsWith('https://www.bilibili.com/')) {

      if (currentUrl === 'https://www.bilibili.com/' || currentUrl.startsWith('https://www.bilibili.com/?')) { // On the main page
        // Remove promotional videos
        const ad_cards = document.querySelectorAll('.bili-video-card.is-rcmd[class="bili-video-card is-rcmd"]');

        console.debug('Advertisement cards found:', ad_cards);
        ad_cards.forEach((card) => {
          card.style.display = 'none'; 
        });
      } else if (currentUrl.startsWith('https://www.bilibili.com/video/')) { // On the video page

        // Remove ad
        const ad_cards = document.querySelectorAll('.video-card-ad-small, .video-page-game-card-small');

        console.debug('Advertisement cards found:', ad_cards);
        ad_cards.forEach((card)=>{
          // Simply remove it will cause race condition problem
          card.style.display = 'none';
        });
      } else { // URL not yet implemented

      }
    }
  }

  // Remove contents created by banned users
  function hideBlacklistedContent() {
    const currentUrl = window.location.href;

    // Prefix judgement
    if (currentUrl.startsWith('https://www.bilibili.com/')) {

      if (currentUrl === 'https://www.bilibili.com/' || currentUrl.startsWith('https://www.bilibili.com/?')) { // On the main page

        const cards = document.querySelectorAll('.feed-card, .bili-video-card');

        console.debug('Cards found: ', cards);

        // Remove feed cards with banned users
        cards.forEach((card) => {
          const content = card.textContent || card.innerText;

          // Check if the content includes any banned user ID
          if (blacklistMid.some((userId) => content.includes(userId.toString()))) {
            console.debug('Removing: ', card);
            card.style.display = 'none'; 
          }
        });

      } else if (currentUrl.startsWith('https://www.bilibili.com/v/popular/history')) {

        const cards = document.querySelectorAll('.up-name');


        console.debug(currentUrl);
        console.debug('Cards found: ', cards);

        // Remove feed cards with banned users. No mid is displayed in the HTML, so use the user name instead
        cards.forEach((card) => {
          const content = card.textContent || card.innerText;

          // Check if the content includes any banned user name
          if (blacklistName.some((userId) => content.includes(userId.toString()))) {
            const cardToBeRemoved = returnNthParent(card, 3);
            console.debug('Removing: ', cardToBeRemoved);
            cardToBeRemoved.style.display = 'none'; 
          }
        });

      } else if (currentUrl.startsWith('https://www.bilibili.com/v/popular/rank/all')) {

        const cards = document.querySelectorAll('.up-name');


        console.debug(currentUrl);
        console.debug('Cards found: ', cards);

        // Remove feed cards with banned users. No mid is displayed in the HTML, so use the user name instead
        cards.forEach((card) => {
          const content = card.textContent || card.innerText;

          // Check if the content includes any banned user name
          if (blacklistName.some((userId) => content.includes(userId.toString()))) {
            const cardToBeRemoved = returnNthParent(card, 5);

            console.debug('Removing: ', cardToBeRemoved);
            cardToBeRemoved.style.display = 'none';
          }
        });

      } else if (currentUrl.startsWith('https://www.bilibili.com/video/')) {
        const cards = document.querySelectorAll('.upname');

        console.debug(currentUrl);
        console.debug('Cards found: ', cards);

        // Remove feed cards with banned users. No mid is displayed in the HTML, so use the user name instead
        cards.forEach((card) => {
          const content = card.textContent || card.innerText;

          // Check if the content includes any banned user name
          if (blacklistName.some((userId) => content.includes(userId.toString()))) {
            const cardToBeRemoved = returnNthParent(card, 3);

            console.debug('Removing: ', cardToBeRemoved);
            cardToBeRemoved.style.display = 'none';
          }
        });

      } else { // URL not yet implemented
        if (currentUrl !== lastWarnedUrl) {
          console.warn('Contents hiding not implemented on ', currentUrl);
          console.warn('Please post the information as an issue on https://github.com/upojzsb/Bilibili-banned-contents-hider');
          lastWarnedUrl = currentUrl;
        }
      }
    } else { // Url not start with ('https://www.bilibili.com/')
      if (currentUrl !== lastWarnedUrl) {
        console.warn('Bilibili-banned-contents-hider may not run here: ', currentUrl);
        lastWarnedUrl = currentUrl;
      }
    }
  }

  // The entry-point function that runs all scanning logic.
  function runFullScan() {
    advertisementDelete();
    hideBlacklistedContent();
  }

  // Get the blacklist
  const blacklist = await getBlacklist();
  const blacklistMid = blacklist.mid;
  const blacklistName = blacklist.name;
  console.debug('Get blacklist successfully, blacklist=', blacklistMid);

  // A flag to prevent repeated warnings for the same URL.
  let lastWarnedUrl = ''; 

  // Run the main hiding function once on initial load.
  runFullScan();

  // Set up the MutationObserver to handle dynamically loaded content.
  let debounceTimer;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runFullScan, 250);
  });

  // Start watching the entire page for any changes to the element list.
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

}

runScript();
