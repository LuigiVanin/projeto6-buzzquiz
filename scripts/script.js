const userQuizzesHtmlClass = document.querySelector(".home_created-quizzes");
const nonUserQuizzesHtmlCLass = document.querySelector(".home_non-user-quizzes");
// const storedUserQuizzes = JSON.parse(localStorage.getItem("userQuizz"));
const storedUserQuizzes = [{ id: -1 }, { id: -2 }, { id: -3 }]; //for testing only

const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes")
promise.then(printQuizzes);

function printQuizzes(response) {
    // printUserQuizzes();
    printNonUserQuizzes(response);
}

function printUserQuizzes() {
    storedUserQuizzes.forEach(element => {
        userQuizzesHtmlClass += `

        <article class="home_quizz" onclick="openQuizzView()">
            <img src="${element.image}" alt="">
            <div class="home_quizz_gradient"></div>
            <p>${element.title}</p>
        </article>
        `
    });
}

function printNonUserQuizzes(response) {
    console.log(response.data)
    let nonUserQuizzesList = response.data.filter(filterUserQuizzes);
    nonUserQuizzesList.forEach(element => {
        nonUserQuizzesHtmlCLass.innerHTML += `

        <article class="home_quizz" onclick = "openQuizzView()" >
            <img src="${element.image}" alt="">
            <div class="home_quizz_gradient"></div>
            <p>${element.title}</p>
        </article>
        `
    });
}

function filterUserQuizzes(generalQuizz) {
    let comparingArray = [];
    storedUserQuizzes.forEach(userQuizz => {
        if (generalQuizz.id !== userQuizz.id) {
            comparingArray.push(true);
        }else{
            comparingArray.push(false);
        }
    });
    
    let resultOfComparison  = comparingArray.filter(element => (element === false) );
    if(resultOfComparison.length === 0){
        return true 
    }else{
        return false
    }
}


function openQuizzView() {
    document.querySelector(".home").classList.toggle("hidden");
    document.querySelector(".quizz-view").classList.toggle("hidden");
}
