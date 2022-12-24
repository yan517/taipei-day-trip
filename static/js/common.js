function getUserStatus(cb,value){
	const status = async () => await fetch('http://18.181.123.151:3000/api/user/auth')
	.then((response)=>response.json())
	.then(((data) => {
        console.log(data);
		if(data["error"] || data["data"] == null){
			document.querySelector('#logout').style.display = 'none';
			document.querySelector('#loginSignup').style.display = 'block';	
            if(cb) window.location.href = "http://18.181.123.151:3000";	
		}
		else{
			document.querySelector('#logout').style.display = 'block';
			document.querySelector('#loginSignup').style.display = 'none';
            if(cb && value) 
                cb(value);
            else
                cb(data);
		}
	}));
	status();
}

const loginSignUp = document.getElementById('loginSignup');
loginSignUp.addEventListener('click', (event) =>{
	let x = document.querySelector('#signInFrame');
    let overlay = document.querySelector('#overlay');
    x.style.display = 'block';
    x.style.zIndex = "1";
    overlay.style.zIndex  = "1";
    overlay.style.display = 'block';
    if(document.querySelector('.welcome')) document.querySelector('.welcome').style.zIndex  = "0";
    if(document.querySelector('.slideshowSection')) document.querySelector('.slideshowSection').style.zIndex  = "0";  
})

const dialogClose = document.getElementById('dialogClose');
dialogClose.addEventListener('click', (event) =>{
    let x = document.querySelector('#signInFrame');
    let overlay = document.querySelector('#overlay');
    x.style.display = 'none';
    x.style.zIndex = "0";
    overlay.style.zIndex  = "0";
    overlay.style.display = 'none';
    if(document.querySelector('.welcome')) document.querySelector('.welcome').style.zIndex  = "1";
    if(document.querySelector('.slideshowSection')) document.querySelector('.slideshowSection').style.zIndex  = "1"; 
})

const signUp = document.getElementById('signUp');
signUp.addEventListener('click',(event) => {
    const name = document.querySelector('#signUpName');
    if(name.style.display == 'block'){
        name.style.display = 'none';
        document.getElementById('haveAcOrNot').textContent = "還沒有帳戶？";
        document.getElementById('signUp').textContent = "點此註冊";
        document.getElementById('titleOfDialog').textContent = "登入會員帳號";
        document.getElementById('loginBtn').textContent = "登入帳戶";
    }else{
        name.style.display = 'block';
        document.getElementById('haveAcOrNot').textContent = "已經有帳戶了？";
        document.getElementById('signUp').textContent = "點此登入";
        document.getElementById('titleOfDialog').textContent = "註冊會員帳號";
        document.getElementById('loginBtn').textContent = "註冊新帳戶";
    }
})

const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click',(event) => {
    let email  = document.querySelector('#email').value;
    let password  = document.querySelector('#password').value;
    let name = null;
    if (document.querySelector('#username').value)
        name = document.querySelector('#username').value;   
    const login = async () => await fetch('http://18.181.123.151:3000/api/user/auth',{
        method:'PUT',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"mail":email,"password":password})        
    }).then((response) => response.json())
    .then(data=>{
        if(data["ok"]){
            location.reload();
            return false;
        }else{
            document.querySelector('#loginMessage').textContent = data["message"];
            document.querySelector('#loginMessage').style.display = "block";
            document.querySelector('#loginMessage').style.color = 'red';
            setTimeout(function(){
                document.querySelector('#loginMessage').style.display = "none";
            }, 2000);
        }
    })
    const createAc = async () => await fetch('http://18.181.123.151:3000/api/user',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"name":name,"mail":email,"password":password})        
    }).then((response) => response.json())
    .then(data=>{
        if(data["ok"]){
            document.querySelector('#loginMessage').textContent = "申請成功";
            document.querySelector('#loginMessage').style.color = 'green';
            document.querySelector('#loginMessage').style.display = "block";
            document.querySelector('#email').value = "";
            document.querySelector('#password').value  = "";
            document.querySelector('#username').value  = "";
            setTimeout(function(){
                document.querySelector('#loginMessage').style.display = "none";
            }, 2000);            
        }else{
            document.querySelector('#loginMessage').textContent = data["message"];
            document.querySelector('#loginMessage').style.color = 'red';
            document.querySelector('#loginMessage').style.display = "block";
            document.querySelector('#email').value = "";
            document.querySelector('#password').value  = "";
            document.querySelector('#username').value  = "";
            setTimeout(function(){
                document.querySelector('#loginMessage').style.display = "none";
            }, 2000);
        }
    })
    if (name) 
        createAc();
    else 
        login(); 
})

const logout = document.getElementById('logout');
logout.addEventListener('click', (event) =>{
    const logO = async () => await fetch('http://18.181.123.151:3000/api/user/auth',{
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

const appointment = document.getElementById('appointment');
appointment.addEventListener('click', (event) =>{
    const status = () => fetch('http://18.181.123.151:3000/api/user/auth')
	.then((response)=>response.json())
	.then((data =>{
		if(data["error"] || data["data"] == null){
            const loginSignUp = document.getElementById('loginSignup');
            loginSignUp.click();
		}
		else{
			window.location.href = "http://18.181.123.151:3000/booking";
		}
	}));
	status();
})

function backTohomePage(){
    window.location.href = `http://18.181.123.151:3000/`;
}