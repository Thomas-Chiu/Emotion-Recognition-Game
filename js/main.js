const holes = document.getElementsByClassName(`hole`);
const btnStart = document.getElementById(`btnStart`);
const btnPicker = document.getElementById(`btnPicker`);
const btnCheck = document.getElementById(`btnCheck`);
const txtTime = document.getElementById(`txtTime`);
const txtScore = document.getElementById(`txtScore`);
const txtTopPlayer = document.getElementById(`txtTopPlayer`);
const txtHighScore = document.getElementById(`txtHighScore`);
const emid = document.getElementsByClassName(`emid`);
const fast = document.getElementsByClassName(`fast`);
const audio = new Audio();
const rand = function (num) {
  return Math.floor(Math.random() * num);
};

let score = 0;
let inGame = false;
let timeLeft = 0;
let timer = 0;
let highScore = { name: ``, score: 0 };
let goldNum = 0;

// 若有(最高分) 記錄，會儲存到localStroage 裡面
let storage = JSON.parse(localStorage.getItem(`highScore`));
if (storage != null) {
  highScore.name = storage.name;
  highScore.score = storage.score;
  txtTopPlayer.innerHTML = highScore.name;
  txtHighScore.innerHTML = highScore.score;
}

// 開啟/ 關閉所有表情
btnCheck.onclick = function () {
  for (let h of holes) {
    if (h.style.display == `none`) {
      h.style.display = `block`;
    } else {
      h.style.display = `none`;
    }
  }
};

// 抽表情執行
btnPicker.onclick = function () {
  // 關閉所有表情
  for (let h of holes) {
    h.style.display = `none`;
  }
  // 關閉picker icon 點擊
  btnPicker.classList.add(`clickIgnore`);
  // 隨機速度200毫秒
  let timer = setInterval(pick, 200);
  pick();
  // 3秒後結束抽表情
  setTimeout(function () {
    clearInterval(timer);
    // 重啟picker icon 點擊
    btnPicker.classList.remove(`clickIgnore`);
  }, 3000);
};

// 抽表情函數
const pick = function () {
  for (let e of emid) {
    e.classList.remove(`gold`);
  }
  goldNum = rand(emid.length);
  // goldnum 變數儲存題目位置(數值)
  emid[goldNum].classList.add(`gold`);
};

// 遊戲執行
btnStart.onclick = () => {
  // 關閉start icon 點擊
  btnStart.classList.add(`clickIgnore`);
  // 新增背景音樂
  audio.src = `./Audio/LUCKY TAPES-  Touch!.mp3`;
  audio.play();
  inGame = true;
  timer = setInterval(game, 1500);
  game();
  score = 0;
  timeLeft = 40;
  txtTime.innerHTML = timeLeft;
};

// 遊戲函數
const game = () => {
  // 清除所有格子的屬性
  for (let i = 0; i < holes.length; i++) {
    holes[i].style.display = `none`;
    holes[i].classList.remove(`clickIgnore`, `animated`, `shake`, `heartBeat`);
    holes[i].classList.add(`animated`, `slideInUp`);
    holes[i].style.background = ``;
    // holes[i].classList.remove(`emotion${i + 1}`)
  }
  // 一次出現六個表情
  for (let i = 0; i < 6; i++) {
    holes[rand(holes.length)].style.display = `block`;
  }
  // 表情洗牌 (待優化)
  for (let i = 0; i < holes.length; i++) {
    if (rand(10) > 5) {
      holes[rand(holes.length)].classList.replace(
        `emotion${rand(holes.length)}`,
        `emotion${i + 1}`
      );
    } else {
      holes[rand(holes.length)].classList.replace(
        `emotion${rand(holes.length)}`,
        `emotion${goldNum + 1}`
      );
    }
  }

  // 點擊表情圖片後的回饋
  for (let hole of holes) {
    hole.onclick = () => {
      // 點擊正確表情的回饋
      if (hole.classList.contains(`emotion${goldNum + 1}`)) {
        console.log(goldNum);
        hole.classList.remove(`animated`, `slideInUp`);
        hole.classList.add(`animated`, `heartBeat`, `fast`);
        // 點擊正確會出現漢堡
        hole.style.background = `url(./Images/Cursors/burger.png) no-repeat center/30%`;
        // 關閉圖片點擊，因為連續點擊分數會累加
        hole.classList.add(`clickIgnore`);
        score += 10;
        txtScore.innerHTML = score;
      }

      // 點擊錯誤表情的回饋
      for (let i = 0; i < emid.length; i++) {
        if (!emid[i].classList.contains(`gold`)) {
          holes[i].onclick = function () {
            holes[i].classList.remove(`animated`, `slideInUp`);
            holes[i].classList.add(`animated`, `shake`);
            // 關閉圖片點擊，因為連續點擊分數會累加
            holes[i].classList.add(`clickIgnore`);
            score -= 5;
            txtScore.innerHTML = score;
            // 不要出現負的分數
            if (score <= 0) {
              score = 0;
              txtScore.innerHTML = score;
            }
          };
        }
      }
    };
  }

  timeLeft--;
  txtTime.innerHTML = timeLeft;

  if (timeLeft == 0) {
    inGame = false;
    clearInterval(timer);
    for (let hole of holes) {
      hole.style.display = `none`;
    }
    // 重啟start icon 點擊
    btnStart.classList.remove(`clickIgnore`);
    setTimeout(function () {
      alert(`You score: ${score} `);
    }, 100);
    // 若localStroage 沒東西或出現新的最高分
    if (storage == null || score > highScore.score) {
      audio.src = `./Audio/yay.mp3`;
      audio.play();
      const input = prompt(`Congrats, you're the Top! Insert your name.`);
      if (input != null && input.trim() != ``) {
        highScore.name = input;
        highScore.score = score;
        txtTopPlayer.innerHTML = highScore.name;
        txtHighScore.innerHTML = highScore.score;
        // 從localStrooage 取出最高分記錄顯示在網頁上
        localStorage.setItem(`highScore`, JSON.stringify(highScore));
      }
    }
  }
};
