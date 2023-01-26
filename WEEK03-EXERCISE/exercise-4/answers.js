function mapToSquare (input) {
    // TODO ใช้ .map สร้าง array ที่เป็นเลขยกกำลังสองของ input
    return input.map(x => x * x)
}

function convertTemperature (input) {
    // TODO: ให้แปลงอุณหภูมิจาก °F เป็น °C โดยใช้ฟังก์ชัน .map()
    function fah_to_celsius (fah) {
        let cel = (fah - 32) * 5 / 9
        return Number(cel.toFixed(1))
    }
    return input.map(x => {
        x.temperature = fah_to_celsius(x.temperature)
        return x
    })
}

function filterEvenNumber (input) {
    // TODO: filter input เอาเลขคู่เท่านั้น
    return input.filter(x => x % 2 === 0)
}

function filterAgeRange (input) {
    // TODO: กรอง input.people ตามช่วงอายุ
    return input.people.filter(x => x.age >= input.min && x.age <= input.max)
}

function removeByFilter (input) {
    // TODO: ลบ Object ใน Array ด้วยการ filter
    return input.people.filter(x => x.id !== input.removeId)
}

function insertBySplice (input) {
    // TODO: ให้ใช้ฟังก์ชัน .splice() ในการ **แทรก (insert)** สมาชิกเข้าไปใน Array
    // เรียงลำดับตัวเลขให้ถูกต้อง
}

function removeBySplice (input) {
    // TODO: ให้ใช้ฟังก์ชัน .splice() ในการ **ลบ (remove)** สมาชิกออกจาก Array
    // เรียงลำดับตัวเลขให้ถูกต้อง
}

function replaceBySplice (input) {
    // TODO: ให้ใช้ฟังก์ชัน .splice() ในการ **เปลี่ยน (replace)** สมาชิกใน Array
    // เรียงลำดับตัวเลขให้ถูกต้อง
    input.splice(4, 1, 4)
    return input
}

function findAverage(input) {
    // TODO: ให้ใช้ฟังก์ชัน .map() และ/หรือ .filter() และ/หรือ .reduce() ในการหาค่าเฉลี่ยของตัวเลขทั้งหมดใน input
    // (ให้ถือว่า null, undefined, '' เป็น 0)
}