const passwordDisplay = document.querySelector('.password-display');
const characterLength = document.querySelector('.character-length');
const characterRange = document.querySelector('.character-range');
const includeCheckBoxes = document.querySelectorAll('.include-checkboxes input[type="checkbox"]');
const strengthLevelElement = document.querySelector('.strength-level');
const strengthBars = document.querySelectorAll('.strength-bars .bar')
const generateButton = document.querySelector('.generate-button');
const copyButton = document.querySelector('.copy-button');

const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()-_=[]{}|;:"<>,./?';

let includedCharacters = '';

eventListeners();

function eventListeners() {
    generateButton.addEventListener('click', generatePassword);
    characterRange.addEventListener('input', rangeCharacterLength);
    copyButton.addEventListener('click', copyPassword);
}

function generatePassword() {
    if (validate()) {
        passwordDisplay.style.opacity = 1;

        includeOtherCharacters(includeCheckBoxes[0], upperCase);
        includeOtherCharacters(includeCheckBoxes[1], lowerCase);
        includeOtherCharacters(includeCheckBoxes[2], numbers);
        includeOtherCharacters(includeCheckBoxes[3], symbols);
        
        let password = '';

        for (let i = 0; i < Number(characterRange.value); i++) {
            const character = includedCharacters[Math.ceil(Math.random() * includedCharacters.length - 1)];
            password += character;
        }

        setStrength();

        passwordDisplay.textContent = password;   
    }
}

function includeOtherCharacters(checkbox, characters) {
    if (checkbox.checked === true && !includedCharacters.includes(characters)) {
        includedCharacters += characters;
    } else if (checkbox.checked === false) {
        includedCharacters = includedCharacters.replace(characters, '');
    }
}

function setStrength() {
    let strength = 0;
    let strengthLevel = '';
    const checkedBoxCount = Array.from(includeCheckBoxes).filter(checkbox => checkbox.checked).length;

    strength += characterRange.value * 3;

    strength += checkedBoxCount === 1 ? 15 : 
        checkedBoxCount === 2 ? 30 :
        checkedBoxCount === 3 ? 45 : 60;

    strengthLevel = strength <= 25 || characterRange.value <= 4 ? 'weak' :
        strength <= 50 || characterRange.value <= 6 ? 'low' :
        strength <= 75 || characterRange.value <= 8 ? 'medium' : 'strong';

    console.log(strength);

    function setStrengthLevel(color, barCount) {
        for (let i = 0; i < strengthBars.length; i++) {
            const bar = strengthBars[i];
            bar.className = `bar active-bar-${color}`;
            if (i === barCount) {
                bar.className = 'bar';
                break;
            }
        }
        strengthLevelElement.textContent = strengthLevel.toUpperCase();
    }

    switch(strengthLevel){
        case 'weak': setStrengthLevel('red', 1);
            break;

        case 'low': setStrengthLevel('orange', 2);
            break;

        case 'medium': setStrengthLevel('yellow', 3);
            break;

        case 'strong': setStrengthLevel('green', 4);
            break;
    }
}

function copyPassword() {
    if (strengthLevelElement.textContent !== '') {
        navigator.clipboard.writeText(passwordDisplay.textContent);
        alert(`Copied to clipboard: ${passwordDisplay.textContent}`);
    }
}

function rangeCharacterLength() {
    characterLength.textContent = characterRange.value;
    const progress = (characterRange.value / characterRange.max) * 100;
    characterRange.style.background = `linear-gradient(to right, #a4ffaf ${progress}%, #18171f ${progress}%)`;
}

function validate() {
    let value = false
    if (Number(characterRange.value) > 0 && Array.from(includeCheckBoxes).some(checkbox => checkbox.checked)) {
        value = true; 
    } else {
        alert('Please select a valid filter!');
    }
    return value;
}