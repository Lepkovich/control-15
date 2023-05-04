let person = [];
let cities = [];
let specializations = [];

Promise.all (
    [
        fetch('person.json'),
        fetch('cities.json'),
        fetch('specializations.json'),
    ]
).then(async ([personResponse, citiesResponse, specializationsResponse])=>{
    const personsJson = await personResponse.json();
    const citiesJson = await citiesResponse.json();
    const specializationsJson = await specializationsResponse.json();
    return [personsJson, citiesJson, specializationsJson];
})
    .then ( response => {
        person = response[0];
        cities = response[1];
        specializations = response[2];

        processData();
    })

function processData() {
// из массива cities возьмем city.name и добавим в personal массива person, создав fullList методом map
    let fullList = person.map(item => {
        let city = cities.find(function (cityItem) {
            return cityItem.id === item.personal.locationId;
        });
        if (city && city.name) {
            item.personal.city = city.name;
        }
        return {
            firstName: item.personal.firstName,
            lastName: item.personal.lastName,
            city: item.personal.city
        };
    });
    console.log('--- п.3 Вывод всех пользователей:');
    fullList.forEach(item => {
        console.log(getInfo.call(item));
    });
// найдем дизайнеров в specializations по "name": "designer", потом отсортируем только тех, у кого в "skills" есть "name": "Figma".
    let designers = specializations.find(item => item.name.toLowerCase() === 'designer');
    if (designers) {
        let designersList = person.filter(item => {
            return item.personal.specializationId === designers.id;
        })
        if (designersList) {
            let designersFigma = designersList.filter(item => {
                let index = item.skills.findIndex(skill => {
                    return skill.name.toLowerCase() === 'figma';
                });
                return index > -1;
            });
            console.log(designersFigma);
            console.log('--- п.4 Дизайнеры, владеющие Figma:');
            designersFigma.forEach(item => {
                console.log(getInfo.call(item.personal));
            });
        }
    }
// найдем первого из списка разработчиков на React (person skills: [ {name": "React"}]
    let reactDev = person.find(item => {
        let index = item.skills.findIndex(skill => {
            return skill.name.toLowerCase() === 'react';
        });
        return index > -1;
    })
    console.log('--- п.5 Первый в списке разработчик на React:');
    console.log(getInfo.call(reactDev.personal));

// найдем всех, кто старше 18 лет (person personal: {"birthday":})

    let ageList = person.filter(item => {
        let dateParts = item.personal.birthday.split('.');
        let birthday = new Date(+dateParts[2], +dateParts[1]-1,+dateParts[0]);
        let ageInMilliseconds = Date.now() - birthday.getTime();
        let ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25); // account for leap years
        let age = Math.floor(ageInYears);
        if (age > 18) {
            return {
                firstName: item.personal.firstName,
                lastName: item.personal.lastName,
                city: item.personal.city
            }
        }
    })
    console.log('--- п.6 Список тех, кому больше 18 лет:');
    ageList.forEach(item => {
        console.log(getInfo.call(item.personal));
    });
//найдем всех backend-разработчиков (specializations {"name": "backend"}) из Москвы (person "city": "Москва")
//на полный рабочий день (person request: [{"value": "Полная"}] с сортировкой по ЗП (person request:[{"name": "Зарплата" "value": Num} ]

    let backEnders = specializations.find(item => item.name.toLowerCase() === 'backend');
    if (backEnders) {
        let backEndList = person.filter(item => {
            return item.personal.specializationId === backEnders.id;
        })
        console.log(backEndList);
        if (backEndList) {
            let backEndersMoscow = backEndList.filter(item => {
               return item.personal.city === 'Москва';
               });
            console.log(backEndersMoscow);
            if (backEndersMoscow) {
                let fullDay = backEndersMoscow.filter(item => {
                    console.log('1');
                    let index = item.request.findIndex(fullday => {
                        console.log(2);
                        return fullday.value.toLowerCase() === 'Полная';
                    });
                    return index > -1;
                })
                console.log(fullDay);
            }
        }
    }
}

function getInfo() {
    return `${this.firstName} ${this.lastName}, ${this.city}`;
}

