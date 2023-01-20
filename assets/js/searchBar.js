let input = document.querySelector('#searchBar');
let list = document.querySelector('#usersList .list-group').querySelectorAll('a');
let item = document.querySelector("#allUsers");
list.forEach((x) => {
    x.style.display = 'none';
})


function searchBar() {
    var regex = /^\s+$/;
    list.forEach(x => {
        console.log({ x });
        let re = new RegExp(input.value, 'i');

        if (input.value.trim() === '') {
            x.style.display = 'none';
            return;
        }
        if (re.test(x.textContent)) {
            x.lastElementChild.innerHTML = x.textContent.replace(re, '<b>$&</b>');
            x.style.display = 'block';
        }
        else {
            x.style.display = 'none';
        }
    })
};