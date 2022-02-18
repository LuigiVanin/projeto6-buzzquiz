let quizzInformation = {
    title: "",
    image: "",
    questions: [],
    levels: [],
};

let quizzQuestion = {
    title: "",
    color: "",
    answers: [],
};

let quizzAnswer = {
    text: "",
    image: "",
    isCorrectAnswer: false,
};

let quizzLevel = {
    title: "",
    image: "",
    text: "",
    minValue: 0,
};

const userQuizzesHtmlClass = document.querySelector(
    ".home_created-quizzes_list"
);
const nonUserQuizzesHtmlCLass = document.querySelector(
    ".home_non-user-quizzes"
);
// const storedUserQuizzes = JSON.parse(localStorage.getItem("userQuizz"));
const storedUserQuizzes = [{ id: -1 }, { id: -2 }, { id: -3 }]; //for testing only
const URL_API = "https://mock-api.driven.com.br/api/v4/buzzquizz/";

let quizzLevels = null;
let correctAnswerCount = 0;
let questionsAnswered = 0;
let totalQuestions = 0;
let selectedQuizzId = null;

let numberOfQuestions;
let numberOfLevels;
let inputValidation = [];

const promise = axios.get(`${URL_API}quizzes`);
promise.then(printQuizzes);

function printQuizzes(response) {
    // printUserQuizzes();
    printNonUserQuizzes(response);
}

function printUserQuizzes() {
    if (storedUserQuizzes.length !== 0) {
        document
            .querySelector(".home_created-quizzes_list")
            .classList.toggle("hidden");
        document
            .querySelector(".home_no-quizzes-created")
            .classList.toggle("hidden");
        storedUserQuizzes.forEach((element) => {
            userQuizzesHtmlClass += `

            <article class="home_quizz" onclick="openQuizzView()">
                <img src="${element.image}" alt="">
                <div class="home_quizz_gradient"></div>
                <p>${element.title}</p>
            </article>
        `;
        });
    }
}

function printNonUserQuizzes(response) {
    let nonUserQuizzesList = response.data.filter(filterUserQuizzes);
    nonUserQuizzesList.forEach((element) => {
        nonUserQuizzesHtmlCLass.innerHTML += `

        <article class="home_quizz" onclick = "openQuizzView('${element.id}')" >
            <img src="${element.image}" alt="">
            <div class="home_quizz_gradient"></div>
            <p>${element.title}</p>
        </article>
        `;
    });
}

function filterUserQuizzes(generalQuizz) {
    let comparingArray = [];
    storedUserQuizzes.forEach((userQuizz) => {
        if (generalQuizz.id !== userQuizz.id) {
            comparingArray.push(true);
        } else {
            comparingArray.push(false);
        }
    });

    let resultOfComparison = comparingArray.filter(
        (element) => element === false
    );
    if (resultOfComparison.length === 0) {
        return true;
    } else {
        return false;
    }
}

function openQuizzForm() {
    document.querySelector(".home").classList.toggle("hidden");
    document.querySelector(".quizz-form").classList.toggle("hidden");
}

function openQuizzView(quizzId) {
    selectedQuizzId = quizzId;
    document.querySelector(".home").classList.add("hidden");
    document.querySelector(".quizz-view").classList.remove("hidden");

    let quizz = axios.get(`${URL_API}quizzes/${quizzId}`).then(buildQuizzView);
}

function buildQuizzView(response) {
    const quizzData = response.data;
    totalQuestions = quizzData.questions.length;
    console.log(quizzData);
    quizzLevels = [...quizzData.levels];
    renderQuizzBanner(quizzData);
    renderQuizzQuestions(quizzData.questions);
}

function renderQuizzBanner(quizz) {
    const banner = document.querySelector(".banner");
    banner.innerText = quizz.title;
    banner.innerHTML = ` <h1>${quizz.title}</h1>`;
    banner.style.setProperty("background-image", `url(${quizz.image})`);
}

function renderQuizzQuestions(questions) {
    // console.log(questions);
    const main = document.querySelector(".quizz-view_main");
    questions.forEach((element, i) => {
        main.innerHTML += `
        <div class="quizz-box">
            <h1 class="title"></h1>
            <div class="answers"></div>
        </div>`;
        renderQuestion(element, i);
    });

    main.innerHTML += `
    <div class="quizz-result">
    </div>
    `;
}

// TODO: reduzir o número de funções!
function renderQuestion(question, index) {
    const title = document.querySelectorAll(".quizz-box h1");
    title[index].innerHTML = question.title;
    title[index].style.setProperty("background", question.color);
    renderQuestionAnswers(question.answers, index);
}

function renderQuestionAnswers(answers, questionIndex) {
    // console.log(answers);
    const answersBox = document.querySelectorAll(".answers")[questionIndex];
    const randomAnswers = [...answers].sort(() => Math.random() - 0.5);
    randomAnswers.forEach((ans) => {
        let correctClass = "";
        if (ans.isCorrectAnswer) {
            correctClass = "correct";
        }
        answersBox.innerHTML += `
        <div class="answer" onclick="selectAnswer('${questionIndex}', ${ans.isCorrectAnswer}, this)">
            <div class="image"></div>
            <p class="${correctClass}">${ans.text}</p>
        </div>
        `;
        const image = document.querySelectorAll(".answer .image");
        image[image.length - 1].style.setProperty(
            "background-image",
            `url(${ans.image})`
        );
    });
    console.log(answersBox);
}

