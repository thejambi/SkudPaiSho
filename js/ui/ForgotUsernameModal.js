import { forgotUsernameClicked } from '../PaiShoMain';

export function buildForgotUsernameModalContentElement() {
	const container = document.createElement('div');
	container.id = 'forgotUsernameModalContentContainer';

	const description = document.createElement('p');
	description.textContent = "Enter your email address or username and we'll send your username to the associated email.";
	container.appendChild(description);

	const centerContainer = document.createElement('div');
	centerContainer.style.textAlign = 'center';

	const table = document.createElement('table');
	table.style.margin = 'auto';

	const row = document.createElement('tr');
	const labelCell = document.createElement('td');
	labelCell.style.textAlign = 'right';
	labelCell.textContent = 'Email or Username:';
	const inputCell = document.createElement('td');
	const input = document.createElement('input');
	input.id = 'forgotUsernameInput';
	input.type = 'text';
	input.name = 'forgotUsernameInput';
	inputCell.appendChild(input);
	row.appendChild(labelCell);
	row.appendChild(inputCell);
	table.appendChild(row);
	centerContainer.appendChild(table);

	const buttonContainer = document.createElement('div');
	const submitButton = document.createElement('button');
	submitButton.type = 'button';
	submitButton.className = 'signupbutton';
	submitButton.textContent = 'Send Username';
	submitButton.onclick = () => forgotUsernameClicked();
	buttonContainer.appendChild(submitButton);
	centerContainer.appendChild(buttonContainer);

	const responseDiv = document.createElement('div');
	responseDiv.id = 'forgotUsernameResponse';
	responseDiv.textContent = '\u00A0';
	centerContainer.appendChild(responseDiv);

	container.appendChild(centerContainer);
	return container;
}
