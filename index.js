
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
   else if(e.target.dataset.delete){
      handleDeletePostClick(e.target.dataset.delete)
   }
   else if(e.target.dataset.deletereply){
      handleDeleteReplyClick(e.target.dataset.deletereply)
   }
});

let tweetsLocalStorage = JSON.parse(localStorage.getItem("tweets"))

function setLocalStorage(){
   if(tweetsLocalStorage){
      localStorage.setItem("tweets", JSON.stringify(tweetsLocalStorage));
   } 
   else {
      localStorage.setItem("tweets", JSON.stringify(tweetsData));
   }
   
}

window.onload = setLocalStorage()



function handleLikeClick(tweetId){
   const targetTweetObj = tweetsLocalStorage.filter(function(tweet){
      return tweet.uuid === tweetId
   })[0]
   
   if(!targetTweetObj.isLiked){
      targetTweetObj.likes++
   } 
   else {
      targetTweetObj.likes--
   }
   targetTweetObj.isLiked = !targetTweetObj.isLiked
   setLocalStorage()
   render()
};

function handleRetweetClick(tweetId){
   const targetTweetObj = tweetsLocalStorage.filter(function(tweet){
      return tweet.uuid === tweetId
   })[0]

   if(!targetTweetObj.isRetweeted){
      targetTweetObj.retweets++
   } 
   else {
      targetTweetObj.retweets --
   }
   targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
   setLocalStorage()
   render()
};

function handleReplyClick(replyId){
   document.getElementById(`replies-${replyId}`).classList.toggle("hidden")
}

function handleTweetBtnClick(){
   const tweetInput = document.getElementById('tweet-input')

   if(tweetInput.value){
      tweetsLocalStorage.unshift({
         handle: `@Scrimba`,
         profilePic: `images/scrimbalogo.png`,
         likes: 0,
         retweets: 0,
         tweetText: tweetInput.value,
         replies: [],
         isLiked: false,
         isRetweeted: false,
         isPostDeleteAble: true,
         uuid: uuidv4()
     })
      render()
      setLocalStorage()
      tweetInput.value = ""
   }
}

function handlePostReplyClick(postId){
   const reply = document.getElementById(`reply-${postId}`).value
   const targetTweetObj = tweetsLocalStorage.filter(function(tweet){
      return tweet.uuid === postId
   })[0]
   
   if(reply){
      targetTweetObj.replies.push(
         {
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: `${reply}`,
            isReplyDeleteAble: true
         },
      )
      render()
      setLocalStorage()
      document.getElementById(`replies-${postId}`).classList.toggle("hidden")
   }
}

function handleDeletePostClick(postId){
   const index = tweetsLocalStorage.findIndex(tweet => tweet.uuid === postId)
   
   if(index !== -1){
      tweetsLocalStorage.splice(index,1);
      console.log("Tweet deleted")
   }
   else{
      console.log("Tweet not found")
   }
   setLocalStorage()
   render()
}

function handleDeleteReplyClick(postId){
   const targetTweetObj = tweetsLocalStorage.filter(function(tweet){
      return tweet.uuid === postId
   })[0]

   const replyIndex = targetTweetObj.replies.findIndex(reply => reply.isReplyDeleteAble === true)
   if(replyIndex !== 1){
      targetTweetObj.replies.splice(replyIndex, 1)
      console.log("Reply deleted")
   }
   else{
      console.log("Reply not found")
   }
   setLocalStorage()
   render()
}

function getFeedHtml(){
   let feedHtml = ""
   tweetsLocalStorage.forEach(function(tweet){

      let likeIconClass = "";

      if(tweet.isLiked){
         likeIconClass = "liked"
      };

      let retweetIconClass = "";

      if(tweet.isRetweeted){
         retweetIconClass = "retweeted"
      };

      let repliesHtml = "";

      if(tweet.replies.length > 0){
         for(let reply of tweet.replies){
            
            let deleteReplyBtn = ""

            if(reply.isReplyDeleteAble === true){
               deleteReplyBtn = `<button class="btn-delete" data-deletereply="${tweet.uuid}">Delete</button>`
            }
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
                  ${deleteReplyBtn}
            </div>`
         }
      };

      let deletePostBtn = "";

      if(tweet.isPostDeleteAble){
         deletePostBtn = `<button class="btn-delete" data-delete="${tweet.uuid}">Delete</button>`
      }

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
                     ${deletePostBtn}
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
// localStorage.clear();

console.log(tweetsLocalStorage)


// 1.Dokończyć dodawanie odpowiedzi do posta X

// 2.Zapisywanie tweetów lików itp do localStorage albo baza danych X

// 3.Usuwanie własnych postów