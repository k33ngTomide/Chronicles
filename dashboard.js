
let loggedInUser = "";
let userScreenName = "";
document.addEventListener('DOMContentLoaded', function () {
     loggedInUser = localStorage.getItem('loggedInUser');
     userScreenName = localStorage.getItem('userScreenName')
    document.querySelector("#incoming_user").innerText = userScreenName;
});


const modeButton = document.querySelector('#mode-button');
modeButton.addEventListener('click', () => {
    document.body.classList.toggle('light-dark-mode');
    console.log("Changed Mode Successfully");
});


const logoutButton = document.querySelector('#logout-button');
logoutButton.addEventListener('click', () => {
    console.log("Logout button clicked!");

    const url = 'http://localhost:8080/Chronicles/lock';

    fetch( url, {
        method: 'POST',
        body: loggedInUser,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },

    })
        .then(response => response.text())
        .then(responseText => {
            console.log(responseText);
            if(responseText.startsWith("Locked")){
                window.location.href = 'index.html';

            } else {
                console.log(responseText);
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });

})

function createTextArea() {
    let body = document.createElement('textarea');
    body.placeholder = 'Enter your story';
    body.rows = 10;
    body.cols = 40;
    body.style.width = '400px';
    body.style.height = '200px';
    body.style.borderRadius = '6px';
    body.id = "entry-body";
    return body;
}

function createInputArea() {
    let title = document.createElement('input');
    title.placeholder = 'Enter title';
    title.type = 'text';
    title.style.width = '400px';
    title.style.borderRadius = '6px';
    title.id = "entry-title";
    title.style.height = '50px';
    return title;
}

function createButton() {
    let submitEntry = document.createElement('button');
    submitEntry.innerText = 'Add Entry'
    submitEntry.type = 'submit';
    submitEntry.style.height = '50px';
    submitEntry.style.backgroundColor = 'lightblue';
    submitEntry.style.border = 'none';
    submitEntry.style.borderRadius = '5px';
    submitEntry.style.width = '100px';
    submitEntry.style.borderRadius = '10px';
    submitEntry.id = "entry-submit";
    return submitEntry;
}


function createForm() {
    const formElement = document.getElementById('add-entry-form');
    return formElement;
}

function displayForm(formElement) {
    const formDisplay = document.getElementById('form-display');
    document.querySelector('#close-entry-form').style.display = 'flex';
    formDisplay.append(formElement);
}


const closeEntryButton = document.querySelector('#close-entry-form')
closeEntryButton.addEventListener('click', () => {
    removeAllChildrenOfForm();
    document.querySelector('#close-entry-form').style.display = 'none';
})

const addEntry = document.querySelector('#add-entry-button');
addEntry.addEventListener('click', () => {
    console.log('Add Entry Button clicked!');

    removeAllChildrenOfForm();

    if(document.querySelector('#entry-title')){
        removeAddEntryForm();
    } else {
        const formElement = createForm();
        let title = createInputArea();
        let body = createTextArea();
        let submitEntryButton = createButton();

        formElement.append(title);
        formElement.append(body);
        formElement.append(submitEntryButton);

        displayForm(formElement);
    }

})

const formHolder = document.querySelector('#add-entry-form')

