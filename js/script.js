let nameUser = document.getElementById("input-name");
let bodyText = document.getElementById("postbox-text");
let dateInput = document.getElementById("input-date");
let errorName = document.querySelector(".postbox__error-name");
let errorBody = document.getElementById("postbox__error-text");
let postLikeText = document.querySelector(".post__like-text");
let commentButton = document.getElementById("comment-add");
let postList = document.getElementById("post-list");
let postBoxContent = document.getElementById("postbox");
nameUser.classList.remove("error-name");
bodyText.classList.remove("error-text-body");

commentButton.disabled = true;

//Валидация 
function isEmptyForm() {
  if (nameUser.value.length === 0 || nameUser.value.length === 0) {
    return true;
  }
}

function validateForm() {
  if (nameUser.value.length <= 3) {
    errorName.style.visibility = "visible";
    nameUser.classList.add("error-name");
    commentButton.disabled = true;
  } else {
    errorName.style.visibility = "hidden";
    nameUser.classList.remove("error-name");
  }
  if (bodyText.value.length <= 3) {
    errorBody.style.visibility = "visible";
    bodyText.classList.add("error-text-body");
    commentButton.disabled = true;
  } else {
    errorBody.style.visibility = "hidden";
    bodyText.classList.remove("error-text-body");
  }
  if (nameUser.value.length > 3 && bodyText.value.length > 3) {
    commentButton.disabled = false;
    return;
  }
  commentButton.disabled = true;
  
}

document.addEventListener("input", validateForm);


//Код с блоком комментариев
//Создание динамической разметки комментариев
let showComments = () => {
  let postbox = document.getElementById("postbox");
  let out = "";

    comments.forEach((item, index) => {
      out += `
          <div class="postbox__content" id="postbox${index}"> 
            <div class="post-list" id="post-list">
                <div class="post" id="comment-field">
                    <div class="post__header">
                       <div class="post__name">${item.name}</div>
                       <div class="post__date">${timeConverter(item.time)}</div>
                </div>
                <div class="post__text">${item.body}</div>
                    <div class="post__image">
                       <div class="post__like" id="post-like${index}">
                       <div class="heart" id="heart${index}">❤</div>
                   </div>
                 <div class="post__delete" id="post-delete${index}">
                  <img class="basket" src="./img/trash_0aptar2l5mg6.svg" alt="remove">
                  <span class="post__delete-text">Удалить</span>
              </div>
                   </div>
               </div>
          </div>
      </div>`;
    });
  

  postbox.innerHTML = out;

  comments.forEach((x, i) => {
    let postLike = document.getElementById(`post-like${i}`);
    let postDelete = document.getElementById(`post-delete${i}`);
    if (postDelete) {
      postDelete.removeEventListener("click", deletePost);
      postDelete.addEventListener("click", deletePost);
    }
    if (postLike) {
      postLike.addEventListener("click", toggleHeart);
    }
  });
  
};

//Удаление поста
function deletePost(event) {
  let parentId = event?.target?.parentNode.id;
  let index = parentId.substring(parentId.length - 1);
  let postDelete = document.getElementById(`post-delete${index}`);

  if (postDelete) {
    comments = comments.filter((x, i) => i !== +index);
    postDelete.removeEventListener("click", deletePost);
    showComments();
  }
}
//Переключение кнопки лайка
function toggleHeart(event) {
  let parentId = event?.target?.parentNode.id;
  let index = parentId.substring(parentId.length - 1);
  let postLike = document.getElementById(`post-like${index}`);

  if (postLike) {
    let heart = document.getElementById(`heart${index}`);
    heart.classList.toggle("heart-active");
  }
}

let comments = [];

function pushComment(event) {
  event.preventDefault();
  if(isEmptyForm()) {
    validateForm()
    return;
  }

  let commentName = nameUser;
  let commentBody = bodyText;
  
  let comment = {
    name: commentName.value,
    body: commentBody.value,
    time: dateInput.value === '' ? new Date(Date.now()) : new Date(dateInput.value),
  };
  
  commentName.value = "";
  commentBody.value = "";

  comments.push(comment);
  showComments();
}

commentButton.addEventListener("click", pushComment);
document.addEventListener("keydown", (e) => {
  if (e.key === 13) {
    pushComment();
  }
});

// Сколько дней разница между датами (в милисекундах)
function datediff(first, second) {        
  return (second - first) / (1000 * 60 * 60 * 24);
}

//Конвертер времени
let timeConverter = (dateComment) => {
  let now = new Date(Date.now());
  // Разница в днях
  let diffDays = datediff(dateComment.getTime(), now.getTime());
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let year = dateComment.getFullYear();
  let month = months[dateComment.getMonth()];
  let date = dateComment.getDate();
  let hour = now.getHours();
  let min = now.getMinutes();


  let time = `${date} ${month} ${year} ${hour}:${min}`;
 
  if (hour < 10) {
    time = `${date} ${month} ${year} 0${hour}:${min}`;
  }

  if (min < 10) {
    time = `${date} ${month} ${year} ${hour}:0${min}`;
  }

  if (hour < 10 && min < 10) {
    time = `${date} ${month} ${year} 0${hour}:0${min}`;
  }

  if(diffDays > 0 && diffDays < 1) {
    time = `Сегодня ${hour}:${min}`;
  }

  if(diffDays > 1 && diffDays < 2) {
    time = `Вчера ${hour}:${min}`;
  }
  if(dateInput.value === '') {
   time = `Сегодня ${hour}:${min}`;
  }
  return time;
  
};
showComments();

