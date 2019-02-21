'use strict';
/****************************************************/
/******************Initial Conditions ***************/
/****************************************************/
let vBody = document.body;
let vHeader = document.querySelector('header');
vBody.appendChild(vHeader);
let vMain = document.createElement('main');
vMain.className = ('main');
vBody.appendChild(vMain);
let startButton = document.createElement('button');
let checkButton = document.createElement('button');
let correctAnswer = [];
let checkedAnswer = [];
let score = 0;
// url Request variables settings 
let amountInput; // förbered för om usr kontrollera antal av frågor
let amount; // siffran // antal av frågor åt gången
let categoryId; // siffran
let category;
let difficultyId;// 'easy' || 'medium' || 'hard'
let difficulty;
let typeId; // 'multiple' || 'boolean'
let type;
//url for request token
const urlToken = 'https://opentdb.com/api_token.php?command=request'; 
let tokenId; // coden exempel 'cb83c8f2ed245b168136fdd16b251dee0c85d37cb132fccbe3ee303294db5330'
let token;
// main url request questions variable
let urlRequest;
// url for reset session token
let urlResetSession = `https://opentdb.com/api_token.php?command=reset${token}`; 
//
// Modal Dialog Variables och Listeners
let vModal = document.querySelector('#simpleModal');
let vCloseBtn = document.querySelector('.closeBtn');
let vReStartBtn = document.querySelector('.reStartBtn');
let vPmodal = document.querySelector('.pModal');
vCloseBtn.addEventListener('click',transitionToStart);
vReStartBtn.addEventListener('click',transitionToQuiz);
//
//
/****************************************************/
/**********Main Program Excecution*******************/
/****************************************************/
createStartButton();
//
//
/****************************************************/
/**********Program functions*************************/
/****************************************************/
function createStartButton(){
  startButton.setAttribute('id','startButton');
  startButton.innerHTML = 'START';
  vMain.appendChild(startButton);
  startButton.addEventListener('click',mainProgram);
};
//
function mainProgram () {
  // Get new Session Spel 'Token' Not Assync for garantera Token innan börjar spel.
  ajaxGet(urlToken,getTokenId,false);
  //Controlled request with usr specifications
  setupUrlApiReqQuiz();
  // View Questions
  ajaxGet(urlRequest,renderQuiz,true);
};
//
function ajaxGet (url,myFunction,asyncBool) {
  console.log(url);
  let req = new XMLHttpRequest();
  req.open('GET',url,asyncBool);
  req.addEventListener('load',()=>{
    if(req.status >= 200 && req.status < 400) {
      //console.log(req.responseText);
      myFunction(req.responseText);
    }else{
      console.log(req.status +" "+ req.statusText);
    }
  });
  req.addEventListener('error',()=>{console.log('Förfrågan lyckades inte nå serven');});
  req.send(null);
};
//
function getTokenId (dataIn) {
  console.log(dataIn);
  let data = JSON.parse(dataIn);
  tokenId = data.token;
  token = `&token=${tokenId}`;
};
//
//urlrequest är redo för att välja andra requestsettings
function setupUrlApiReqQuiz() {
  if(!!amountInput === false) {
    amount = 10// default 10 questions
  }else{
    amount = amountInput;
  };
  //
  if (!!categoryId === false) {
    category = '';// deafult utan konkret category
  }else {
    category = `&category=${categoryId}`;
  };
  //
  if (!!difficultyId === false) {
    difficulty ='';
  }else{
    difficulty = `&difficulty=${difficultyId}`;
  };
  //
  if (!!typeId === false) {
    type ='';
  }else{
    type = `&type=${typeId}`;
  };
  //
  urlRequest = `https://opentdb.com/api.php?amount=${amount}${category}${difficulty}${type}${token}`;
  console.log(urlRequest);
};
//
function renderQuiz (dataIn) {
  //
  console.log(dataIn);
  let data = JSON.parse(dataIn);
  console.log(data);
  serverResponseCodes(data.response_code); // Visar i consolen API code responsen
  let numQuestion = 1;
  let score = 0;
  correctAnswer = [];
  //
  /* När vi kommer från modal dialog undvikar man att få ett fel 
  för ta bort satartButton som existerar inte.*/
  if (document.getElementById('startButton')) {
    startButton.removeEventListener('click',mainProgram);
    vMain.removeChild(startButton);
  }else{
    console.log('kommer vi från modal dialog');
  }
  //
  for (let i of data.results) {
    //
    let vForm = document.createElement('div');
    vForm.className = 'mdc-form-field';
    vMain.appendChild(vForm);
    console.log(i.question);
    let vP = document.createElement('p');
    vP.setAttribute('id',`question${numQuestion}`);
    vP.innerHTML = i.question;
    vForm.appendChild(vP);
    let numAnswer = 1;
    /*vi ska läga till alla optioner på en array answersArr = [] senare man ska 
    använda arrayen för undvika att korrekta svar ska ligga på samman plats.*/
    let answersArr = [];
    answersArr.push(i.correct_answer); // för att rendera
    correctAnswer.push(i.correct_answer); // för kontrollera resultatet senare
    for (let j of i.incorrect_answers){
     answersArr.push(j);
    };
    console.log(answersArr);// här har vi alla svar.
    shuffle(answersArr);// blanda svar optioner => se shuffle();
    console.log(answersArr);// visa nya svar position 
    for (let answ of answersArr) {
      let vMdcRadio = document.createElement('div');
      vMdcRadio.className = 'mdc-radio';
      let vInput = document.createElement('input');
      vInput.className = 'mdc-radio__native-control';
      vInput.setAttribute('type','radio');
      vInput.setAttribute('id', `answer${numQuestion}-${numAnswer}`);
      vInput.setAttribute('name', `radio${numQuestion}`);
      vInput.setAttribute('value', answ);
      let vDivRadioBak = document.createElement('div');
      vDivRadioBak.className = 'mdc-radio__background';
      let vDivRadioOuter = document.createElement('div');
      vDivRadioOuter.className = 'mdc-radio__outer-circle';
      let vDivRadioInner = document.createElement('div');
      vDivRadioInner.className = 'mdc-radio__inner-circle';
      let vLabel = document.createElement('label');
      vLabel.setAttribute('for',`answer${numQuestion}-${numAnswer}`);
      vLabel.innerHTML = answ;
      vForm.appendChild(vMdcRadio);
      vMdcRadio.appendChild(vInput);
      vMdcRadio.appendChild(vDivRadioBak);
      vDivRadioBak.appendChild(vDivRadioOuter);
      vDivRadioBak.appendChild(vDivRadioInner);
      vForm.appendChild(vLabel);
      numAnswer++;
    };
    numQuestion++;
  };
  createSubmitButton();
  vMain.appendChild(checkButton);
};
//
function serverResponseCodes (code){
 switch (code) {
  case 1:
   console.error("Code 1: No Results Could not return results. The API doesn't have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)");
  break;
  case 2:
   console.error("Code 2: Invalid Parameter Contains an invalid parameter. Arguements passed in aren't valid. (Ex. Amount = Five)");
  break;
  case 3:
   console.error("Code 3: Token Not Found Session Token does not exist.");
  break;
  case 4:
   console.error("Code 4: Token Empty Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.");
  break;
  default:
   console.log("Code 0: Success Returned results successfully.");
   break;
 };
};
//
function shuffle(array){
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;
  // Om det finns elemet att blanda..
  while (0 !== currentIndex) {
    // Seleccionar un elemento sin mezclar...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // E intercambiarlo con el elemento actual
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};
//
function createSubmitButton(){
  checkButton.setAttribute('id','checkButton');
  checkButton.innerHTML = 'Submit Answers';
  checkButton.addEventListener('click',resultTest);
};

function resultTest () {
  getAnswers();
  controlResultat(correctAnswer,checkedAnswer);
};
//
function getAnswers (){
  let vAllInputNode = document.querySelectorAll("input");
  let inputArr = Array.from(vAllInputNode);
  checkedAnswer = [];
  for (let i  of inputArr) {
   if(i.checked === true){
    console.log(i.value);
    checkedAnswer.push(i.value);
   }else{
    console.log("");
   }
  };
};
//
function transitionToQuiz () {
  closeModal();
  clearQuiz();
  ajaxGet(urlRequest,renderQuiz,true);
  console.log(tokenId);//man visar samman token
};
//
function clearQuiz () {
  let clsElements = document.querySelectorAll('.mdc-form-field, #checkButton');
  for (let i of clsElements){
  vMain.removeChild(i);
 };
};
//
function transitionToStart () {
 checkButton.removeEventListener('click',resultTest); 
 clearQuiz(); 
 closeModal();
 createStartButton();
};
//
function controlResultat (correctAnswer,checkedAnswer) {
 console.log(checkedAnswer);
 console.log(correctAnswer);
 score = 0;
 if(correctAnswer.length === checkedAnswer.length){
  for(let i = 0 ; i < checkedAnswer.length; i++){
    console.log(checkedAnswer[i]);
    console.log(correctAnswer[i]);
  if(checkedAnswer[i] === correctAnswer[i] ){
    score++;
  }else{
    continue;
  }
  };
  console.log(`du har fått ${score} bra svar av ${correctAnswer.length}`);
  //Anropas dialog modal efter controlera resultatet.
  openModal();
  //
 }else{
    alert('Chek att alla frågor har svar och trycka submit igen');
 };
};
//
function openModal () {
  vPmodal.innerHTML = `du har fått ${score} bra svar av ${correctAnswer.length}`;
  vModal.style.display = 'block';
};
//
function closeModal () {
  vModal.style.display = 'none';
  vPmodal.remove.innerHTML;  
};
