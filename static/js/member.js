let loader = document.getElementById("preloader");
window.addEventListener("load",()=>{
    loader.style.display = "none";
})

const getOrders = async (value)=> {
    if(value){
        let userName = document.querySelector("#display_name");
        let userEmail = document.querySelector("#display_email");
        userid = value["data"].id;
        userName.textContent = value["data"].name;
        userEmail.textContent = value["data"].email;
        fetch(`/api/ordered?id=${userid}`)
        .then((response)=>response.json())
        .then((data)=> {
            let order_table = document.querySelector(".order-container");
            if (data.data != null){
                document.querySelector("#noOrders").style.display = "none";
                result = data.data;
                for (let i = 0; i<result.length; i++){
                    console.log(result[i]);
                    let aTag = document.createElement("a");
                    aTag.href = `/thankyou?number=${result[i].order_number}`;
                    aTag.textContent = result[i].order_number;
                    aTag.className = "order-item";
                    order_table.appendChild(aTag);

                    let order_by = document.createElement("div");
                    order_by.className = "order-item";
                    order_by.textContent = result[i].name;
                    order_table.appendChild(order_by);
                    let phone = document.createElement("div");
                    phone.className = "order-item";
                    phone.textContent = result[i].phone;
                    order_table.appendChild(phone);
                    let status = document.createElement("div");
                    status.className = "order-item";
                    if (result[i].status === 0) status.textContent = "成功";
                    else status.textContent = "失敗";
                    order_table.appendChild(status);
                }
            }else{
                document.querySelector("#noOrders").style.display = "block";
            }
        });
    }else{
        window.location.href = `/`;
    }
}
getUserStatus(getOrders,null);

const logout = document.getElementById('logout');
logout.addEventListener('click', (event) =>{
    const logO = async () => await fetch(`/api/user/auth`,{
        method:'DELETE' 
    }).then((response) => response.json())
    .then(data=>{
        if(data["ok"]){
            location.reload();
            return false;
        }
    })
	logO();
})