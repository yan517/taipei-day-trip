let id;
let slideIndex = 0;
let imageArr = [];
let AttractionInfo;

getUserStatus(null,null);

function setId(value) {
    id = value;
}

function getId() {
    return id;
}

function setAttractionInfo(value) {
    AttractionInfo = value;
}

function getAttractionInfo() {
    return AttractionInfo;
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
        setAttractionInfo(result);
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

const startToBook = document.getElementById('startToBook');
startToBook.addEventListener('click', (event) =>{
    
    const status = () => fetch('http://18.181.123.151:3000/api/user/auth')
	.then((response)=>response.json())
	.then((data =>{
		if(data["error"] || data["data"] == null){
            const loginSignUp = document.getElementById('loginSignup');
            loginSignUp.click();
		}
		else{
            let bookingTime = "";
            let price;
            if (document.querySelectorAll(".radioBtn")[0].checked){
                price = "2000";
                bookingTime = document.querySelectorAll(".radioBtn")[0].value;
            }
            else {
                bookingTime = document.querySelectorAll(".radioBtn")[1].value;
                price = "2500";
            }
            let date = document.querySelector('input#planDate.datepicker').value;
            if (new Date(date) < Date.now()){
                alert("預約日期不能是過去");
            }else{
                let attractionInfo = getAttractionInfo();
                createBooking(attractionInfo["data"].id,date,bookingTime,price,data["data"].id,data["data"].email);
            }

		}
	}));
	status();
})

function createBooking(attractionId,date,bookingTime,price,userId,email){
    const create = async () => await fetch('http://18.181.123.151:3000/api/booking',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"attractionId":attractionId,"date":date, "bookingTime":bookingTime,"price":price,"userId":userId,"email":email})        
    }).then((response) => response.json())
    .then(data=>{
        if(data["ok"]){
            window.location.href = "http://18.181.123.151:3000/booking";
        }else{
            alert(data["message"]);
        }
    })
    create();
}
