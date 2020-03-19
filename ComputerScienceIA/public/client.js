function addChild(){  /// User-defined methods
	let childForm = document.getElementsByClassName("child")[0];
	let childFormCopy = childForm.cloneNode(true);
	let fullForm = document.getElementById("fullForm");
	// let body = document.getElementsByTagName("body");
	let buttonNode = document.getElementById("addChildBtn");
	fullForm.insertBefore(childFormCopy, buttonNode);
	
	document.getElementById("childTotal").value++;
	let childFormCopyElements = childFormCopy.getElementsByTagName("input");
	let childFormCopyArray = Array.prototype.slice.call(childFormCopyElements);
	childFormCopyArray.forEach(incrementName);
	childFormCopyArray.forEach(clearValue);
	
	let br150 = document.createElement("br");
	br150.className = "br150";
	fullForm.insertBefore(br150, buttonNode);

	br150.style.lineHeight="150px";
    // console.log("addChild() completed");
}
function removeLastChild(){
	if (document.getElementById("childTotal").value >= 2){
		let removeIndex = document.getElementById("childTotal").value - 1;
		let fullForm = document.getElementById("fullForm");
		fullForm.removeChild(fullForm.getElementsByClassName("child")[removeIndex]);
		let brTotal = fullForm.getElementsByClassName("br150").length;
		fullForm.removeChild(fullForm.getElementsByClassName("br150")[brTotal - 1]);

		document.getElementById("childTotal").value--;
	}
}

function incrementName(inputElement){
	inputElement.name += document.getElementById("childTotal").value;  // As a string
}
function clearValue(inputElement){
	inputElement.value = "";
}

function areAllPhonesValid(){
	let phoneNumNodes = document.querySelectorAll("input[type=tel]");
	for (let i = 0; i < phoneNumNodes.length; i++){  /// Searching
		if (!isPhoneValid(phoneNumNodes[i].value)){
			let nodeClass = phoneNumNodes[i].parentNode.parentNode.className;
			let phoneType = phoneNumNodes[i].previousSibling.previousSibling.innerHTML;
			alert(capitalizeFirstLetter(nodeClass) + " " + capitalizeFirstLetter(phoneType) + " needs exactly 10 digits");
			return false;
		}
	}
	console.log("Test 3");
	return true;
}

function isPhoneValid(phoneNum){  /// User-defined methods with appropriate return values
	phoneNum = phoneNum.replace(/\D/g, "");
	console.log("New phone #: " + phoneNum);
	let re = /^\d{10}$/;
	// let re = new RegExp("^\d{10}$");
	console.log(re.test(phoneNum));
	return re.test(phoneNum);
}

function capitalizeFirstLetter(s){
	if (typeof s != "string" || s.length == 0){
		return "";  /// Use of sentinels or flags
	}
	return s.charAt(0).toUpperCase() + s.substring(1);
}