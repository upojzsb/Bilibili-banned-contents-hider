// ==UserScript==
// @name         Bilibili-banned-contents-hider
// @namespace    https://github.com/upojzsb/Bilibili-banned-contents-hider
// @version      V0.2.1
// @description  Hide banned users's contents on Bilibili. Bilibili may push contents created from the users in your blacklist, this script is used to remove those contents.
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


  // This script would run every interval miliseconds in order to handle the AJAX request
  var interval = 3000;

  // Get the blacklist
  const blacklist = await getBlacklist();
  const blacklistMid = blacklist.mid;
  const blacklistName = blacklist.name;
  console.log('Get blacklist successfully, blacklist=', blacklistMid);


  // Run every interval milliseconds
  window.setInterval(async () => {

    const currentUrl = window.location.href;

    if (currentUrl.startsWith('https://www.bilibili.com/')) {

      if (currentUrl === 'https://www.bilibili.com/' || currentUrl.startsWith('https://www.bilibili.com/?')) { // On the main page

        const cards = document.querySelectorAll('.feed-card, .bili-video-card');
        // const cards = document.querySelectorAll('.bili-video-card__info--bottom');

        console.log('Cards found: ', cards);

        // Remove feed cards with banned users
        cards.forEach((card) => {
          const content = card.textContent || card.innerText;

          // Check if the content includes any banned user ID
          if (blacklistMid.some((userId) => content.includes(userId.toString()))) {
            console.log('Removing: ', card);
            card.remove();
            // card.parentNode.parentNode.parentNode.parentNode.remove();
          }
        });

      } else if (currentUrl.startsWith('https://www.bilibili.com/v/popular/history')) {

        // const cards = document.querySelectorAll('.video-card');
        const cards = document.querySelectorAll('.up-name');


        console.log(currentUrl);
        console.log('Cards found: ', cards);

        // Remove feed cards with banned users, No mid is displayed in the html, so use user name instead
        cards.forEach((card) => {
          const content = card.textContent || card.innerText;

          // Check if the content includes any banned user name
          if (blacklistName.some((userId) => content.includes(userId.toString()))) {
            const cardToBeRemoved = returnNthParent(card, 3);
            //console.log('Removing: ', card.parentNode.parentNode.parentNode);
            console.log('Removing: ', cardToBeRemoved);
            // card.remove();
            // card.parentNode.parentNode.parentNode.remove();
            cardToBeRemoved.remove();
          }
        });

      } else if (currentUrl.startsWith('https://www.bilibili.com/v/popular/rank/all')) {

        // const cards = document.querySelectorAll('.video-card');
        const cards = document.querySelectorAll('.up-name');


        console.log(currentUrl);
        console.log('Cards found: ', cards);

        // Remove feed cards with banned users, No mid is displayed in the html, so use user name instead
        cards.forEach((card) => {
          const content = card.textContent || card.innerText;

          // Check if the content includes any banned user name
          if (blacklistName.some((userId) => content.includes(userId.toString()))) {
            const cardToBeRemoved = returnNthParent(card, 5);

            // console.log('Removing: ', card.parentNode.parentNode.parentNode.parentNode.parentNode);
            console.log('Removing: ', cardToBeRemoved);
            // card.remove();
            cardToBeRemoved.remove();
          }
        });

      } else if (currentUrl.startsWith('https://www.bilibili.com/video/')) {
        const cards = document.querySelectorAll('.upname');

        console.log(currentUrl);
        console.log('Cards found: ', cards);

        // Remove feed cards with banned users, No mid is displayed in the html, so use user name instead
        cards.forEach((card) => {
          const content = card.textContent || card.innerText;

          // Check if the content includes any banned user name
          if (blacklistName.some((userId) => content.includes(userId.toString()))) {
            const cardToBeRemoved = returnNthParent(card, 3);

            // console.log('Removing: ', card.parentNode.parentNode.parentNode);
            console.log('Removing: ', cardToBeRemoved);
            // card.remove();
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
