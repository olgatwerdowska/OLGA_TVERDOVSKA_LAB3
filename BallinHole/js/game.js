
var Field = class Field{
  holesList = new Array();
  ctx;
  timeStart = Date.now();
  constructor(field){
    this.width = window.innerWidth - 50;
    this.height = window.innerHeight - 50;
    this.initializeCanvas(field);
    this.ball = new Ball(this.ctx);
    this.finish = new Finish(this.ctx);
    this.holeGenerator();
  }
  
  initializeCanvas(field){
    if (field){
      this.canvas = document.getElementById(field);
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      localStorage.setItem('time', this.timeStart);
    }else {
      throw new Error('You have to provide Canvas ID');
    }
  }

  holeGenerator(){
    const hole1 = new Hole(this.ctx);
    hole1.posotionX = 70;
    hole1.posotionY = 70
    this.holesList.push(hole1);
    hole1.initializeHole();
    for ( var i = 0 ; i < 100; i++){
     const hole = new Hole(this.ctx);
     
     if (this.placeForHoleIsEmpty(hole))
     {
      this.holesList.push(hole);
     }
     
    }
  }

  placeForHoleIsEmpty(hole)
  {
    var radius = 30;
    var bool1 = true;

    this.holesList.forEach(function(props){
      if ((props.posotionX < hole.posotionX) && (props.posotionY < hole.posotionY)){
        hole.posotionX = hole.posotionX + radius;
        hole.posotionY = hole.posotionY + radius;
        bool1 = true
      } else {
        bool1 = false
      }
    })
    if(bool1){
      return true
    }else{
      return false
    }
  }

  BallMove(event){
    var x = event.gamma;
    var y = event.beta;

    if (x >  90) { x =  90};
    if (x < -90) { x = -90};

    x += 90;
    y += 90;
    var canvasHeight = window.innerHeight;
    var canvasWidth = window.innerWidth;

    var maxY = canvasHeight - field.ball.height;
    var maxX = canvasWidth - field.ball.width;
    
    var moveMaxY = (maxY * y / 180 - 20);
    var moveMaxX = (maxX * x / 180 - 20);
    
    field.ball.x = moveMaxX; 
    field.ball.y = moveMaxY;
    field.ball.initializeBall();
    field.finish.initializeFinish();
    field.holesList.forEach(function(props){
      props.initializeHole();
    })

    field.checkBallinHole();
    field.checkBallinFinish()
  }


  checkBallinHole(){
    field.holesList.forEach(function(hole){
      if(
        field.ball.y > hole.posotionY - 20
        && field.ball.y < hole.posotionY + 20
        && field.ball.x > hole.posotionX - 20
        && field.ball.x < hole.posotionX + 20
        ){
          const statement = document.getElementById('statement');
          const canvas = document.getElementById('field');
          canvas.style.display = "none";

          var curentCount = localStorage.getItem('count');
          var countHTML = document.getElementById('count');
          countHTML.innerText = "Count: " + curentCount;

          var timeFinish = Date.now();
          var  timeDifference = (timeFinish - field.timeStart);

          var timeDifferenceSec = new Date(timeDifference).getSeconds();
          var timeDifferenceMin = new Date(timeDifference).getMinutes();

          var timeHTML = document.getElementById('timeLose');
          timeHTML.innerText = "Time: " + timeDifferenceMin + " min " + timeDifferenceSec + " sec" ;

          window.removeEventListener('deviceorientation', field.BallMove, true);
          statement.style.display = "block";
 
      }

    })
  }

  checkBallinFinish(){
    if( field.ball.y + field.ball.height > field.finish.y
      && field.ball.x + field.ball.width > field.finish.x){
      const win = document.getElementById('win');
      const canvas = document.getElementById('field');
      var timeFinish = Date.now();
      var  timeDifference = timeFinish - field.timeStart;
      var timeDifferenceSec = new Date(timeDifference).getSeconds();
      var timeDifferenceMin = new Date(timeDifference).getMinutes();
      var timeHTML = document.getElementById('timeWin');
      timeHTML.innerText = "Time: " + timeDifferenceMin + " min " + timeDifferenceSec + " sec" ;
      window.removeEventListener('deviceorientation', field.BallMove, true);
      win.style.display = "block";
      canvas.style.display = "none";
    }
  }

  countAndTimeWin(){
    var curentCount = localStorage.getItem('count');
    var curentCountInt = parseInt(curentCount);
    localStorage.setItem('count', curentCountInt + 1);
    location.reload();
  }

  countAndTimeLose(){
    localStorage.setItem('count', 0);
    location.reload();
  }
}


class Ball{
  canvasHeight = window.innerHeight;
  canvasWidth = window.innerWidth;
  constructor(mCanvas){
    this.width = 40
    this.height = 40
    this.ctx = mCanvas;
    this.x = 0
    this.y = 0
  }
  initializeBall(){
    const ballImage = new Image();
    ballImage.src = "./img/ball.png";
    this.ctx.clearRect(0, 0 , this.canvasWidth, this.canvasHeight);
    ballImage.addEventListener('load', () =>{
    this.ctx.drawImage(ballImage,this.x, this.y, this.width, this.height);
    });
  }
}

class Hole{

  width = 40;
  height = 40;
  canvasHeight = window.innerHeight ;
  canvasWidth = window.innerWidth  ;
  maxRandomX = this.canvasWidth - (100);
  maxRandomY = this.canvasHeight - (100);
  minRandomX  = this.width + 50;
  minRandomY = this.height + 50;
  
  
  constructor(mCanvas){
    this.ctx = mCanvas;
    this.posotionX = (Math.floor(Math.random() * (this.maxRandomX - this.minRandomX + 1)) + this.minRandomX) - 128;
    this.posotionY = (Math.floor(Math.random() * (this.maxRandomY - this.minRandomY  + 1)) + this.minRandomY) - 128;
  }

  initializeHole(){
    var hole = new Path2D();
    this.ctx.fillStyle = "black";
    hole.arc(this.posotionX,this.posotionY, 20, 0, 2 * Math.PI);
    this.ctx.fill(hole);
    this.ctx.stroke();
  }
}

class Finish{
  constructor(mCanvas){
    this.width = 50;
    this.height = 50;
    this.ctx = mCanvas;
    this.canvasHeight = window.innerHeight - 50;
    this.canvasWidth = window.innerWidth - 50;
    this.y = this.canvasHeight - this.height;
    this.x = this.canvasWidth - this.width;
  }

  initializeFinish(){

    const finishImage = new Image();
    finishImage.src = "./img/finish.png";
    this.ctx.clearRect(0, 0 , this.canvasWidth, this.canvasHeight);
    finishImage.addEventListener('load', () =>{
    this.ctx.drawImage(finishImage,(this.canvasWidth - this.width), (this.canvasHeight - this.height), this.width, this.height);
    });
  }
}













