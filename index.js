const header = document.querySelector("header");

window.addEventListener("scroll", function () {
    header.classList.toggle("sticky"), window.scrollY > 80;
})

const sr = ScrollReveal({
    origin: "top",
    distance: "85px",
    duration: 2500,
    reset: true
})

sr.reveal(".home-text", { delay: 300 });
sr.reveal(".home-img", { delay: 400 });
sr.reveal(".container", { delay: 300 });

sr.reveal(".about-img", {});
sr.reveal(".about-text", { delay: 300 });

sr.reveal(".middle-text", {});
sr.reveal(".row-btn,.shop-content", { delay: 300 });

sr.reveal(".review-content,.contact", { delay: 300 });



// BMI Calculator

window.onload = () => {

    let button = document.querySelector("#btn");

    button.addEventListener("click", calculateBMI);
};

function calculateBMI() {

    let height = parseInt(document
        .querySelector("#height").value);


    let weight = parseInt(document
        .querySelector("#weight").value);

    let result = document.querySelector("#result");


    if (height === "" || isNaN(height))
        result.innerHTML = "Provide a valid Height!";

    else if (weight === "" || isNaN(weight))
        result.innerHTML = "Provide a valid Weight!";


    else {
        let bmi = (weight / ((height * height)
            / 10000)).toFixed(2);


        if (bmi < 18.6) result.innerHTML =
            `Under Weight : <span>${bmi}</span>`;

        else if (bmi >= 18.6 && bmi < 24.9)
            result.innerHTML =
                `Normal : <span>${bmi}</span>`;

        else result.innerHTML =
            `Over Weight : <span>${bmi}</span>`;
    }
}




// Health API

let keyword = 'physical+activity'; 

function turnKeywordIntoHeaderTxt(keyword) {
	wordLength = keyword.length;
	let wordsArr = keyword.split("+");
	if (wordsArr.length > 1) {
		return createTitleFromMultipleWords(wordsArr);
	} else {
		let wOutFrstLetter = keyword.slice(1, wordLength);
		let firstLetter = keyword.slice(0, 1);
		firstLetter = firstLetter.toUpperCase();
		let wordWith1stLetterCap = firstLetter + wOutFrstLetter;
		return wordWith1stLetterCap;
	}
}

function createTitleFromMultipleWords(wordsArr) {
	let wordsMinusFrstLetter = [];
	let capFrstLettter = [];
	let wordsWithCapFrstLettter = [];

	for (let i = 0; i < wordsArr.length; i++) { 
	let wordLength = wordsArr[i];
	wordLength = wordLength.length;
	let wOutFrstLetter = wordsArr[i].slice(1, wordLength);
		wordsMinusFrstLetter.push(wOutFrstLetter); 
	}

	for (let word of wordsArr) {
	let cFrstLetter = word.slice(0, 1);
		cFrstLetter = cFrstLetter.toUpperCase();
		capFrstLettter.push(cFrstLetter);
	}

	for (let i = 0; i < wordsArr.length; i++) { 
	let wordWithFrstLetterCap = capFrstLettter[i] +
		wordsMinusFrstLetter[i];
		wordsWithCapFrstLettter.push(wordWithFrstLetterCap); 
	}
	let wordsUnitedIntoTitle = "";
	for (let i=0; i < wordsWithCapFrstLettter.length; i++) {
		if (i === 0) {
			wordsUnitedIntoTitle += wordsWithCapFrstLettter[i];
		} else {
			wordsUnitedIntoTitle = `${wordsUnitedIntoTitle} ${wordsWithCapFrstLettter[i]}`;
		}
	}
	return wordsUnitedIntoTitle;
}

let numOfContentDivs;

function populateWebPageWithServerData(jsonData) {
	const resource = jsonData.Result.Resources.Resource[0];
	let infoLinkURL = resource.AccessibleVersion;
	let imgURL = resource.ImageUrl;
	let title = resource.Title;
	let contentSections = resource.Sections.section;
	let h1 = document.createElement('h1');
	h1.innerText = title;
	h1.id = "contentTitle";
	document.body.appendChild(h1);

	let img = document.createElement("img");

	img.src = imgURL;
	/* 
		The line of code above is the equivalent of the following line of code:
		img.setAttribute("src", imgURL);
	*/

	img.id = "image";

	img.style.width = "25rem";
	/* 
		The line of code above is similar to the following; and produces almost the same effect:
		img.setAttribute("width", 400);
	*/

	document.body.appendChild(img);
	populateWebPageWithArticleTxt(contentSections);
	//console.log(resource);
	createLinkToArticleSource(infoLinkURL);
	
}

function populateWebPageWithArticleTxt(contentSections) {
	numOfContentDivs = contentSections.length;

	for (let i = 0; i < numOfContentDivs; i++) {			
		let div = document.createElement('div');
		div.id = `contentDiv${i}`;
		/* The code above is the same as the following: 
		div.setAttribute('id', `contentDiv${i}`);
		*/

		if (contentSections[i].Title !== null) {
			div.innerHTML = `<h2> ${contentSections[i].Title} </h2>`;
			div.innerHTML += contentSections[i].Content;
		} else {
			div.innerHTML = `<h2> ${turnKeywordIntoHeaderTxt(keyword)}: Overview </h2>`;
			div.innerHTML += contentSections[i].Content;
		}
		document.body.appendChild(div);
	}
}

function createLinkToArticleSource(linkURL) {
	let a = document.createElement('a'); 
	let link = document.createTextNode("Source");
	a.appendChild(link);
	a.title = "Link to the source of this content."; 
	a.href = linkURL;
	a.target = "_blank";
	a.id = "sourceLink";
	/* The code above is the same as the following: 
	a.setAttribute('title', 'Link to the source of this content.');
	a.setAttribute('href', infoLinkURL);
	a.setAttribute('target', '_blank')
	a.setAttribute('id', 'sourceLink');
	*/
	document.body.appendChild(a); 
}

function clearWebPageOfOldData() {
	let h1$ = document.getElementById('contentTitle');
	let img$ = document.getElementById('image');
	let a$ = document.getElementById('sourceLink');

	h1$.remove();
	img$.remove();

	for (let i = 0; i < numOfContentDivs; i++) {	
		let div$ = document.getElementById(`contentDiv${i}`);	
		document.body.removeChild(div$);
	}
	
	a$.remove();
}

function loadPageContent(keyword) {
	fetch(`https://health.gov/myhealthfinder/api/v3/topicsearch.json?keyword=${keyword}`)
	.then(function(response) {
		if (response.status == 200) {
			return response.json();
		}
		else {
			console.log("Whoops! There is a problem with connecting to the API! The problem is likely an error in the URL of the request.");
		}
	})
	.then(function(jsonData) {
		populateWebPageWithServerData(jsonData);
	})
	.catch(function(error) {
		console.log("There was a problem with getting data from the API in JSON format.", error);
	});
}

loadPageContent(keyword);

let select = document.getElementById('medKeyword');
select.addEventListener('change', (e) => {
	let newKeyword = e.target.value;
	clearWebPageOfOldData();
	loadPageContent(newKeyword);
});










/*
let menu = document.querySelector("#menu-icon");
let navlist = document.querySelector(".navlist");

menu.onclick = () => {
    menu.classList.toggle("bx-x");
    navlist.classList.toggle("open");
};

window.onscroll = () => {
    menu.classList.remove("bx-x");
    navlist.classList.remove("open");
};*/

