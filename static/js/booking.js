let attraction;
let userid;
function setBookingAttractionsData(data){
    attraction = data;
}

let loader = document.getElementById("preloader");
window.addEventListener("load",()=>{
    loader.style.display = "none";
})

const getBookingAttractions = async (value)=> {
    console.log(value);
    if(value){
        let userEmail = value["data"].email;
        userid = value["data"].id;
        let userName = value["data"].name;
        fetch(`http://18.181.123.151:3000/api/booking?userId=${userid}`)
        .then((response)=>response.json())
        .then((data)=> {
            console.log(data);
            
            let userNameDiv = document.getElementById("userName");
            let allBookingInfo = document.querySelector("#allBookingInfo");
            let footer = document.querySelector(".footer");
            if('error' in data){
                userNameDiv.textContent = userName;
                allBookingInfo.style.display = 'none';
                noRecord.style.display = 'block';
                footer.style.height = "100%";
            }
            else{
                allBookingInfo.style.display = 'block';
                noRecord.style.display = 'none';
                footer.style.height = "104px";
                setBookingAttractionsData(data["data"]);
                createBookingSection(data,userEmail,userid,userName);
            }
        });
    }else{
        window.location.href = "http://18.181.123.151:3000";
    }
}
let value = getUserStatus(getBookingAttractions,null);

function createBookingSection(data,userEmail,userid,userName){
    let item = data["data"];
    let sum = 0;
    for (let i = 0; i < item.length; i++) {
        let userNameDiv = document.getElementById("userName");
        userNameDiv.textContent = userName;
        let bookingSections = document.getElementById("bookingSection");
        let section = document.createElement("div");
        section.className = "bookingAttrSection";

        let left = document.createElement("div");
        let img = document.createElement("img");
        img.className = "bookingAttrImg";
        img.src = item[i].attraction.image;
        left.appendChild(img);

        let middle = document.createElement("div");
        let paraName = document.createElement("div");
        paraName.className = "paraName";
        paraName.textContent = "台北一日遊： " + item[i].attraction.name;
        middle.appendChild(paraName);
        let sameSty = document.createElement("div");
        sameSty.className = "sameSty";
        let paraDate = document.createElement("p");
        paraDate.className = "paraMargin";
        paraDate.innerHTML = "<span style='font-weight: 700;'>日期： </span>" + new Date(item[i].date).toISOString().slice(0, 10);
        sameSty.appendChild(paraDate);
        let paraTime = document.createElement("p");
        paraTime.className = "paraMargin";
        if(item[i].time == "上半天")
            paraTime.innerHTML = "<span style='font-weight: 700;'>時間：</span> 早上 9 點到下午 4 點";
        else
            paraTime.innerHTML = "<span style='font-weight: 700;'>時間：</span> 下午 1 點到下午 9 點";
        sameSty.appendChild(paraTime);    
        let paraPrice = document.createElement("p");
        paraPrice.className = "paraMargin";
        paraPrice.innerHTML = "<span style='font-weight: 700;'>費用：</span> " + item[i].price;
        sum += parseInt(item[i].price);
        sameSty.appendChild(paraPrice);   
        let paraAddress = document.createElement("p");
        paraAddress.className = "paraMargin";
        paraAddress.innerHTML = "<span style='font-weight: 700;'>地點： </span>" + item[i].attraction.address;
        sameSty.appendChild(paraAddress); 
        middle.appendChild(sameSty);


        let right = document.createElement("div");
        right.className = "alignBookingItem";
        let deleteBtn = document.createElement("button");
        deleteBtn.className ="bookingDeleteBtn";
        deleteBtn.addEventListener("click", ()=>{
            const deleteBookingItem = async () => await fetch('http://18.181.123.151:3000/api/booking',{
                method:'DELETE',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"bookingId":item[i].bookingId,"email":userEmail,"userId":userid})                     
            }).then((response) => response.json())
            .then(data=>{
                if(data["ok"]){
                    window.location.href = "http://18.181.123.151:3000/booking";
                }
            })
            deleteBookingItem();
        })            
        right.appendChild(deleteBtn);
        section.appendChild(left);
        section.appendChild(middle);
        section.appendChild(right);
        let separateLine = document.createElement("div");
        separateLine.className = "bookingSeparateLine";
        bookingSections.appendChild(section);
        bookingSections.appendChild(separateLine);
    }
    let contactName = document.querySelector("#contactName");
    contactName.value = userName;
    let contactEmail = document.querySelector("#contactEmail");
    contactEmail.value = userEmail;
    let totalPrice = document.getElementById("totalPrice");
    totalPrice.textContent = sum;
}

let confrimButton = document.getElementById('confrimBtn');
const confrimBtn = document.getElementById('confrimBtn');
confrimBtn.addEventListener('click', (event) => {
    event.preventDefault()

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    console.log(tappayStatus);
    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('can not get prime')
        return
    }

    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            alert('get prime error ' + result.msg)
            return
        }
        let prime = result.card.prime;
        let totalPrice = document.querySelector('#totalPrice').textContent;
        let contactName = document.querySelector('#contactName').value;
        let contactEmail = document.querySelector('#contactEmail').value;
        let phone = document.querySelector('#phone').value;
        if(contactName&&contactEmail&&phone)
            pay(prime,userid,totalPrice,attraction,contactName,contactEmail,phone);
        else
            alert('姓名/電郵/手機號碼不能空白')
        // send prime to your server, to pay with Pay by Prime API .
        // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    })
})       

function pay(prime,user_id,totalPrice,attraction,contactName,contactEmail,phone){
    const create = async () => await fetch('http://18.181.123.151:3000/api/orders',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "prime": prime,
            "user_id": user_id,
            "order":{
                "price": totalPrice,
                "trips": {
                    attraction
                },
                "contact": {
                    "name": contactName,
                    "email": contactEmail,
                    "phone": phone
                }
            }
        })  
    }).then((response) => response.json())
    .then(data=>{
        if (data["data"]){
            window.location.href = `http://18.181.123.151:3000/thankyou?number=${data["data"].number}`;
        }else{
            alert(data["message"])
            window.location.href = "http://18.181.123.151:3000";
        }
    })
    create();
}

//-------------------TapPay API-------------------
// Display ccv field
let fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'ccv'
    }
}

TPDirect.card.setup({
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
    }
})

TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        confrimButton.removeAttribute('disabled')
    } else {
        // Disable submit Button to get prime.
        confrimButton.setAttribute('disabled', true)
    }

    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
    if (update.cardType === 'visa') {
        // Handle card type visa.
    }

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        //setNumberFormGroupToError()
    } else if (update.status.number === 0) {
        //setNumberFormGroupToSuccess()
    } else {
        //setNumberFormGroupToNormal()
    }

    if (update.status.expiry === 2) {
        //setNumberFormGroupToError()
    } else if (update.status.expiry === 0) {
        //setNumberFormGroupToSuccess()
    } else {
        //setNumberFormGroupToNormal()
    }

    if (update.status.ccv === 2) {
        //setNumberFormGroupToError();
    } else if (update.status.ccv === 0) {
        //setNumberFormGroupToSuccess();
    } else {
        //setNumberFormGroupToNormal();
    }
})