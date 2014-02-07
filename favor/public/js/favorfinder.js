
function showFlyout() {
	if (window.getComputedStyle(document.getElementById("navbar-flyout")).display == 'none'){
		document.getElementById("navbar-flyout").style.display = 'inline-block';
	}
	else {
		document.getElementById("navbar-flyout").style.display = 'none';
	}	
}