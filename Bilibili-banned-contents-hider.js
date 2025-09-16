// ==UserScript==
// @name         Bilibili-banned-contents-hider
// @name:zh-CN   移除Bilibili黑名单用户的创作内容
// @namespace    https://github.com/upojzsb/Bilibili-banned-contents-hider
// @version      V0.3.5
// @description  Hide banned users' contents on Bilibili. Bilibili may push content created by users from your blacklist. This script is used to remove those contents. Promotions and advertisements will also be removed
// @description:zh-CN 隐藏Bilibili黑名单用户的内容。Bilibiil可能会推送黑名单用户创作的内容，该脚本旨在移除这些内容，广告及推广内容也将被移除
// @author       UPO-JZSB
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @license      GPL-3.0
// ==/UserScript==

'use strict';
async function runScript(){
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
    var baseUrl = "https://api.bilibili.com/x/relation/blacks?re_version=0&pn=1&ps=20&jsonp=jsonp";
    var totalBannedUserNumber;
    const blacklist = [];
    const blacklistName = [];

    // Get the total number of banned users
    const jsonData = await fetchDataJson(baseUrl);
    if (jsonData.code !== undefined && jsonData.code !== 0) {
      throw new Error(`Error code: ${jsonData.code}, Message: ${jsonData.message}`);
    }

    if (jsonData.data && jsonData.data.total !== undefined) { // Check if the 'total' property exists in the 'data' object
      totalBannedUserNumber = jsonData.data.total;
    }

    // Count how total page number
    var totalPageNumber = Math.ceil(totalBannedUserNumber / 20);

    // Get infos page by page
    for (let i = 1; i <= totalPageNumber; i++) { // i belongs to 1->totalPageNumber, both are included
      var url = `https://api.bilibili.com/x/relation/blacks?re_version=0&pn=${i}&ps=20&jsonp=jsonp`;
      const jsonData = await fetchDataJson(url);

      // For loop in each banned user item
      const itemList = jsonData.data.list

      for (const item of itemList) {
        blacklist.push(item.mid);
        blacklistName.push(item.uname);
      }
    }

    return {
      mid: blacklist,
      name: blacklistName
    };
  }

  // use GET method to get a json from given API
  async function fetchDataJson(url) {
    try {
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
        throw new Error(`Error code: ${jsonData.code}, Message: ${jsonData.message}`);
      }

      return jsonData;
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }

  // Remove promotion and advertisements
  async function advertisementDelete() {
    const currentUrl = window.location.href;

    if (currentUrl.startsWith('https://www.bilibili.com/')) {

      if (currentUrl === 'https://www.bilibili.com/' || currentUrl.startsWith('https://www.bilibili.com/?')) { // On the main page
        // Remove promotional videos
        const ad_cards = document.querySelectorAll('.bili-video-card.is-rcmd[class="bili-video-card is-rcmd"]');

        console.log('Advertisement cards found:', ad_cards);
        ad_cards.forEach((card)=>{
          card.remove();
        });
      } /*else if (currentUrl.startsWith('https://www.bilibili.com/video/')) { // On the video page

        // Remove ad
        const ad_cards = document.querySelectorAll('.video-card-ad-small, .video-page-game-card-small');

        console.log('Advertisement cards found:', ad_cards);
        ad_cards.forEach((card)=>{
          card.remove();
        });
      }*/ else { // URL not yet implemented

      }
    }
  }


  // Since the progress of loading the blacklist is slow, we can perform the pre-delete ads here
  await advertisementDelete();
  
  // This script would run every interval milliseconds to handle the AJAX request
  var interval = 1000;

  // Get the blacklist
  const blacklist = await getBlacklist();
  const blacklistMid = blacklist.mid;
  const blacklistName = blacklist.name;
  console.log('Get blacklist successfully, blacklist=', blacklistMid);

  // Run every interval milliseconds
  window.setInterval(async () => {

    const currentUrl = window.location.href;

    // Delete the advertisement cards in advance
    await advertisementDelete();

    // Prefix judgement
    if (currentUrl.startsWith('https://www.bilibili.com/')) {

      if (currentUrl === 'https://www.bilibili.com/' || currentUrl.startsWith('https://www.bilibili.com/?')) { // On the main page

        const cards = document.querySelectorAll('.feed-card, .bili-video-card');

        console.log('Cards found: ', cards);

        // Remove feed cards with banned user
        cards.forEach((card) => {
          const content = card.textContent || card.innerText;

          // Check if the content includes any banned user ID
          if (blacklistMid.some((userId) => content.includes(userId.toString()))) {
            console.log('Removing: ', card);
            card.remove();
          }
        });

      } else if (currentUrl.startsWith('https://www.bilibili.com/v/popular/history')) {

        const cards = document.querySelectorAll('.up-name');


        console.log(currentUrl);
        console.log('Cards found: ', cards);

        // Remove feed cards with banned users. No mid is displayed in the HTML, so use the user name instead
        cards.forEach((card) => {
          const content = card.textContent || card.innerText;

          // Check if the content includes any banned user name
          if (blacklistName.some((userId) => content.includes(userId.toString()))) {
            const cardToBeRemoved = returnNthParent(card, 3);
            console.log('Removing: ', cardToBeRemoved);
            cardToBeRemoved.remove();
          }
        });

      } else if (currentUrl.startsWith('https://www.bilibili.com/v/popular/rank/all')) {

        const cards = document.querySelectorAll('.up-name');


        console.log(currentUrl);
        console.log('Cards found: ', cards);

        // Remove feed cards with banned users. No mid is displayed in the HTML, so use the user name instead
        cards.forEach((card) => {
          const content = card.textContent || card.innerText;

          // Check if the content includes any banned user name
          if (blacklistName.some((userId) => content.includes(userId.toString()))) {
            const cardToBeRemoved = returnNthParent(card, 5);

            console.log('Removing: ', cardToBeRemoved);
            cardToBeRemoved.remove();
          }
        });       

      } else if (currentUrl.startsWith('https://www.bilibili.com/video/')) {
        const cards = document.querySelectorAll('.upname');

        console.log(currentUrl);
        console.log('Cards found: ', cards);

        // Remove feed cards with banned users. No mid is displayed in the HTML, so use the user name instead
        cards.forEach((card) => {
          const content = card.textContent || card.innerText;

          // Check if the content includes any banned user name
          if (blacklistName.some((userId) => content.includes(userId.toString()))) {
            const cardToBeRemoved = returnNthParent(card, 3);

            console.log('Removing: ', cardToBeRemoved);
            cardToBeRemoved.remove();
          }
        });

      } else { // URL not yet implemented
        console.log('Contents hiding not implemented on ', currentUrl);
        console.log('Please post the information as an issue on https://github.com/upojzsb/Bilibili-banned-contents-hider');
      }
    } else { // Url not start with ('https://www.bilibili.com/')
      console.log('Bilibili-banned-contents-hider may not run here: ', currentUrl);
    }

  }, interval);
}

runScript();
