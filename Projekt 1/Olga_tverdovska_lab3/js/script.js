window.addEventListener("keydown" ,
    function(e){
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
    if(!audio) return;
    audio.currentTime = 0;
    audio.play();
    const key = document.querySelector(`.key[data-key="${e.keyCode}"]`);
    key.classList.add('playing');
});

const keys = document.querySelectorAll('.key');
keys.forEach( key => key.addEventListener('transitionend' , removePlayingClass ) );
function removePlayingClass(e)
{
    this.classList.remove('playing');
}

const b = []
function Create1 (){
const a = document.getElementById('1').textContent;
if(a=='Start'){
    document.getElementById("1").innerHTML = "Stop";
    document.getElementById("1").style.backgroundColor= 'red';
    document.getElementById("1").addEventListener('keydown', function(e){
        console.log(e.keyCode)
        b.push(e.keyCode)
        return b
    })
}else{
    document.getElementById("1").innerHTML = "Start";
    document.getElementById("1").style.backgroundColor= 'green';
}
return b
}
console.log(b);
function play(){
    for (const key in b) {
        return b[key]
    }
    const audio = document.querySelector(`audio[data-key="${b[key]}"]`);
    if(!audio) return;
    audio.currentTime = 0;
    audio.play();
    
}

