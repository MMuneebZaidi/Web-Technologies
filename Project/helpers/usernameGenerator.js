
function generateUsername(fullName) {
    function getFirstName(name) {
        return name.split(' ')[0].toLowerCase();
    }

    function generateRandomString(length) {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    const firstName = getFirstName(fullName);
    const randomString = generateRandomString(6);

    return firstName + '-' + randomString;
}

module.exports = generateUsername;
