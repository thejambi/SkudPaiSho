import {
  signUpClicked,
  submitSignInClicked,
} from '../PaiShoMain';
import { getUsername, userIsLoggedIn } from '../UserData';

export function buildLoginModalContentElement() {
	// Create the container div
	const loginModalContentContainer = document.createElement('div');
	loginModalContentContainer.id = 'loginModalContentContainer';

	// Create the paragraph for login information
	const loginInfoParagraph = document.createElement('p');
	loginInfoParagraph.textContent =
		"To sign in, enter your username or email and password. ";

	// Create the sign-up link
	const signUpLink = document.createElement('span');
	signUpLink.className = 'clickableText';
	signUpLink.textContent = "Click here to sign up or sign in with email verification";
	signUpLink.onclick = () => signUpClicked(); // Add the onclick handler

	// Append the sign-up link to the paragraph
	loginInfoParagraph.appendChild(signUpLink);
	loginModalContentContainer.appendChild(loginInfoParagraph);

	// Create the center-aligned container
	const centerContainer = document.createElement('div');
	centerContainer.style.textAlign = 'center';

	// Create the table
	const table = document.createElement('table');
	table.style.margin = 'auto';

	// Create the first row (Username or Email)
	const row1 = document.createElement('tr');
	const row1Cell1 = document.createElement('td');
	row1Cell1.style.textAlign = 'right';
	row1Cell1.textContent = 'Username or Email:';
	const row1Cell2 = document.createElement('td');
	const usernameInput = document.createElement('input');
	usernameInput.id = 'usernameInput';
	usernameInput.type = 'text';
	usernameInput.name = 'usernameInput';
	row1Cell2.appendChild(usernameInput);
	row1.appendChild(row1Cell1);
	row1.appendChild(row1Cell2);

	// Create the second row (Password)
	const row2 = document.createElement('tr');
	const row2Cell1 = document.createElement('td');
	row2Cell1.style.textAlign = 'right';
	row2Cell1.textContent = 'Password:';
	const row2Cell2 = document.createElement('td');
	const passwordInput = document.createElement('input');
	passwordInput.id = 'userPasswordInput';
	passwordInput.type = 'password';
	passwordInput.name = 'userPasswordInput';
	row2Cell2.appendChild(passwordInput);
	row2.appendChild(row2Cell1);
	row2.appendChild(row2Cell2);

	// Append rows to the table
	table.appendChild(row1);
	table.appendChild(row2);

	// Append the table to the center container
	centerContainer.appendChild(table);

	// Create the button container
	const buttonContainer = document.createElement('div');

	// Create the sign-in button
	const signInButton = document.createElement('button');
	signInButton.type = 'button';
	signInButton.className = 'signupbutton';
	signInButton.textContent = 'Sign In';
	signInButton.onclick = () => submitSignInClicked(); // Add the onclick handler

	// Append the button to the button container
	buttonContainer.appendChild(signInButton);

	// Append the button container to the center container
	centerContainer.appendChild(buttonContainer);

	// Append the center container to the main container
	loginModalContentContainer.appendChild(centerContainer);

	// Append currently signed in as... section
	if (userIsLoggedIn()) {
		const spacer = document.createElement('br');
		loginModalContentContainer.appendChild(spacer.cloneNode());
		loginModalContentContainer.appendChild(spacer.cloneNode());
	
		const message = document.createElement('div');
		message.textContent = "You are currently signed in as " + getUsername();
		loginModalContentContainer.appendChild(message);
	}
	
	// Return element
	return loginModalContentContainer;

}
