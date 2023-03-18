let number;
function setNumber(num) {
    number = num;
}

function getNumber() {
    return number;
}

const orderData = (number) => fetch(`/api/order/${number}`)
    .then((response)=>response.json())

async function getOrderData(number) {
    console.log(number);
    let result = null;
    try{
        result = await orderData(number);
        if (result["data"] == null){
            document.querySelector("#display").style.display = 'none';
            document.querySelector("#noThisOrder").style.display = 'block';
        }
        else{
            console.log(result);
            document.querySelector("#display").style.display = 'block';
            document.querySelector("#noThisOrder").style.display = 'none';
            let status = result.data.status;
            if (status == 0) document.querySelector('#successOrNot').textContent = "行程預定成功"
            else document.querySelector('#successOrNot').textContent = "行程預定失敗" 
            document.querySelector("#contact-name").textContent = result.data.contact.name;
            document.querySelector("#contact-phone").textContent = result.data.contact.phone;
            document.querySelector("#contact-email").textContent = result.data.contact.email;
            let details = document.getElementById("details");
            for (let index = 0; index < result.data.trip.length; index++) {
                let section_name = document.createElement("div");
                section_name.textContent = index+1 + " - " + result.data.trip[index].attraction.name;
                let section_date = document.createElement("div");
                section_date.textContent = new Date(result.data.trip[index].date).toISOString().slice(0, 10);
                let section_time = document.createElement("div");
                let section_price = document.createElement("div");
                if(result.data.trip[index].time == "上半天"){
                    section_time.textContent = "早上 9 點到下午 4 點";
                    section_price.textContent = "2000";
                }
                else{
                    section_time.textContent = "下午 1 點到下午 9 點";
                    section_price.textContent = "2500";
                }
                details.appendChild(section_name);
                details.appendChild(section_date);
                details.appendChild(section_time);
                details.appendChild(section_price);
            }
            let space1 = document.createElement("div");
            space1.className = "thankyouPage-totalPrice";
            let space2 = document.createElement("div");
            space2.className = "thankyouPage-totalPrice";
            let total_price_name = document.createElement("div");
            total_price_name.textContent = "總額"
            total_price_name.className = "thankyouPage-totalPrice";
            let total_price = document.createElement("div");
            total_price.textContent = result.data.price;
            total_price.className = "thankyouPage-totalPrice";
            details.appendChild(space1);
            details.appendChild(space2);
            details.appendChild(total_price_name);
            details.appendChild(total_price);
        }
    }catch(err){
        console.log(err);
    }
}