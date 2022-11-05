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
    if(sec < 10)
        sec = "0"+sec
    if(min < 10)
        min = "0"+min
    document.getElementById("time-left").innerHTML = `${min}:${sec}`
}, 1000);