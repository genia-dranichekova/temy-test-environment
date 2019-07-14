let xhr = new XMLHttpRequest();

xhr.open('GET', 'http://localhost:3000/cities', false);
xhr.send();
let responseCities = JSON.parse(xhr.responseText);

xhr.open('GET', 'http://localhost:3000/states', false);
xhr.send();
let responseStates = JSON.parse(xhr.responseText);

xhr.open('GET', 'http://localhost:3000/countries', false);
xhr.send();
let responseCountries = JSON.parse(xhr.responseText);

if (xhr.status !== 200) {
    alert( xhr.status + ': ' + xhr.statusText );
} else {
    let responseObjects = JSON.parse(xhr.responseText);
    let select = document.getElementById('inputCountry');
    for (let i = 0; i < responseObjects.length; i++) {
        let counter = responseObjects[i];
        let opt = document.createElement('option');
        opt.value = counter.id;
        opt.innerHTML = counter.name;
        select.appendChild(opt);
    }
}

function createUserTable(data) {

    let usersInfo = document.getElementById('usersTable');
    let date = new Date;
    usersInfo.innerHTML = data.map(({ name, email, phone_number, country_id, state_id, city_id, createdAt}) =>
        '<tr class="responsive-table-item usersInfoTable">'+
        '<td class="hidden-xs userId">'+name+'</td>'+
        '<td class="hidden-xs userEmail">'+email+'</td>'+
        '<td class="hidden-xs userPhone">'+phone_number+'</td>'+
        '<td class="hidden-xs userAddress">'+responseCountries.find(o => o.id == country_id).name+', '+responseStates.find(o => o.id == state_id).name+', '+responseCities.find(o => o.id == city_id).name+'</td>'+
        '<td class="hidden-xs userCreationDate">'+date.getDate(createdAt)+'/'+date.getMonth(createdAt)+'/'+date.getFullYear(createdAt)+'</td>'+'</tr>'
    ).join('');
}

function updateUserData() {
    const jsonData = {};
    jsonData['name'] = document.getElementById('inputName').value;
    jsonData['email'] = document.getElementById('inputEmail').value;
    jsonData['phone_number'] = document.getElementById('inputPhone_number').value;
    jsonData['address'] = (document.getElementById('inputAddress').value == '') ? null : document.getElementById('inputAddress').value;
    jsonData['about_me'] = (document.getElementById('comment').value == '') ? null : document.getElementById('comment').value;
    jsonData['country_id'] = responseCountries.find(o => o.name == document.getElementById('inputCountry').options[document.getElementById('inputCountry').selectedIndex].innerText).id.toString();
    jsonData['state_id'] = responseStates.find(o => o.name == document.getElementById('inputState').options[document.getElementById('inputState').selectedIndex].innerText).id;
    jsonData['city_id'] = responseCities.find(o => o.name == document.getElementById('inputCity').options[document.getElementById('inputCity').selectedIndex].innerText).id;

    try {
        const xhr_post = new XMLHttpRequest()
        xhr_post.open('POST', 'http://localhost:3000/users', true);
        xhr_post.setRequestHeader('Content-Type', 'application/json');
        xhr_post.send(JSON.stringify(jsonData));
    } catch (e) {
        alert(e);
    }
}

const submitButton = document.getElementById('submitButton');

submitButton.addEventListener('click', function () {

    let letters = /^[A-Za-z ]+$/;
    let numbers = /^[0-9]+$/;
    let nameValue = document.getElementById('inputName');
    let numberValue = document.getElementById('inputPhone_number');

    if(nameValue.value.match(letters)) {

        if(numberValue.value.match(numbers)) {
            updateUserData();
            xhr.open('GET', 'http://localhost:3000/users', false);
            xhr.send();
            let responseUsersNew = JSON.parse(xhr.responseText);
            document.getElementById('usersTable').innerHTML = "";
            createUserTable(responseUsersNew);
        }
        else {
            alert('Invalid phone number');
            return false;
        }
    }
    else {
        alert('Invalid name field');
        return false;
    }
});

let el;

function countCharacters(e) {

    var textEntered, countRemaining, counter;
    textEntered = document.getElementById('comment').value;
    counter = (500 - (textEntered.length));
    countRemaining = document.getElementById('charactersRemaining');
    countRemaining.textContent = counter;
}

el = document.getElementById('comment');
el.addEventListener('keyup', countCharacters, false);

const chooseCountry = document.getElementById('inputCountry');
const chooseState = document.getElementById('stateChoose');
const chooseCity = document.getElementById('cityChoose');

chooseCountry.addEventListener('change', setStatesVisible);
chooseState.addEventListener('change', setCitiesVisible);

function setStatesVisible() {

    if (document.getElementById('inputCountry').value !== "") {
        xhr.open('GET', 'http://localhost:3000/states/', false);
        xhr.send();

        if (xhr.status !== 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            let responseObjects = JSON.parse(xhr.responseText);
            let select = document.getElementById('inputState');

            for ( let i = 1; i < document.getElementById('inputState').getElementsByTagName('option').length; i++) {
                document.getElementById('inputState').remove(i);
            }
            let countOptions = responseObjects.length;

            for (let i = 0; i < responseObjects.length; i++) {
                let counter = responseObjects[i];
                let opt = document.createElement('option');
                if (counter.country_id == responseCountries.find(o => o.name == document.getElementById('inputCountry').options[document.getElementById('inputCountry').selectedIndex].innerText).id) {
                    opt.value = counter.id;
                    opt.innerHTML = counter.name;
                    select.appendChild(opt);
                } else if (countOptions == 0) {
                    alert('No states for this country');
                } else {
                    countOptions--;
                }
            }
        }
        chooseState.hidden = false;
    } else {
        return false;
    }
}

function setCitiesVisible() {

    if (document.getElementById('inputState').value !==  "") {
        xhr.open('GET', 'http://localhost:3000/cities', false);
        xhr.send();

        if (xhr.status !== 200) {
            alert( xhr.status + ': ' + xhr.statusText );
        } else {
            let responseObjects = JSON.parse(xhr.responseText);
            let select = document.getElementById('inputCity');
            for ( let i = 1; i < document.getElementById('inputCity').getElementsByTagName('option').length; i++) {
                document.getElementById('inputCity').remove(i);
            }
            let countOptions = responseObjects.length;

            for (let i = 0; i < responseObjects.length; i++) {
                let counter = responseObjects[i];
                let opt = document.createElement('option');
                if (counter.state_id == responseStates.find(o => o.name == document.getElementById('inputState').options[document.getElementById('inputState').selectedIndex].innerText).id) {
                    opt.value = counter.id;
                    opt.innerHTML = counter.name;
                    select.appendChild(opt);
                } else if (countOptions == 0){
                    alert('No cities in this region');
                } else {
                    countOptions--;
                }
            }
        }
        chooseCity.hidden = false;
    } else {
        return false;
    }
}

xhr.open('GET', 'http://localhost:3000/users', false);
xhr.send();
let responseUsers = JSON.parse(xhr.responseText);

createUserTable(responseUsers);

