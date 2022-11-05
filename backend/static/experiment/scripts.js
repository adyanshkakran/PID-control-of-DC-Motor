function changeSlider(){
    let kp = document.getElementById("kp")
    
}

setTimeout(() => {
    location.href = '../../logout'
}, 15*60*1000);

let timeLeft = 15*60;
setInterval(() => {
    timeLeft--
    let min = Math.floor(timeLeft/60),sec = timeLeft%60;
    document.getElementById("time-left").innerHTML = `${min}:${sec}`
}, 1000);