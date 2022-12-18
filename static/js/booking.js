setTimeout(function () {
    const getBookingAttractions = async ()=> {
        value = getUserInfo();
        console.log(value);
        if(value){
            let userEmail = value["data"].email;
            let userid = value["data"].id;
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
                    createBookingSection(data,userEmail,userid,userName);
                }
                    
            });
        }else{
            window.location.href = "http://18.181.123.151:3000";
        }
    }
    getBookingAttractions();
    
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
        let totalPrice = document.getElementById("totalPrice");
        totalPrice.textContent = sum;
    }
},1000);