// ข้อ 3.1
function evenNumber(num) {
  // hint : ทำการสร้าง promise และเรียกใช้
  const checkEven = (number) =>
    new Promise((resolve, reject) => {
      if (num % 2 == 0) {
        resolve(`success : ${number} is an even number`);
      } else {
        reject(`Error : ${number} is not an even number`);
      }
    });

  const result = document.getElementById("result");
  checkEven(num)
    .then((res) => (result.innerHTML = res))
    .catch((err) => (result.innerHTML = err));
}

// 3.2
function task(id) {
  const delay = parseInt(Math.random() * 1000);
  // return promise
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (delay < 500) {
        resolve(`task ${id}: ${delay}ms ... PASS!`);
      } else {
        reject(`task ${id}: ${delay}ms ... NOTPASS!`);
      }
    }, delay);
  });
}

function tester() {
  // hint : task(1).then().catch() ..... task(4)...
  // ต้องเรียก function task 4 ครั้ง เปลี่ยน id ไปเรื่อยๆ
  for (let i = 0; i < 4; i++) {
    task(i)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
}

// ข้อ 3.3
// hint : เรียก getAPI() ที่ url = https://api.thecatapi.com/v1/images/search
// อย่าลืม console.log() ดูข้อมูลที่ได้ด้วยว่ามีโครงสร้างแบบใด
function checkAuth(password) {
  return new Promise((resolve, reject) =>
    password == "Cisco" ? resolve("รหัสผ่านถูกต้อง") : reject("รหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง")
  );
}

function fetchData(password) {
  checkAuth(password)
    .then((res) => {
      alert(res);
      getAPI("https://api.thecatapi.com/v1/images/search", (res) => {
        document.getElementById("cat").src = res[0].url;
      });
    })
    .catch((err) => alert(err));
}

// GET API
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
