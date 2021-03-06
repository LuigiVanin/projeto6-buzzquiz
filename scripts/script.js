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
const storedUserQuizzes = [];
const URL_API = "https://mock-api.driven.com.br/api/v4/buzzquizz/";

let quizzLevels = null;
let correctAnswerCount = 0;
let questionsAnswered = 0;
let totalQuestions = 0;
let selectedQuizzId = null;

let numberOfQuestions;
let numberOfLevels = 0;
let inputValidation = [];
let wrongAnswersList = [];
let wrongImagesList = [];

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

            <article class="home_quizz" onclick="openQuizzView()" data-identifier="quizz-card">
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

        <article class="home_quizz" onclick = "openQuizzView('${element.id}')"  data-identifier="quizz-card">
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
    // console.log(quizzData);
    quizzLevels = [...quizzData.levels];
    quizzLevels.forEach((i) => {
        i.minValue = parseInt(i.minValue);
    });
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
    const main = document.querySelector(".quizz-view_main");
    questions.forEach((element, i) => {
        main.innerHTML += `
        <div class="quizz-box">
            <h1 class="title" data-identifier="question"></h1>
            <div class="answers"></div>
        </div>`;
        renderQuestion(element, i);
    });

    main.innerHTML += `
    <div class="quizz-result" data-identifier="quizz-result">
    </div>
    `;
}

function renderQuestion(question, index) {
    const title = document.querySelectorAll(".quizz-box h1");
    title[index].innerHTML = question.title;
    title[index].style.setProperty("background", question.color);
    renderQuestionAnswers(question.answers, index);
}

