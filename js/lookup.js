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
	let contentPart1 = document.getElementById('contentDiv');
	const resource = jsonData.Result.Resources.Resource[0];
	let infoLinkURL = resource.AccessibleVersion;
	let imgURL = resource.ImageUrl;
	let title = resource.Title;
	let contentSections = resource.Sections.section;
	let h1 = document.createElement('h1');
	h1.innerText = title;
	h1.id = "contentTitle";
	contentPart1.appendChild(h1);
	//document.body.appendChild(h1);

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

	//document.body.appendChild(img);
	contentPart1.appendChild(img);
	document.body.appendChild(contentPart1);
	populateWebPageWithArticleTxt(contentSections);
	//console.log(resource);
	createLinkToArticleSource(infoLinkURL);
	
}

function styleAndAppendDiv(div) {
	document.body.appendChild(div);
	div.style.width = '100%';
	div.style.maxWidth = '900px';
	div.style.margin = '2.5em auto';
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
		styleAndAppendDiv(div);
	}
}

function createLinkToArticleSource(linkURL) {
	let div = document.createElement('div');
	div.id = 'linkContainer';
	let a = document.createElement('a'); 
	let link = document.createTextNode("Source");
	a.appendChild(link);
	a.title = "Link to the source of this content."; 
	a.href = linkURL;
	a.target = "_blank";
	a.id = "sourceLink";
	div.appendChild(a);
	styleAndAppendDiv(div);
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
