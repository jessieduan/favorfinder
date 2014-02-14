'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	$('.btn-group').button();
	$('#inbox').button('toggle');
	$("[name='my-checkbox']").bootstrapSwitch();
	$("[name='my-checkbox']").bootstrapSwitch('size', 'small');
	$("[name='my-checkbox']").bootstrapSwitch('onColor', 'success');
	$("[name='my-checkbox']").bootstrapSwitch('offColor', 'danger');
	$("[name='my-checkbox']").bootstrapSwitch('onText', "<span class='glyphicon glyphicon-ok'></span>");
	$("[name='my-checkbox']").bootstrapSwitch('offText', "<span class='glyphicon glyphicon-minus'></span>");

});

/*
 * Function that is called when the document is ready.
 */
function initializePage() {

	// $('a.friend-link').click(function(e) {
	// 	e.preventDefault();
	// });
}