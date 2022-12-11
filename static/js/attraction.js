let id;
let slideIndex = 0;
let imageArr = [];


function setId(value) {
    id = value;
}

function getId() {
    return id;
}

const attractionData = (id) => fetch(`http://18.181.123.151:3000/api/attraction/${id}`)
    .then((response)=>response.json())

async function getArractionsData(id) {
    let result = null;
    try{
        result = await attractionData(id);
        imageArr = result.data.images;
        console.log(imageArr);
        createPicSection(result.data);
        
        console.log(result);
    }catch(err){
        console.log(err);
    }
}

function createPicSection(result){
    document.querySelector('input#planDate.datepicker').dataset.dateFormat = 'YYYY-MM-DD';
    let sliderSection = document.getElementById("slideImg");
    sliderSection.src = result.images[slideIndex];
    sliderSection.classList.add("fade");
    let name = document.getElementById("name");
    name.textContent = result.name;
    let transport = document.getElementById("transport");
    transport.textContent = result.transport;
    let categoryMrt = document.getElementById("categoryMrt");
    categoryMrt.textContent = result.category + " " + result.mrt;
    let dotSection = document.getElementById("dotSection");
    let address = document.getElementById("address");
    address.textContent = result.address;
    let description = document.getElementById("description");
    description.textContent = result.description;
    for (let i = 0; i < imageArr.length; i++) {
        const element = document.createElement("span");
        element.className = "dot";
        element.setAttribute("onclick", `currentSlides(${i})`);
        dotSection.appendChild(element);
    }
    let dots = document.getElementsByClassName("dot");
    dots[slideIndex].className += " active";
}

function currentSlides(n) {
    showSlides(slideIndex = n);
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    let slides = document.getElementById("slideImg");
    slides.style.display = "none";
    let sliderSection = document.getElementById("slideImg");
    if (slideIndex >= imageArr.length){
        slideIndex = 0;
    }else if (slideIndex < 0){
        slideIndex = imageArr.length -1;
    }
    let dots = document.getElementsByClassName("dot");
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    sliderSection.src = imageArr[slideIndex];
    dots[slideIndex].className += " active";
    setTimeout(function () {
        slides.style.display = "block";
    }, 0.01);
}

let radiobtn = document.querySelectorAll('input[name="radioGp"]');

for (let i = 0; i < radiobtn.length; i++) {
    radiobtn[i].addEventListener("click", function() {
        if (radiobtn[i].value == "上半天")
            document.querySelector("#price").textContent = "2000";
        else
            document.querySelector("#price").textContent = "2500";
    });
}

function backTohomePage(){
    window.location.href = `http://18.181.123.151:3000/`;
}