function renderQuestionAnswers(answers, questionIndex) {
    const answersBox = document.querySelectorAll(".answers")[questionIndex];
    const randomAnswers = [...answers].sort(() => Math.random() - 0.5);
    randomAnswers.forEach((ans) => {
        let correctClass = "";
        if (ans.isCorrectAnswer) {
            correctClass = "correct";
        }
        answersBox.innerHTML += `
        <div class="answer" onclick="selectAnswer('${questionIndex}', ${ans.isCorrectAnswer}, this)" data-identifier="answer">
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
    // console.log(answersBox);
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
        setTimeout(renderResult, 2000);
    } else {
        setTimeout(() => {
            let index = parseInt(questionIndex) + 1;
            question[index].querySelector("h1").scrollIntoView();
        }, 2000);
    }
}

function restartData() {
    questionsAnswered = 0;
    correctAnswerCount = 0;
    totalQuestions = 0;
    quizzLevels = null;
}

function fromViewBackToHome() {
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

function objectLevelCompare(a, b) {
    if (a.minValue < b.minValue) {
        return -1;
    }
    if (a.minValue > b.minValue) {
        return 1;
    }
    return 0;
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

    resultArea.innerHTML = `
    <h1 class="title">${result}% de acerto: ${myLevel.title}</h1>
    <div class="desc">
    <img src="${myLevel.image}">
    <p>${myLevel.text}</p>
    </div>
    `;

    mainColumn.innerHTML += `
    <div class="nav-box">
        <button onclick="restartQuizz()" class="restart">Reiniciar Quizz</button>
        <button onclick="fromViewBackToHome()">Voltar para a home</button>
    </div>
    `;

    mainColumn.querySelector(".nav-box").scrollIntoView();
}

function openQuestionsScreen() {
    let quizzvalidation = [];
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

        saveNumberOfQuestionsInfo();
        loadQuestionScreen();
    } else {
        alert(
            "Parece que algo deu errado! Por favor,verifique se todos os campos est??o preenchidos corretamente."
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
    if (typeof urlImage !== "string") {
        urlImage = urlImage.value;
    }

    if (
        urlImage.slice(0, 8) === "https://" &&
        (urlImage.slice(-4) === ".png" ||
            urlImage.slice(-4) === ".jpg" ||
            urlImage.slice(-5) === ".jpeg" ||
            urlImage.slice(-4) === ".gif")
    ) {
        inputValidation.push(true);
    } else {
        inputValidation.push(false);
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

function saveNumberOfQuestionsInfo() {
    quizzInformation.questions = [];
    for (let i = 0; i < numberOfQuestions; i++) {
        quizzInformation.questions.push({ ...quizzQuestion });
    }
}

function loadQuestionScreen() {
    const questionListHtmlClass = document.querySelector(
        ".quizz-form_questions-screen_question-list"
    );
    for (let i = 1; i <= numberOfQuestions; i++) {
        questionListHtmlClass.innerHTML += `
        
        <div class="quizz-form_questions-screen_question-num">
            <h1 onclick="toggleIcon(this)">Pergunta ${i} <ion-icon name="create-sharp"></ion-icon></h1>
            <div class="quizz-form_questions-screen_inputs-field hidden">
                <input type="text" placeholder="Texto da pergunta" class="question-text">
                <input type="text" placeholder="Cor de fundo da pergunta" class="question-color">
                <p>Resposta correta</p>
                <input type="text" placeholder="Resposta correta" class="question-right-answer-text">
                <input type="text" placeholder="URL da imagem" class="question-right-answer-image">
                <p>Respostas incorretas</p>
                <div class="quizz-form_questions-screen_wrong-answer">
                    <input type="text" placeholder="Resposta incorreta 1" class="question-wrong-answer1-text">
                    <input type="text" placeholder="URL da imagem 1" class="question-wrong-answer1-image">
                </div>
                <div class="quizz-form_questions-screen_wrong-answer">
                    <input type="text" placeholder="Resposta incorreta 2" class="question-wrong-answer2-text">
                    <input type="text" placeholder="URL da imagem 2" class="question-wrong-answer2-image">
                </div>
                <div class="quizz-form_questions-screen_wrong-answer">
                    <input type="text" placeholder="Resposta incorreta 3" class="question-wrong-answer3-text">
                    <input type="text" placeholder="URL da imagem 3" class="question-wrong-answer3-image">
                </div>
            </div>
        </div>
        `;
    }
}

function fromFormBackToHome() {
    document.querySelector(".quizz-form_end-screen").classList.add("hidden");
    document
        .querySelector(".quizz-form_basic-info-screen")
        .classList.remove("hidden");
    document.querySelector(".quizz-form").classList.add("hidden");
    document.querySelector(".home").classList.remove("hidden");
}

function openMyQuizz(quizzId) {
    fromFormBackToHome();
    openQuizzView(quizzId);
}

function renderEndScreen(response) {
    if (response === null) {
        fromFormBackToHome();
        return;
    }
    console.log(response.data);
    const endScreen = document.querySelector(".quizz-form_end-screen");
    const imageDiv = endScreen.querySelector(".quizz-image");
    endScreen.classList.remove("hidden");
    const quizzId = response.data.id;
    const imageUrl = response.data.image;

    imageDiv.style.setProperty("background-image", `url(${imageUrl})`);
    const btnBox = endScreen.querySelector(".nav-box");
    btnBox.innerHTML = ``;
    btnBox.innerHTML += `
        <button onclick="openMyQuizz(${quizzId})" class="restart">Acessar Quizz</button>
        <button onclick="fromFormBackToHome()">Voltar para a home</button>
    `;
}

function openLevelsScreen() {
    let questionsValidation = [];
    testQuestionsInfos();
    resultOfTestingQuizzInfos = inputValidation;
    questionsValidation = resultOfTestingQuizzInfos.filter(
        (element) => element === false
    );
    if (questionsValidation.length === 0) {
        document
            .querySelector(".quizz-form_questions-screen")
            .classList.toggle("hidden");
        document
            .querySelector(".quizz-form_levels-screen")
            .classList.toggle("hidden");
        renderLevelsScreen();
    } else {
        alert(
            "Parece que algo deu errado! Por favor,verifique se todos os campos est??o preenchidos corretamente."
        );
    }
}

function urlValidationCheck(urlImage) {
    if (
        urlImage.slice(0, 8) === "https://" &&
        (urlImage.slice(-4) === ".png" ||
            urlImage.slice(-4) === ".jpg" ||
            urlImage.slice(-5) === ".jpeg" ||
            urlImage.slice(-4) === ".gif")
    ) {
        return true;
    } else {
        return false;
    }
}

function lengthValidation(number, min, max = Infinity) {
    if (number > max || number < min) {
        return false;
    }
    return true;
}

function saveLevelsInformation(response) {
    quizzInformation.levels = [];
    let validationError = false;
    let minValueZeroValidation = false;
    let levels = [...document.querySelectorAll(".inputs-field")];
    const levelsForm = { ...quizzLevel };
    levels.forEach((level) => {
        let inputs = [...level.querySelectorAll("input, textarea")];
        inputs.forEach((input, idx) => {
            if (
                input.value === "" ||
                (idx === 2 && !urlValidationCheck(input.value)) ||
                (idx === 0 && !lengthValidation(input.value.length, 10)) ||
                (idx === 1 &&
                    !lengthValidation(parseInt(input.value), 0, 100)) ||
                (idx === 3 && !lengthValidation(input.value.length, 30))
            ) {
                validationError = true;
            }
            if (idx === 1 && parseInt(input.value) === 0) {
                minValueZeroValidation = true;
            }
        });
        if (!validationError) {
            levelsForm.title = inputs[0].value;
            levelsForm.minValue = inputs[1].value;
            levelsForm.image = inputs[2].value;
            levelsForm.text = inputs[3].value;
            quizzInformation.levels.push({ ...levelsForm });
        }
    });
    // console.log(minValueZeroValidation);
    if (!minValueZeroValidation) {
        validationError = true;
    }
    if (validationError) {
        alert(
            "Parece que algo deu errado! Por favor,verifique se todos os campos est??o preenchidos corretamente."
        );
        return;
    }
    document.querySelector(".quizz-form_levels-screen").classList.add("hidden");
    const postPromise = axios.post(`${URL_API}quizzes/`, quizzInformation);
    postPromise.then(renderEndScreen);
    postPromise.catch((err) => {
        // console.log(err.response);
        alert("Alguma coisa deu errado com seu Quizz");
        renderEndScreen(null);
    });
}

function toggleLevelForm(idx) {
    const element = document.querySelectorAll(".level-form")[idx];
    const inputField = element.querySelector(".inputs-field");
    element.querySelector("ion-icon").classList.toggle("hidden");
    inputField.classList.toggle("hidden");
}

function renderLevelsScreen() {
    let levelScreen = document.querySelector(".quizz-form_levels-screen_main");
    if (numberOfLevels === 0) {
        numberOfLevels = 2;
    }
    levelScreen.innerHTML += ``;
    for (let i = 0; i < numberOfLevels; i++) {
        levelScreen.innerHTML += `
        <div class="level-form">
        <h1 onclick="toggleLevelForm(${i})"><span>N??vel ${
            i + 1
        }</span><ion-icon name="create-sharp"></ion-icon></h1>
        <div class="inputs-field hidden">
            <input type="text" placeholder="T??tulo do n??vel">
            <input type="number" placeholder="% m??nima de acertos">
            <input type="url" placeholder="URL da imagem do n??vel">
            <textarea placeholder="Describe yourself here..."></textarea>
        </div>
        `;
    }

    levelScreen.innerHTML += `
    <div class="nav-box">
        <button onclick="saveLevelsInformation()" class="restart">Finalizar Quizz</button>
    </div>
    `;
}

function testQuestionsInfos() {
    inputValidation = [];
    let questionsText = [...document.querySelectorAll(".question-text")];
    let questionsColors = [...document.querySelectorAll(".question-color")];
    let rigthAnswerText = [
        ...document.querySelectorAll(".question-right-answer-text"),
    ];
    let rigthAnswerImage = [
        ...document.querySelectorAll(".question-right-answer-image"),
    ];

    let wrongAnswer1Text = [
        ...document.querySelectorAll(".question-wrong-answer1-text"),
    ];
    let wrongAnswer1Image = [
        ...document.querySelectorAll(".question-wrong-answer1-image"),
    ];

    let wrongAnswer2Text = [
        ...document.querySelectorAll(".question-wrong-answer2-text"),
    ];
    let wrongAnswer2Image = [
        ...document.querySelectorAll(".question-wrong-answer2-image"),
    ];

    let wrongAnswer3Text = [
        ...document.querySelectorAll(".question-wrong-answer3-text"),
    ];
    let wrongAnswer3Image = [
        ...document.querySelectorAll(".question-wrong-answer3-image"),
    ];

    let wrongAnswerText = [
        wrongAnswer1Text,
        wrongAnswer2Text,
        wrongAnswer3Text,
    ];
    let wrongAnswerImage = [
        wrongAnswer1Image,
        wrongAnswer2Image,
        wrongAnswer3Image,
    ];

    testQuestionText(questionsText);
    testQuestionColors(questionsColors);
    rigthAnswerText.forEach(testRigthAnswerText);
    rigthAnswerImage.forEach(testUrlImage);
    testWrongAnswers(wrongAnswerText, wrongAnswerImage);
    rigthAnswerImage.forEach(testUrlImage);

    saveQuestionsInformation(
        questionsText,
        questionsColors,
        rigthAnswerText,
        rigthAnswerImage
    );
}

function testQuestionText(questionsText) {
    questionsText.forEach((input) => {
        if (input.value.length >= 20) {
            inputValidation.push(true);
        } else {
            inputValidation.push(false);
        }
    });
}

function testQuestionColors(questionsColors) {
    const regex = /[0-9a-f]/;
    questionsColors.forEach((input) => {
        let resultOfColorFormat = regex.exec(input.value.slice(1));
        if (
            input.value[0] === "#" &&
            resultOfColorFormat.input.length === 6 &&
            input.value.length === 7
        ) {
            inputValidation.push(true);
        } else {
            inputValidation.push(false);
        }
    });
}

function testRigthAnswerText(answerText) {
    if (answerText.value !== "") {
        inputValidation.push(true);
    } else {
        inputValidation.push(false);
    }
}

function testWrongAnswers(wrongAnswerText, wrongAnswerImage) {
    let answerComparison = [];
    let imageComparison = [];
    let wrongAnswerValidation = [];

    for (let i = 0; i < numberOfQuestions; i++) {
        wrongAnswerText.forEach((answer) => {
            answerComparison.push(answer[i]);
        });

        wrongAnswerImage.forEach((image) => {
            imageComparison.push(image[i]);
            if (image[i].value !== "") {
                testUrlImage(image[i]);
            }
        });

        answerComparison.forEach((answerText) => {
            if (answerText.value !== "") {
                wrongAnswerValidation.push(true);
            } else {
                wrongAnswerValidation.push(false);
            }
        });

        for (let j = 0; j < 3; j++) {
            if (
                (imageComparison[j].value === "" &&
                    answerComparison[j].value !== "") ||
                (imageComparison[j].value !== "" &&
                    answerComparison[j].value === "")
            ) {
                inputValidation.push(false);
            }
        }

        let answerValidation = wrongAnswerValidation.filter(
            (element) => element === true
        );

        if (answerValidation.length !== 0) {
            inputValidation.push(true);
        } else {
            inputValidation.push(false);
        }

        wrongAnswersList.push([...answerComparison]);
        wrongImagesList.push([...imageComparison]);
        for (let i = 0; i < wrongAnswersList.length; i++) {
            wrongAnswersList[i] = wrongAnswersList[i].filter(filterEmptyInputs);
            wrongImagesList[i] = wrongImagesList[i].filter(filterEmptyInputs);
        }
        answerComparison = [];
        imageComparison = [];
    }
}

function filterEmptyInputs(wrongInput) {
    if (wrongInput.value !== "") {
        return wrongInput;
    }
}

function saveQuestionsInformation(
    questionsText,
    questionsColors,
    rigthAnswerText,
    rigthAnswerImage
) {
    for (let i = 0; i < numberOfQuestions; i++) {
        quizzInformation.questions[i].title = questionsText[i].value;
        quizzInformation.questions[i].color = questionsColors[i].value;

        saveWrongAnswersInformation(i);
        saveRigthAnswersInformation(i, rigthAnswerText, rigthAnswerImage);
    }
}

function saveWrongAnswersInformation(i) {
    for (let j = 0; j < wrongAnswersList[i].length + 1; j++) {
        quizzInformation.questions[i].answers = quizzInformation.questions[
            i
        ].answers.concat({ ...quizzAnswer });
    }

    for (let j = 0; j < wrongAnswersList[i].length; j++) {
        quizzInformation.questions[i].answers[j + 1].text =
            wrongAnswersList[j][0].value;
        quizzInformation.questions[i].answers[j + 1].image =
            wrongImagesList[j][0].value;
    }

    let aux = quizzInformation.questions[i].answers.length / 2; //necessary to solve a problem I don't know how to revert
    for (let j = 0; j < aux; j++) {
        quizzInformation.questions[i].answers.splice(aux + 1, 2 * aux);
    }
    console.log(quizzInformation);
}

function saveRigthAnswersInformation(i, rigthAnswerText, rigthAnswerImage) {
    quizzInformation.questions[i].answers[0].text = rigthAnswerText[i].value;
    quizzInformation.questions[i].answers[0].image = rigthAnswerImage[i].value;
    quizzInformation.questions[i].answers[0].isCorrectAnswer = true;
}

function toggleIcon(question) {
    question.parentNode
        .querySelector(".quizz-form_questions-screen_inputs-field")
        .classList.toggle("hidden");
    question.parentNode
        .querySelector(".quizz-form_questions-screen ion-icon")
        .classList.toggle("hidden");
}
