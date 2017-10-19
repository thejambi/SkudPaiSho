$(function() {
	// Validate the contact form
  $('#contactform').validate({
  	// Specify what the errors should look like
  	// when they are dynamically added to the form
  	errorElement: "span",
  	wrapper: "span",
  	errorPlacement: function(error, element) {
  		error.insertBefore( element.parent().parent() );
  		error.wrap("<span class='error'></span>");
  		$("<span></span>").insertBefore(error);
  	},
  	
  	// Add requirements to each of the fields
  	rules: {
  		toEmail: {
  			required: true,
  			email: true
  		},
  		fromEmail: {
  			required: true,
  			email: true
  		},
  		message: {
  			required: true
  		}
  	},
  	
  	// Specify what error messages to display
  	// when the user does something horrid
  	messages: {
  		toEmail: {
  			required: "No toEmail found.",
  			email: "toEmail not valid."
  		},
      fromEmail: {
        required: "No fromEmail found.",
        email: "fromEmail not valid."
      },
  		message: {
  			required: "No message to send."
  		}
  	},
  	
  	// Use Ajax to send everything to processForm.php
  	submitHandler: function(form) {
  		$("#send").attr("value", "Sending...");
  		$(form).ajaxSubmit({
        target: "#response",
  			success: function(responseText, statusText, xhr, $form) {
  				//$(form).hide();
          $(form).addClass('gone'); 
  				$("#response").html(responseText).hide().slideDown("fast");
  			}
  		});
  		return false;
  	}
  });
});