function extractAddEntryField() {
    let entryTitle = document.querySelector('#entry-title');
    let entryBody = document.querySelector('#entry-body');

    let entryRequest = {
        ownerName: loggedInUser,
        title: entryTitle.value,
        body: entryBody.value
    }

    const url = 'http://localhost:8080/Chronicles/createNewEntry';

    console.log(entryRequest);

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(entryRequest),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },

    })
        .then(response => response.text())
        .then(responseText => {
            console.log(responseText);
            if (responseText.startsWith("Entry Created Successfully")) {
                openPassedResult(responseText)
                closeFailedResultPane()

            } else {
                closeResultShown();
                openFailedResult(responseText);
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function openPassedResult(response){
    document.querySelector('#result-text').innerHTML = response;
    document.getElementById('ok-image').style.display = 'flex';
}


function closeResultShown(){
    document.querySelector('#result-text').innerHTML = "";
    document.querySelector('#result-body').innerHTML = '';
    document.querySelector('#date-time').innerHTML = '';
    document.getElementById('ok-image').style.display = 'none';
}

function openFailedResult(response){
    document.getElementById('not-ok-image').style.display = 'flex';
    document.querySelector('#bad-result-text').innerHTML = response;
}

function closeFailedResultPane(){
    document.getElementById('not-ok-image').style.display = 'none';
    document.querySelector('#bad-result-text').innerHTML = '';
}

formHolder.addEventListener('submit', (e) => {

    e.preventDefault();

    if(document.querySelector('#view-entry')){

    } else if(document.querySelector('#old-password')){
        extractUpdatePasswordEntryField()
    } else if(document.querySelector('#delete-entry-title')){
        extractDeleteEntryField();
    } else if(document.querySelector('#search-title')){
        extractSearchEntryField();
    } else if(document.querySelector('#entry-title')){
        extractAddEntryField();
    }


})

function extractUpdatePasswordEntryField(){
    let oldPassword = document.getElementById('old-password');
    let newPassword = document.getElementById('new-password');

    let updatePasswordRequest = {
        username: loggedInUser,
        oldPassword: oldPassword.value,
        newPassword: newPassword.value
    }
    let url = 'http://localhost:8080/Chronicles/update'
    fetch(url, {
        method: 'PATCH',
        body: JSON.stringify(updatePasswordRequest),
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }

    }).then(response => response.text())
        .then(responseText => {
            console.log(responseText);

            if (responseText.startsWith("Password Updated")) {
                openPassedResult(responseText);
                closeFailedResultPane();

            } else {
                openFailedResult(responseText);
                closeResultShown();
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// function createResultImage(imageUrl){
//     let imageCreated = document.createElement('img');
//     imageCreated.src = imageUrl
//     imageCreated.style.height = '150px';
//     imageCreated.style.width = '200px';
//     imageCreated.style.display = 'flex';
//     imageCreated.style.alignSelf = 'center';
//     return imageCreated;
//
// }

function extractDeleteEntryField(){
    let entryTitle = document.querySelector('#delete-entry-title');

    let deleteRequest = {
        username: loggedInUser,
        title: entryTitle.value,
    }

    const url = 'http://localhost:8080/Chronicles/deleteEntry';

    console.log(deleteRequest);

    fetch(url, {
        method: 'DELETE',
        body: JSON.stringify(deleteRequest),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },

    })
        .then(response => response.text())
        .then(responseText => {
            console.log(responseText);

            if (responseText.startsWith("Entry Deleted Successfully")) {
                openPassedResult(responseText);
                closeFailedResultPane();
            } else {
                openFailedResult(responseText);
                closeResultShown();
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function extractSearchEntryField(){
    let entryTitle = document.querySelector('#search-title').value;
    if(entryTitle == null){
        console.error("Title Cannot be empty");
    }


    const url = `http://localhost:8080/Chronicles/findEntry/${loggedInUser}/${entryTitle}`;

    console.log("Searching for ...", entryTitle);

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },

    })
        .then(response => response.json())
        .then(responseText => {
            console.log(responseText);
            if (responseText.title != null) {
                const { title, body, dateCreated, timeCreated} = responseText;

                let resultTitle = document.querySelector('#result-text');
                let resultBody = document.querySelector('#result-body');
                let createdDate = document.querySelector('#date-time');
                resultTitle.innerHTML = `Title: ${title}`;
                resultBody.innerHTML = `Body: ${body}`;
                createdDate.innerHTML = `Date Created: ${dateCreated} \n Time Created: ${timeCreated}`
                closeFailedResultPane();

            } else {
                openFailedResult(responseText);
                closeResultShown();
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });
}



const searchEntry = document.querySelector('#find-entry-button');
searchEntry.addEventListener('click', () => {
    console.log(' Find Entry Button clicked!');
    removeAllChildrenOfForm();

    if(document.querySelector('#search-title')){
        removeSearchForm();
    } else {
        const formElement = createForm();
        let title = createInputArea();
        title.id = 'search-title';
        let submitEntryButton = createButton();
        submitEntryButton.id = 'search-button'
        submitEntryButton.innerHTML = 'Search Entry';

        formElement.append(title);
        formElement.append(submitEntryButton);

        displayForm(formElement);
    }

})


const deleteEntry = document.querySelector('#delete-button');
deleteEntry.addEventListener('click', () => {
    console.log('Delete Entry Button clicked!');

    removeAllChildrenOfForm();

    if(document.getElementById('delete-entry-title')){
        removeDeleteForm();
    } else {
        const formElement = createForm();
        let title = createInputArea();
        title.id = 'delete-entry-title'
        let submitEntryButton = createButton();
        submitEntryButton.id = 'delete-entry-button'
        submitEntryButton.innerHTML = 'Delete Entry'

        formElement.append(title);
        formElement.append(submitEntryButton);

        displayForm(formElement);
    }

})

const updatePassword = document.querySelector('#update-password');
updatePassword.addEventListener('click', () => {
    console.log('Update password Button clicked!');

    removeAllChildrenOfForm();

    if(document.querySelector('#old-password')){
        removePasswordForm();
    } else {
        const formElement = createForm();
        let old = createInputArea();
        old.id = 'old-password';
        old.type = 'password'
        old.placeholder ='Enter your old password';
        let newp = createInputArea();
        newp.id = 'new-password';
        newp.type = 'password'
        newp.placeholder = 'Enter your new password';

        let submitEntryButton = createButton();
        submitEntryButton.id = 'password-update';
        submitEntryButton.innerHTML = 'Update password';

        formElement.append(old);
        formElement.append(newp);
        formElement.append(submitEntryButton);

        displayForm(formElement);
    }


})


const viewAll = document.querySelector('#view');
viewAll.addEventListener('click', () => {
    console.log(' View all Entries Button clicked!');

    removeAllChildrenOfForm();

    if(document.getElementById('view-entry')){
        removeViewEntryForm();
    } else {
        const formElement = createForm();
        let title = createInputArea();
        title.id = 'view-entry'
        let submitEntryButton = createButton();
        submitEntryButton.id = 'view-entry-button'
        submitEntryButton.innerHTML = 'View Entry'

        formElement.append(title);
        formElement.append(submitEntryButton);

        displayForm(formElement);
    }
})

function removeAddEntryForm() {
    document.querySelector('#entry-title').remove();
    document.querySelector('#entry-body').remove();
    document.querySelector('#entry-submit').remove();
}

function removeSearchForm() {
    document.querySelector('#search-title').remove();
    document.querySelector('#search-button').remove();
}

function removeDeleteForm() {
    document.querySelector('#delete-entry-title').remove();
    document.querySelector('#delete-entry-button').remove();
}

function removePasswordForm() {
    document.querySelector('#old-password').remove();
    document.querySelector('#new-password').remove();
    document.querySelector('#password-update').remove();
}

function removeViewEntryForm() {
    document.querySelector('#view-entry').remove();
    document.querySelector('#view-entry-button').remove();
}

function removeAllChildrenOfForm(){
    closeFailedResultPane();
    closeResultShown();
    if(document.querySelector('#view-entry')){
        removeViewEntryForm();
    } else if(document.querySelector('#old-password')){
        removePasswordForm();
    } else if(document.querySelector('#delete-entry-title')){
        removeDeleteForm();
    } else if(document.querySelector('#search-title')){
        removeSearchForm();
    } else if(document.querySelector('#entry-title')){
        removeAddEntryForm();
    }
}