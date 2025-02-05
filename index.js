
import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid"

document.addEventListener('click', function(e){
   if(e.target.dataset.like){
      handleLikeClick(e.target.dataset.like)
   } 
   else if(e.target.dataset.retweet){
      handleRetweetClick(e.target.dataset.retweet)
   }
   else if(e.target.dataset.reply){
      handleReplyClick(e.target.dataset.reply)
   }
   else if(e.target.id === "tweet-btn"){
      handleTweetBtnClick()
   }
   else if(e.target.dataset.post){
      handlePostReplyClick(e.target.dataset.post)
   }
});

function handleLikeClick(tweetId){
   const targetTweetObj = tweetsData.filter(function(tweet){
      return tweet.uuid === tweetId
   })[0]
   
   if(!targetTweetObj.isLiked){
      targetTweetObj.likes++
   } 
   else {
      targetTweetObj.likes--
   }
   targetTweetObj.isLiked = !targetTweetObj.isLiked
   render()
};

function handleRetweetClick(tweetId){
   const targetTweetObj = tweetsData.filter(function(tweet){
      return tweet.uuid === tweetId
   })[0]

   if(!targetTweetObj.isRetweeted){
      targetTweetObj.retweets++
   } 
   else {
      targetTweetObj.retweets --
   }
   targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
   render()
};

function handleReplyClick(replyId){
   document.getElementById(`replies-${replyId}`).classList.toggle("hidden")
   // document.getElementById(`reply-${replyId}`).classList.toggle("hidden")
}

function handleTweetBtnClick(){
   const tweetInput = document.getElementById('tweet-input')

   if(tweetInput.value){
      tweetsData.unshift({
         handle: `@Scrimba`,
         profilePic: `images/scrimbalogo.png`,
         likes: 0,
         retweets: 0,
         tweetText: tweetInput.value,
         replies: [],
         isLiked: false,
         isRetweeted: false,
         uuid: uuidv4()
     })
      render()
      tweetInput.value = ""
   }
}

function handlePostReplyClick(postId){
   // console.log(postId)
   // console.log(document.getElementById(`reply-${postId}`).value)
   const reply = document.getElementById(`reply-${postId}`).value
   const targetTweetObj = tweetsData.filter(function(tweet){
      return tweet.uuid === postId
   })[0]

   targetTweetObj.replies.push(
      {
         handle: `@Scrimba`,
         profilePic: `images/scrimbalogo.png`,
         tweetText: `${reply}`,
      },
   )
   render()
   document.getElementById(`replies-${postId}`).classList.toggle("hidden")
   
   console.log(targetTweetObj)
}

function getFeedHtml(){
   let feedHtml = ""
   tweetsData.forEach(function(tweet){

      let likeIconClass = "";

      if(tweet.isLiked){
         likeIconClass = "liked"
      };

      let retweetIconClass = "";

      if(tweet.isRetweeted){
         retweetIconClass = "retweeted"
      };

      let repliesHtml = '';

      if(tweet.replies.length > 0){
         for(let reply of tweet.replies){
            repliesHtml += 
            `
            <div class="tweet-reply">
               <div class="tweet-inner">
                  <img src="${reply.profilePic}" class="profile-pic">
                        <div>
                           <p class="handle">${reply.handle}</p>
                           <p class="tweet-text">${reply.tweetText}</p>
                        </div>
                  </div>
            </div>`
         }
      };

      feedHtml += `
         <div class="tweet">
            <div class="tweet-inner">
               <img src="${tweet.profilePic}" class="profile-pic">
               <div>
                     <p class="handle">${tweet.handle}</p>
                     <p class="tweet-text">${tweet.tweetText}</p>
                     <div class="tweet-details">
                        <span class="tweet-detail">
                           <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                           ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                           <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                           ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                           <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                           ${tweet.retweets}
                        </span>
                     </div>   
               </div>            
            </div>
            <div class ="hidden" id="replies-${tweet.uuid}">
               ${repliesHtml}
               <div class="reply" >
               <img src="images/scrimbalogo.png" class="profile-pic" alt="">
               <textarea id="reply-${tweet.uuid}" placeholder="Post your reply" class="reply-textarea"></textarea>
            </div>
            <button class="btn-post" data-post="${tweet.uuid}">Post</button>
            </div>
         </div>`
   })
   return feedHtml
};

function render(){
   document.getElementById("feed").innerHTML = getFeedHtml()
};

render();


// 1.Dokończyć dodawanie odpowiedzi do posta

// 2.Zapisywanie tweetów lików itp do localStorage albo baza danych

// 3.Usuwanie własnych postów