//Create variables here
var dog,happyDog,foodS=20,foodStock;
var dogImg,happyDogImg;
var database;
var foodObj,FeedTime,lastFed,feedButton,addButton;
var gameState,changeState,readState;
var bedroomImg,washroomImg,gardenImg;
var currentTime=0;
function preload()
{
  dogImg=loadImage("images/Dog.png")
  happyDogImg=loadImage("images/Happy.png")
  bedroomImg=loadImage("images/Bed Room.png")
  washroomImg=loadImage("images/Wash Room.png")
  gardenImg=loadImage("images/Garden.png")
  
  
	//load images here
}

function setup() {
  
  database=firebase.database();
  createCanvas(500,500);
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
  
 foodObj= new Food();
 
  foodStock=database.ref('Food')
  foodStock.on("value",readStock,showError);

  FeedTime=database.ref('FeedTime')
  FeedTime.on("value",function(data){
    lastFed=data.val();
  });
  
  dog=createSprite(300,400,10,40)
  dog.addImage(dogImg)
  dog.scale=0.2
  
 feedButton=createButton("Feed the Dog");
 feedButton.position(650,95);
 feedButton.mousePressed(feedDog);

 addButton=createButton("Add Food");
addButton.position(450,95);
addButton.mousePressed(addFood);

  
  
  
}


function draw() {  
background(46,139,87);
currentTime=hour();
if(currentTime==(lastFed+1)){
    this.update("Playing");
    foodObj.garden();
}
else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
}
else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
}else{
    update("Hungry")
    foodObj.display();
}


if(gameState!="Hungry"){
    feedButton.hide();
    addButton.hide();
    dog.remove();
}else{
    feedButton.show();
    addButton.show();
    dog.addImage(dogImg);
}
/*foodObj.display();

 FeedTime=database.ref('FeedTime');
 FeedTime.on("value",function(data){
   lastFed=data.val();
 })*/
  //add styles here
  
  textSize(20)
  fill("black")
  if(lastFed>=12){
    text("Last Feed="+ lastFed%12 +"PM",150,120);

  }
  else if(lastFed==0){
    text("Last Feed=12 AM",150,120);
  }
  else{
    text("Last Feed="+ lastFed+"AM",150,120);
  }
  
  text("Food Remaining="+foodS ,95,100)


  drawSprites();
}
function readStock(data){
  console.log(data.val())
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
  
}

function writeStock(milk){
  /*if(milk<=0){
    milk=0;}
    else{
      milk=milk+1
    }*/

    database.ref('Food').update({
      foodStock:milk
      
    })
    
}



function showError(){
  console.log("Error")
}



function feedDog(){


  /*foodS=foodS-1
  writeStock(foodS);*/
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
  console.log(hour());
}

function addFood(){
  dog.addImage(happyDogImg);
  foodS++
  database.ref('/').update({
    Food:foodS

  })

}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}