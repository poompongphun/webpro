// ข้อ 2.1
function addEvent() {
  /*
    TODO
     1. สร้าง function สำหรับ callback
     2. Get Element ที่ต้องการจะเพิ่ม Event
     3. Add Event ให้ Element
     4. ใส่ callback function ให้ Event
    ตัวช่วย
    https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    */
  const div = document.getElementById("event_init");
  div.addEventListener("click", () => {
    alert(div.innerHTML);
  });
}

// ข้อ 2.2
function start() {
  // hint: ส่ง callback function เข้าไปเป็น argument ของ setTimeout()
  const start = document.getElementById("start");
  const process = document.getElementById("process");
  const end = document.getElementById("end");
  start.innerHTML = "Program started";
  setTimeout(() => {
    process.innerHTML = "Hello World";
    setTimeout(() => {
      end.innerHTML = "Program ended";
    }, 3000);
  }, 2000);
}

// ข้อ 2.3
function stopTime() {
  let time = document.getElementById("Time").value;
  const minute = document.getElementById("setMinute");
  const second = document.getElementById("setSecond");
  const setTime = () => {
    const hr = "" + Math.floor(time / 60);
    const sc = "" + (time % 60);
    const pad = "00";
    minute.innerHTML = pad.substring(0, pad.length - hr.length) + hr;
    second.innerHTML = pad.substring(0, pad.length - sc.length) + sc;
  };
  setTime();
  let timer = setInterval(() => {
    console.log("hhi");
    if (time > 0) {
      time--;
      setTime();
      clearInterval(timer);
    }
  }, 1000);
}

// ข้อ 2.4
function getDogDemo(url = "https://dog.ceo/api/breeds/image/random") {
  // hint: เรียกใช้ getAPI() โดยดึงข้อมูลจาก url = https://dog.ceo/api/breeds/image/random
  // ลอง console.log() ดูว่าข้อมูลที่ได้มาเป็นอย่างไร
  let image = "";
  const img = document.getElementById("dogImg");
  const time = document.getElementById("dogTime");
  getAPI(url, (res) => {
    image = res.message;
  });
  let count = 10;
  let timer = setInterval(() => {
    if (count > 0) {
      count--;
      time.innerHTML = count;
    }
    if (count == 0) {
      img.src = image;
      clearInterval(timer);
    }
  }, 1000);
  //   getAPI()
}

// ข้อ 2.5
function Rainbow() {
  //TODO
  // 1. ทำการเช็ค Error ว่ามาจาก State ใด
  // 2. ให้แสดงชื่อ State ในกล่องข้อความเมื่อเกิด Error
  // 3. เปลี่ยนสีข้อความเป็นสีแดงเมื่อเกิด Error

  const colors = [
    "has-text-primary",
    "has-text-success",
    "has-text-warning",
    "has-text-danger",
  ];

  const animateAll = (callbackFunct) => {
    const rainbow = document.getElementById("rainbow");
    const ErrText = (text) => {
      rainbow.innerHTML = text;
      rainbow.classList.add(colors[3]);
    };
    setTimeout(() => {
      //State1 ใช้ try catch
      try {
        callbackFunct(colors[0]);
        console.log("Pass State1");
        setTimeout(() => {
          //State2 ใช้ try catch
          try {
            callbackFunct(colors[1]);
            console.log("Pass State2");
            setTimeout(() => {
              //State3 ใช้ try catch
              try {
                callbackFunct(colors[2]);
                console.log("Pass State3");
              } catch (error) {
                ErrText("State 3")
              }
            }, 1000);
          } catch (error) {
            ErrText("State 2")
          }
        }, 1000);
      } catch (error) {
        ErrText("State 1")
      }
    }, 1000);
  };

  animateAll(changeText);
}

function changeText(word) {
  const num = Math.floor(Math.random() * 10);
  const rainbow = document.getElementById("rainbow");
  if (num > 6) {
    rainbow.innerText = num;
    rainbow.className = word;
  } else {
    throw new Error("Error");
  }
}

// ฟังก์ชันเรียก API
function getAPI(url, success, error) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const res = JSON.parse(this.response);
      success(res);
    } else if (this.readyState == 4) {
      const res = JSON.parse(this.response);
      error(res);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.send();
}
