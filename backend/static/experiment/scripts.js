function changeSlider(){
    let kp = document.getElementById("kp")
    
}

setTimeout(() => {
    location.href = '../../logout'
}, parseInt(localStorage.getItem("timeLeft"))*1000);

function updateTime() {
    timeLeft = parseInt(localStorage.getItem("timeLeft"))
    if(!isNaN(timeLeft)){
        timeLeft--
        let min = Math.floor(timeLeft/60),sec = timeLeft%60;
        if(sec < 10)
            sec = "0"+sec
        if(min < 10)
            min = "0"+min
        document.getElementById("time-left").innerHTML = `${min}:${sec}`
        localStorage.setItem("timeLeft",timeLeft)
    }else{
        localStorage.setItem("timeLeft","900")
        document.getElementById("time-left").innerHTML = `15:00`
    }
}

updateTime()
setInterval(updateTime, 1000);