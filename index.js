import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyANkHgs9DCLDfAxJed-hEahDHbNc_VKaaE",
  authDomain: "twimba-twitter-clone.firebaseapp.com",
  databaseURL:
    "https://twimba-twitter-clone-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "twimba-twitter-clone",
  storageBucket: "twimba-twitter-clone.firebasestorage.app",
  messagingSenderId: "468782685298",
  appId: "1:468782685298:web:213aae8967a629278cb6eb",
  measurementId: "G-Y0D9FZWGW3",
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let tweetsData = []; // Przechowywanie tweetów w tablicy

// Funkcja pobierająca tweet z Firebase i renderująca je w odwrotnej kolejności
function fetchTweetsFromFirebase() {
   const tweetsRef = ref(database, "tweets/");
 
   get(tweetsRef)
     .then((snapshot) => {
       if (snapshot.exists()) {
         const fetchedTweetsData = snapshot.val(); // Odczytanie danych z Firebase
         console.log("Pobrane dane z Firebase: ", fetchedTweetsData);
 
         // Konwersja danych do formatu tablicy, odwrócenie kolejności
         tweetsData = Object.values(fetchedTweetsData).reverse();
         console.log("Przekształcone dane: ", tweetsData);
 
         // Dodajemy kontrolę, aby upewnić się, że każdy tweet ma właściwość "replies" jako tablicę
         tweetsData.forEach(function (tweet) {
           if (!Array.isArray(tweet.replies)) {
             tweet.replies = []; // Jeśli "replies" nie istnieje lub nie jest tablicą, ustawiamy ją na pustą tablicę
           }
         });
 
         render(); // Funkcja renderująca, która aktualizuje wyświetlanie na stronie
       } else {
         console.log("Brak danych w Firebase");
       }
     })
     .catch((error) => {
       console.error("Błąd podczas pobierania danych z Firebase: ", error);
     });
 }

// Funkcja zapisująca nowy tweet do Firebase
function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    const newTweet = {
      handle: "@Scrimba",
      profilePic: "images/scrimbalogo.png",
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    };

    // Zapisanie tweetu do Firebase
    const tweetsRef = ref(database, "tweets");
    push(tweetsRef, newTweet)
      .then(() => {
        console.log("Tweet został zapisany w Firebase!");
        tweetInput.value = ""; // Czyszczenie inputu
      })
      .catch((error) => {
        console.error("Błąd podczas zapisywania tweetu w Firebase:", error);
      });
  }
}

