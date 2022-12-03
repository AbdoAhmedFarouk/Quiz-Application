let count = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let spansContainer = document.querySelector(".bullets .spans-container");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit-btn");
let resultsDiv = document.querySelector(".results");
let divTime = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
  let myReq = new XMLHttpRequest();
  myReq.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      createBullets(questionsObject.length);
      addQuestionData(questionsObject[currentIndex], questionsObject.length);
      // countDown(10, questionsObject.length);
      submitBtn.onclick = () => {
        let theRightAnswer = questionsObject[currentIndex]["right_answer"];
        currentIndex++;
        checkAnswers(theRightAnswer, questionsObject.length);
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(questionsObject[currentIndex], questionsObject.length);
        handleBullets();
        clearInterval(countdownInterval);
        countDown(5, questionsObject.length);
        showResult(questionsObject.length);
      };
    }
  };
  myReq.open("GET", "html_questions.json", true);
  myReq.send();
  // fetch("html_questions.json")
  //   .then((res) => {
  //     let fullData = res.json();
  //     return fullData;
  //   })
  //   .then((data) => console.log(data));
}
getQuestions();

function createBullets(num) {
  count.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let spans = document.createElement("span");
    if (i === 0) {
      spans.className = "on";
    }
    spansContainer.appendChild(spans);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let question = document.createElement("h2");
    let questionTxt = document.createTextNode(obj["title"]);

    question.appendChild(questionTxt);
    quizArea.appendChild(question);

    for (let i = 1; i <= 4; i++) {
      let answerDiv = document.createElement("div");
      answerDiv.className = "answer";
      let answerInput = document.createElement("input");
      answerInput.id = `answer_${i}`;
      answerInput.type = "radio";
      answerInput.name = "question";
      answerInput.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        answerInput.checked = true;
      }

      let answerLabel = document.createElement("label");
      answerLabel.htmlFor = `answer_${i}`;
      let answerLabelTxt = document.createTextNode(obj[`answer_${i}`]);
      answerLabel.appendChild(answerLabelTxt);

      answerDiv.appendChild(answerInput);
      answerDiv.appendChild(answerLabel);
      answersArea.appendChild(answerDiv);
    }
  }
}

function checkAnswers(rAnswer, qCount) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(
    ".bullets .spans-container span"
  );
  let spansArr = Array.from(bulletsSpans);
  spansArr.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResult(num) {
  let theResults;
  if (currentIndex === num) {
    submitBtn.remove();
    quizArea.remove();
    answersArea.remove();
    bullets.remove();
    if (rightAnswers > num / 2 && rightAnswers < num) {
      theResults = `<span class='good'>Good</span> You Answered ${rightAnswers} From ${num}`;
    } else if (rightAnswers === num) {
      theResults = `<span class='perfect'>Perfect</span> You Answered ${num} From ${num}`;
    } else {
      theResults = `<span class='bad'>Bad</span> You Answered ${rightAnswers} From ${num}`;
    }
    resultsDiv.innerHTML = theResults;
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      divTime.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}
