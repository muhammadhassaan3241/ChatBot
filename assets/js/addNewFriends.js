let input = document.querySelector('#input');
let list = document.querySelector('#list .list-group').querySelectorAll('div');
let item = document.querySelector(".list-group");

console.log(item.textContent);
list.forEach(x => {
    x.style.display = "none";
});

function getUsers() {
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