function selectAnswer(questionIndex, isCorrectAnswer, element) {
    const question = document.querySelectorAll(".quizz-box");
    if (question[questionIndex].classList.contains("selected")) {
        return;
    }
    questionsAnswered++;
    element.children[0].classList.add("chosen");
    question[questionIndex].classList.add("selected");
    if (isCorrectAnswer) {
        correctAnswerCount++;
    }
    if (questionsAnswered === totalQuestions) {
        setTimeout(renderResult, 1000);

        // FIX: scrol into view error
    } else {
        setTimeout(() => {
            let index = parseInt(questionIndex) + 1;
            question[index].scrollIntoView();
        }, 1000);
    }
}

function objectLevelCompare(a, b) {
    if (a.minValue < b.minValue) {
        return -1;
    }
    if (a.minValue > b.minValue) {
        return 1;
    }
    return 0;
}

function restartData() {
    questionsAnswered = 0;
    correctAnswerCount = 0;
    totalQuestions = 0;
    quizzLevels = null;
}

function backToHome() {
    restartData();
    document.querySelector(".quizz-view_main").remove();
    document.querySelector(
        ".quizz-view"
    ).innerHTML += `<div class="quizz-view_main"></div>`;
    document.querySelector(".quizz-view").classList.toggle("hidden");
    document.querySelector(".home").classList.toggle("hidden");
    document.querySelector(".home_quizz").scrollIntoView();
}

function restartQuizz() {
    document.querySelector(".quizz-view_main").remove();
    document.querySelector(
        ".quizz-view"
    ).innerHTML += `<div class="quizz-view_main"></div>`;
    restartData();
    openQuizzView(selectedQuizzId);
}

function renderResult() {
    const result = Math.round((correctAnswerCount / totalQuestions) * 100);
    const mainColumn = document.querySelector(".quizz-view_main");
    const resultArea = document.querySelector(".quizz-result");
    resultArea.classList.add("show");

    let myLevel = quizzLevels[0];
    quizzLevels = quizzLevels.sort(objectLevelCompare);

    for (let i = 0; i < quizzLevels.length; i++) {
        if (result < quizzLevels[i].minValue) {
            break;
        }
        myLevel = quizzLevels[i];
    }
    console.log(myLevel);

    resultArea.innerHTML = `
    <h1 class="title">${result}% de acerto: ${myLevel.title}</h1>
    <img src="${myLevel.image}">
    <p>${myLevel.text}</p>
    `;

    mainColumn.innerHTML += `
    <div class="nav-box">
        <button onclick="restartQuizz()" class="restart">Reiniciar Quizz</button>
        <button onclick="backToHome()">Voltar para a home</button>
    </div>
    `;

    // FIX: scroll not working
    resultArea.scrollIntoView();
}

function openQuestionsScreen() {
    let quizzvalidation = [];
    // let resultOfTestingQuizzInfos = testBasicInfos();
    testBasicInfos();
    resultOfTestingQuizzInfos = inputValidation;
    quizzvalidation = resultOfTestingQuizzInfos.filter(
        (element) => element === false
    );

    if (quizzvalidation.length === 0) {
        document
            .querySelector(".quizz-form_basic-info-screen")
            .classList.toggle("hidden");
        document
            .querySelector(".quizz-form_questions-screen")
            .classList.toggle("hidden");

        console.log(numberOfQuestions);
        loadQuestionScreen();
    } else {
        alert(
            "Parece que algo deu errado! Por favor,verifique se todos os campos estão preenchidos corretamente."
        );
    }
}

function testBasicInfos() {
    inputValidation = [];
    quizzInformation.title = document.querySelector(
        ".quizz-form_basic-info-screen_quizz-title"
    ).value;
    quizzInformation.image = document.querySelector(
        ".quizz-form_basic-info-screen_url-image"
    ).value;
    numberOfQuestions = parseInt(
        document.querySelector(
            ".quizz-form_basic-info-screen_number-of-questions"
        ).value
    );
    numberOfLevels = parseInt(
        document.querySelector(".quizz-form_basic-info-screen_number-of-levels")
            .value
    );

    testQuizzTitle(quizzInformation.title);
    testUrlImage(quizzInformation.image);
    testNumberOfQuestions(numberOfQuestions);
    testNumberOfLevels(numberOfLevels);
}

function testQuizzTitle(quizzTitle) {
    if (quizzTitle.length >= 20 && quizzTitle.length <= 65) {
        inputValidation.push(true);
    } else {
        inputValidation.push(false);
    }
}

