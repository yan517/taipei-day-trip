let nextPage = -1;
const loadingObserver = document.querySelector('.footer')
let page = 0
let keyword;
let notloading = true;

//--------------------------------- Load More ----------------------------------
const callback = async ([entry]) => {
	if (page == null || !notloading) {
		return;
	};
	if (entry && entry.isIntersecting) {
		let result = null;
		if(keyword){
			try{
				result = await loadMoreArractionsDatabyCategory(keyword,page);
				page =  result.nextPage;
				result =  result.data;
				create(result);	
			}catch(err){
				console.log(err);
			}
		}
		else
			getPageArractionsData(page);
	}
} 
let observer = new IntersectionObserver(callback)
observer.observe(loadingObserver)

const loadMoreArractionsDatabyCategory = (category,page) => fetch(`http://18.181.123.151:3000/api/attractions?page=${page}&keyword=${category}`)
.then((response)=> response.json())

const getArractionsData = page => fetch('http://18.181.123.151:3000/api/attractions?page='+page)
	.then((response)=> response.json())

async function getPageArractionsData(pageNum) {
	let result = null;
	try{
		result = await getArractionsData(pageNum);
		page = result.nextPage;
		result = result.data;
		create(result);
	}catch(err){
		console.log(err);
	}
}

//--------------------------------- Fectch Category Data ----------------------------------
const categoryData = () => fetch('http://18.181.123.151:3000/api/categories')
	.then((response) => response.json())

async function getcategoryData() {
	let result = null;
	try{
		result = await categoryData();
		result = result.data;
		createCategoryItem(result);
	}catch(err){
		console.log(err);
	}
}
getcategoryData();

//--------------------------------- Search By Keyword ----------------------------------
const getArractionsDatabyCat = (category) => fetch(`http://18.181.123.151:3000/api/attractions?page=0&keyword=${category}`)
.then((response)=> response.json())

async function searchByCategory(){
	page = 0;
	notloading = false;
	const e = document.querySelectorAll('.grid-item-4');
	e.forEach((element)=>{
		element.remove();
	})
	keyword = document.querySelector('#attractionsSearch').value;
	 let result = null;
	try{
		result = await getArractionsDatabyCat(keyword);
		page = result.nextPage;
		
		result = result.data;
		create(result);
		notloading = true;
	}catch(err){
		console.log(err);
	} 
}

//--------------------------------- Create Category Menu ----------------------------------
function createCategoryItem(result){
	for (let i = 0; i < result.length; i++){
		let category = result[i];
		let memu = document.getElementById("categoryMenu");
		let btnDiv = document.getElementById("catbtnDiv");
		let catBtn = document.createElement("button");
		catBtn.textContent = category;
		catBtn.className = "categoryBtn";
		btnDiv.appendChild(catBtn);
		memu.appendChild(btnDiv);
	}
}

//--------------------------------- Create Attractions info ----------------------------------
function create(result){
	if (result.length == 0) document.querySelector('#noData').style.display = "block";
	else document.querySelector('#noData').style.display = "none";
	
	for (let i = 0; i < result.length; i++){
		let fileUrl = result[i].images[0];
		createLargerDom(result[i].name, result[i].mrt, fileUrl, result[i].category);
	}
}

function createLargerDom(name,mrt,url,category){
	let row = document.getElementById("largerCon");
	let lgDiv = document.createElement("div");
	lgDiv.className = "grid-item-4";
	let lgimg = document.createElement('img');
	lgimg.src = url;
	let textDiv = document.createElement("div");
	textDiv.className = "titleSty";
	let lgtext = document.createElement('span');
	let cat = document.createElement('span')
	let namespan = document.createElement('span');
	let namesp = document.createElement('span');
	namesp.className = "namespan";
	namesp.textContent = name;
	namespan.className = "spanblk";
	namespan.appendChild(namesp);
	row.appendChild(lgDiv);
	lgtext.textContent = mrt;
	cat.textContent = category;
	textDiv.appendChild(lgtext);
	textDiv.appendChild(cat);
	lgDiv.appendChild(lgimg);
	lgDiv.appendChild(namespan);
	lgDiv.appendChild(textDiv);
}

//--------------------------------- Toggle Category Menu ----------------------------------
function searchClick(){
	let appear = document.querySelector('#categoryMenu').style.display;
	if(appear == 'block')
		document.querySelector('#categoryMenu').style.display = "none";
	else
		document.querySelector('#categoryMenu').style.display = "block";
}

//--------------------------------- Close Category Menu ----------------------------------
window.addEventListener('mouseup', function(e) {
    let x = document.querySelector('#categoryMenu');
    if (e.target != x && e.target.parentNode != x) {
        x.style.display = "none";
    }
});

//--------------------------------- Place Category Text on Input ----------------------------------
const allCatBtn = document.getElementById('catbtnDiv');
allCatBtn.addEventListener('click', (event) => {
  const isButton = event.target.nodeName === 'BUTTON';
  if (!isButton) {
    return;
  }
  document.querySelector('#attractionsSearch').value = event.target.innerText;
})

//--------------------------------- (Search) Listin Enter Event ----------------------------------
 document.getElementById("attractionsSearch")
 .addEventListener("keyup", function(event) {
 event.preventDefault();
 if (event.keyCode === 13) {
	searchByCategory();
	document.querySelector('#categoryMenu').style.display = "none";
 }
});