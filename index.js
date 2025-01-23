
import { tweetsData } from "./data.js";

const tweetInput = document.getElementById('tweet-input');
const tweetBtn = document.getElementById('tweet-btn');

tweetBtn.addEventListener('click', function(){
   console.log(tweetInput.value)
});

function getFeedHtml(){
   let feedHtml = ""
   for (let post of tweetsData){
      feedHtml += `
         <div class="tweet">
            <div class="tweet-inner">
               <img src="${post.profilePic}" class="profile-pic">
               <div>
                     <p class="handle">${post.handle}</p>
                     <p class="tweet-text">${post.tweetText}</p>
                     <div class="tweet-details">
                        <span class="tweet-detail">
                           ${post.replies}
                        </span>
                        <span class="tweet-detail">
                           ${post.likes}
                        </span>
                        <span class="tweet-detail">
                           ${post.retweets}
                        </span>
                     </div>   
               </div>            
            </div>
         </div>`
   }
   console.log(feedHtml)
};

getFeedHtml();