function testUrlImage(urlImage) {
    if (typeof(urlImage) !== "string"){
        urlImage = urlImage.value;
    }

    console.log(urlImage)
    if (
        urlImage.slice(0, 8) === "https://" &&
        (urlImage.slice(-4) === ".png" ||
            urlImage.slice(-4) === ".jpg" ||
            urlImage.slice(-5) === ".jpeg" ||
            urlImage.slice(-4) === ".gif")
    ) {
        inputValidation.push(true);
        console.log("true")
    } else {
        inputValidation.push(false);
        console.log("false")
    }
}

function testNumberOfQuestions(numberOfQuestions) {
    if (numberOfQuestions >= 3) {
        inputValidation.push(true);
    } else {
        inputValidation.push(false);
    }
}

function testNumberOfLevels(numberOfLevels) {
    if (numberOfLevels >= 2) {
        inputValidation.push(true);
    } else {
        inputValidation.push(false);
    }
}

function loadQuestionScreen() {
    const questionListHtmlClass = document.querySelector(
        ".quizz-form_questions-screen_question-list"
    );
    console.log(questionListHtmlClass);
    for (let i = 1; i <= numberOfQuestions; i++) {
        console.log("Entrei");
        questionListHtmlClass.innerHTML += `
        
        <div class="quizz-form_questions-screen_question-num">
            <p>Pergunta ${i}</p>
            <input type="text" placeholder="Texto da pergunta" class="question-text">
            <input type="text" placeholder="Cor de fundo da pergunta" class="question-color">
            <p>Resposta correta</p>
            <input type="text" placeholder="Resposta correta" class="question-right-answer-text">
            <input type="text" placeholder="URL da imagem" class="question-right-answer-image">
            <p>Respostas incorretas</p>
            <div class="quizz-form_questions-screen_wrong-answer1">
                <input type="text" placeholder="Resposta incorreta 1" class="question-wrong-answer1-text">
                <input type="text" placeholder="URL da imagem 1" class="question-wrong-answer1-image">
            </div>
            <div class="quizz-form_questions-screen_wrong-answer2">
                <input type="text" placeholder="Resposta incorreta 2" class="question-wrong-answer2-text">
                <input type="text" placeholder="URL da imagem 2" class="question-wrong-answer2-image">
            </div>
            <div class="quizz-form_questions-screen_wrong-answer3">
                <input type="text" placeholder="Resposta incorreta 3" class="question-wrong-answer3-text">
                <input type="text" placeholder="URL da imagem 3" class="question-wrong-answer3-image">
            </div>
        </div>
        `;
    }
}

numberOfQuestions = 3; //for testing only; erase later

function openLevelsScreen(){
    let questionsValidation = [];
    let resultOfTestingQuizzInfos = testQuestionsInfos();
    questionsValidation = resultOfTestingQuizzInfos.filter(
        (element) => element === false
    );

    if (questionsValidation.length === 0) {
        document
            .querySelector(".quizz-form_basic-info-screen")
            .classList.toggle("hidden");
        document
            .querySelector(".quizz-form_questions-screen")
            .classList.toggle("hidden");

        console.log(numberOfQuestions);
        loadQuestionScreen();
    } else {
        alert(
            "Parece que algo deu errado! Por favor,verifique se todos os campos estão preenchidos corretamente."
        );
    }
}

function testQuestionsInfos(){
    inputValidation = [];
    let questionsText = [...document.querySelectorAll(".question-text")];
    let questionsColors = [...document.querySelectorAll(".question-color")];
    let rigthAnswerText = [...document.querySelectorAll(".question-right-answer-text")];
    let rigthAnswerImage = [...document.querySelectorAll(".question-right-answer-image")];

    let wrongAnswer1Text = [...document.querySelectorAll(".question-wrong-answer1-text")];
    let wrongAnswer1Image = [...document.querySelectorAll(".question-wrong-answer1-image")];

    let wrongAnswer2Text = [...document.querySelectorAll(".question-wrong-answer2-text")];
    let wrongAnswer2Image = [...document.querySelectorAll(".question-wrong-answer2-image")];

    let wrongAnswer3Text = [...document.querySelectorAll(".question-wrong-answer3-text")];
    let wrongAnswer3Image = [...document.querySelectorAll(".question-wrong-answer3-image")];

    testQuestionText(questionsText);
    testQuestionColors(questionsColors);
    testRigthAnswerText(rigthAnswerText);
    rigthAnswerImage.forEach(testUrlImage);
}

function testQuestionText(questionsText){
    questionsText.forEach( (input) => {
        if (input.value.length >= 20) {
            inputValidation.push(true);
        }else{
            inputValidation.push(false);
        }
    });
}

function testQuestionColors(questionsColors){
    const regex = /[0-9a-f]/;
    questionsColors.forEach( (input) => {
        let resultOfColorFormat = regex.exec(input.value.slice(1));
        if (input.value[0] === "#" && resultOfColorFormat.input.length === 6 && input.value.length === 7) {
            inputValidation.push(true);
        }else{
            inputValidation.push(false);
        }
    });
}

// function testQuestionText(inputValidation, questionsText){
//     for (let i = 0; i < questionsText.length; i++) {
//         quizzInformation.questions.push(quizzQuestion);
//         quizzInformation.questions[i].title = questionsText[i].value;
//     }
// }