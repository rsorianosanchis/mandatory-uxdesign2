'use strict';

// uppgifterna från API
// https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple
// detalierad options for quiz-request
let amountInput; // förbered för om usr kontrollera antal av frågor
let amount; // siffran // antal av frågor åt gången
let categoryId; // siffran
let category;
let difficultyId; // 'easy' || 'medium' || 'hard'
let difficulty;
let typeId; // 'multiple' || 'boolean'
let type;

//request token
//amount = 5;

let urlToken = 'https://opentdb.com/api_token.php?command=request';
var tokenId; // coden 'cb83c8f2ed245b168136fdd16b251dee0c85d37cb132fccbe3ee303294db5330'
let token;

// questions request
let urlRequest;

// reset session token
let urlResetSession = `https://opentdb.com/api_token.php?command=reset${token}`;
//
/***************************************************************************************************************************************/


function ajaxGet (url,myFunction,asyncBool){
 console.log(url);
 let req = new XMLHttpRequest();
 req.open('GET',url,asyncBool);
 req.addEventListener('load',()=>{
  if (req.status >= 200 && req.status < 400) {
   console.log(req.responseText);
   myFunction(req.responseText);
  }else{
   console.log(req.status +" "+ req.statusText);
  }
 });
 req.addEventListener('error',()=>{console.log('Förfrågan lyckades inte nå serven');});
 req.send(null);
};

function renderLista (dataIn){
 console.log(dataIn);
 let data = JSON.parse(dataIn);
 console.log(data);
 /*
 data.forEach( function(element, index) {
  let vLi = document.createElement('li');
  vLi.textContent = element.name;
  vUl.appendChild(vLi);
  console.log(element);
 });
 */
};
function getTokenId (dataIn){
 console.log(dataIn);
 let data = JSON.parse(dataIn);
 tokenId = data.token;
 token = `&token=${tokenId}`;
};
//
function controlUrlApiReq () {
 //debugger;
 if(!!amount === false){
  amount = 10// body... 
 }else{
   amount = amountInput;
 };
 //
 if (!!categoryId === false) {
  category = '';
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
 if (!!difficultyId === false) {
  difficulty ='';
 }else{
   difficulty = difficultyId;
 };
 if (!!typeId === false) {
  type ='';
 }else{
   type = `&type=${typeId}`;
 };
 //
 urlRequest = `https://opentdb.com/api.php?amount=${amount}${category}${category}${category}${token}`;
 console.log(urlRequest);
};


//
ajaxGet(urlToken,getTokenId,false);
controlUrlApiReq();
console.log(token);
ajaxGet(urlRequest,renderLista,true);
//