// Funkcja renderująca wszystkie tweety na stronie
function getFeedHtml() {
   let feedHtml = "";
 
   // Sprawdzamy, czy tweetsData jest tablicą
   if (Array.isArray(tweetsData)) {
     tweetsData.forEach(function (tweet) {
       let likeIconClass = "";
       if (tweet.isLiked) {
         likeIconClass = "liked";
       }
 
       let retweetIconClass = "";
       if (tweet.isRetweeted) {
         retweetIconClass = "retweeted";
       }
 
       let repliesHtml = "";
 
       // Sprawdzamy, czy tweet ma właściwość 'replies' i czy jest to tablica
       if (Array.isArray(tweet.replies)) {
         tweet.replies.forEach(function (reply) {
           repliesHtml += `
             <div class="tweet-reply">
               <div class="tweet-inner">
                 <img src="${reply.profilePic}" class="profile-pic">
                 <div>
                   <p class="handle">${reply.handle}</p>
                   <p class="tweet-text">${reply.tweetText}</p>
                 </div>
               </div>
             </div>`;
         });
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
                   ${tweet.replies ? tweet.replies.length : 0}
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
           <div class="hidden" id="replies-${tweet.uuid}">
             ${repliesHtml}
             <div class="reply">
               <img src="images/scrimbalogo.png" class="profile-pic" alt="">
               <textarea id="reply-${tweet.uuid}" placeholder="Post your reply" class="reply-textarea"></textarea>
             </div>
             <button class="btn-post" data-post="${tweet.uuid}">Post</button>
           </div>
         </div>`;
     });
   } else {
     console.log("tweetsData nie jest tablicą:", tweetsData);
   }
 
   return feedHtml;
 }

// Funkcja renderująca feed na stronie
function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
  
  // Po renderowaniu danych przypisujemy event listeners do ikonek
  addEventListenersToButtons();
}

// Funkcja przypisująca event listeners do przycisków like i retweet
function addEventListenersToButtons() {
  const likeButtons = document.querySelectorAll('.fa-heart');
  const retweetButtons = document.querySelectorAll('.fa-retweet');

  // Przypisanie kliknięcia do przycisku like
  likeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tweetId = button.getAttribute('data-like');
      handleLikeClick(tweetId);
    });
  });

  // Przypisanie kliknięcia do przycisku retweet
  retweetButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tweetId = button.getAttribute('data-retweet');
      handleRetweetClick(tweetId);
    });
  });
}


// Nasłuchujemy na kliknięcia w przyciski (polubienie, retweetowanie, odpowiedzi, dodawanie tweeta)
document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.post) {
    handlePostReplyClick(e.target.dataset.post);
  }
});

// Funkcja obsługująca kliknięcie "like"
function handleLikeClick(tweetId) {
   const targetTweetRef = ref(database, `tweets/${tweetId}`);
 
   get(targetTweetRef)
     .then((snapshot) => {
       if (snapshot.exists()) {
         const targetTweetObj = snapshot.val();
         
         // Zmiana liczby like'ów
         if (!targetTweetObj.isLiked) {
           targetTweetObj.likes++;
         } else {
           targetTweetObj.likes--;
         }
         targetTweetObj.isLiked = !targetTweetObj.isLiked;
 
         // Zapisanie zmienionych danych do Firebase
         set(targetTweetRef, targetTweetObj)
           .then(() => {
             console.log("Tweet zaktualizowany w Firebase.");
             fetchTweetsFromFirebase(); // Pobieranie wszystkich tweetów po zmianie
           })
           .catch((error) => {
             console.error("Błąd podczas zapisywania tweetu w Firebase: ", error);
           });
       }
     })
     .catch((error) => {
       console.error("Błąd podczas pobierania tweetu z Firebase: ", error);
     });
 }
 
 

// Funkcja obsługująca kliknięcie "retweet"
function handleRetweetClick(tweetId) {
   const targetTweetRef = ref(database, `tweets/${tweetId}`);
 
   get(targetTweetRef)
     .then((snapshot) => {
       if (snapshot.exists()) {
         const targetTweetObj = snapshot.val();
         
         // Zmiana liczby retweetów
         if (!targetTweetObj.isRetweeted) {
           targetTweetObj.retweets++;
         } else {
           targetTweetObj.retweets--;
         }
         targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
 
         // Zapisanie zmienionych danych do Firebase
         set(targetTweetRef, targetTweetObj)
           .then(() => {
             console.log("Tweet zaktualizowany w Firebase.");
             fetchTweetsFromFirebase(); // Pobieranie wszystkich tweetów po zmianie
           })
           .catch((error) => {
             console.error("Błąd podczas zapisywania tweetu w Firebase: ", error);
           });
       }
     })
     .catch((error) => {
       console.error("Błąd podczas pobierania tweetu z Firebase: ", error);
     });
 }
 

// Funkcja obsługująca kliknięcie odpowiedzi na tweet
function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

// Funkcja obsługująca dodanie odpowiedzi do tweetu
function handlePostReplyClick(postId) {
   const reply = document.getElementById(`reply-${postId}`).value;
   const targetTweetRef = ref(database, `tweets/${postId}`);
 
   if (reply) {
     get(targetTweetRef)
       .then((snapshot) => {
         if (snapshot.exists()) {
           const targetTweetObj = snapshot.val();
 
           // Dodanie odpowiedzi do tablicy replies
           targetTweetObj.replies.push({
             handle: "@Scrimba",
             profilePic: "images/scrimbalogo.png",
             tweetText: `${reply}`,
           });
 
           // Zapisanie zmienionych danych do Firebase
           set(targetTweetRef, targetTweetObj)
             .then(() => {
               console.log("Odpowiedź dodana i tweet zaktualizowany w Firebase.");
               fetchTweetsFromFirebase(); // Pobieranie wszystkich tweetów po zmianie
             })
             .catch((error) => {
               console.error("Błąd podczas zapisywania odpowiedzi w Firebase: ", error);
             });
         }
       })
       .catch((error) => {
         console.error("Błąd podczas pobierania tweetu z Firebase: ", error);
       });
   }
 }
 

// Po załadowaniu strony pobieramy dane z Firebase
window.addEventListener("load", () => {
  fetchTweetsFromFirebase();
});
