let number;

function setNumber(num) {
    number = num;
}

function getNumber() {
    return number;
}

const orderData = (number) => fetch(`http://18.181.123.151:3000/api/order/${number}`)
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
            document.querySelector("#display").style.display = 'block';
            document.querySelector("#noThisOrder").style.display = 'none';
            let status = result.data.status;
            if (status == 0) document.querySelector('#successOrNot').textContent = "行程預定成功"
            else document.querySelector('#successOrNot').textContent = "行程預定失敗" 
        }
    }catch(err){
        console.log(err);
    }
}