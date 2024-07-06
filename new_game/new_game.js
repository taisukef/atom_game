let ai_hand = [];
let pl_hand = [];

let ai_selected_cards = [];
let ai_selected_place = [];
let pl_selected_cards = [];
let pl_selected_place = [];

let make_material = {};

let pl_point = 0;
let ai_point = 0;

let card_num = 8;

const elementToNumber = {"H": 1, "He": 2, "Li": 3, "Be": 4, "B": 5, "C": 6, "N": 7, "O": 8, "F": 9, "Ne": 10,"Na": 11, "Mg": 12, "Al": 13, "Si": 14, "P": 10, "S": 16, "Cl": 17, "Ar": 18, "K": 19, "Ca": 20,"Fe": 26, "Cu": 29, "Zn": 30, "I": 53};
const elements = [...Array(30).fill('H'), ...Array(25).fill('O'), ...Array(20).fill('C'),'He', 'Li', 'Be', 'B', 'N', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca','Fe', 'Cu', 'Zn', 'I'];
const element = ['H','O','C','He', 'Li', 'Be', 'B', 'N', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca','Fe', 'Cu', 'Zn', 'I']


const ai_hand_div = document.getElementById('ai_hand');
ai_hand_div.classList.add('disabled');

document.getElementById('pl_exchange_button').addEventListener('click',function() {
    pl_exchange();
})

document.getElementById('pl_generate_button').addEventListener('click',function() {
    pl_generate();
})

async function ai_turn() {
    view_ai_hand();
    document.getElementById('pl_exchange_button').classList.add('disabled');
    document.getElementById('pl_generate_button').classList.add('disabled');
    make_material = await ai_make_materials();
    if (ai_make_materials === false) {
        let ai_exchange_material = await ai_exchange_materials();
        await select_ai_cards(ai_exchange_material);
        ai_exchange();
    }
    await select_ai_cards(make_material.components);
    ai_generate();
}

function pl_turn() {
    view_pl_hand();
    document.getElementById('pl_exchange_button').classList.remove('disabled');
    document.getElementById('pl_generate_button').classList.remove('disabled');
}

function ai_exchange() {
    if (ai_selected_cards.length >= 1) {
        ai_selected_place.forEach((elem,index) => {
            if (elem == 1) {
                ai_hand[index] = get_random_card();
                let ai_card = document.getElementsByClassName('ai_card')[index];
                if (ai_card.classList.contains('selected')) {ai_card.click()};
            };
        });
        turn = 'pl';
        view_ai_hand();
        win_check();
        pl_turn();
    } else {
        document.getElementById('ai_text').innerHTML = 'あぁ、AIか。え？AI？？選択して？バグだよ？これ「？」多すぎ。文長くなっちゃった☆'
    }
}

function pl_exchange() {
    if (pl_selected_cards.length >= 1) {
        pl_selected_place.forEach((elem,index) => {
            if (elem == 1) {
                pl_hand[index] = get_random_card();
                const pl_card = document.getElementsByClassName('pl_card')[index];
                pl_card.click();
            };
        });
        turn = 'ai';
        view_pl_hand();
        win_check();
        ai_turn();
    } else {
        document.getElementById('pl_text').innerHTML = 'カードを選択してください';
    }
}

async function ai_generate() {
    if (ai_selected_cards.length >= 1) {
        let generate_material = await search_material(array_to_obj(ai_selected_cards));
        if (generate_material[0] != null) {
            ai_point += generate_material[0].point;
            document.getElementById('ai_point').innerHTML = `AIのポイント： ${ai_point}`;
            document.getElementById('ai_text').innerHTML = `${generate_material[0].name} ： ${generate_material[0].formula}`;
        } else {
            document.getElementById('ai_text').innerHTML = '該当のb...え？な～ぜ な～ぜ？（古い？）';
        }
        ai_exchange();
    } else {
        document.getElementById('ai_text').innerHTML = 'カードを選択s...え？お前AI？？なんで...？今からバグるよ（バグの子）！';
    }
}

async function pl_generate() {
    if (pl_selected_cards.length >= 1) {
        let generate_material = await search_material(array_to_obj(pl_selected_cards));
        if (generate_material[0] != null) {
            pl_point += generate_material[0].point;
            document.getElementById('pl_point').innerHTML = `プレイヤーのポイント： ${pl_point}`;
            document.getElementById('pl_text').innerHTML = `${generate_material[0].name} ： ${generate_material[0].formula}`;
        } else {
            document.getElementById('pl_text').innerHTML = '該当の物質がありません';
        }
        pl_exchange();
    } else {
        document.getElementById('pl_text').innerHTML = 'カードを選択してください';
    }
}

function view_ai_hand() {
    const Hand_div = document.getElementById('ai_hand');
    Hand_div.innerHTML = '';
    ai_hand.forEach((elem,index) => {
        const img = document.createElement('img');
        img.id = index;
        img.alt = elem;
        img.src = `../image/${elementToNumber[img.alt]}.png`;
        img.style.width = '60px';
        img.style.height = 'auto';
        img.style.border = '1px solid #000';
        img.style.margin = '10px';
        img.className = 'ai_card';
        img.addEventListener('click', function() {
            if (turn == 'ai') {
                if (this.classList.contains('selected')) {
                    this.classList.remove('selected');
                    this.style.transform = 'scale(1.00)';
                    this.style.border = '1px solid #000';
                    ai_selected_cards.splice(ai_selected_cards.indexOf(this.alt),1);
                    ai_selected_place[this.id] = 0;
                } else {
                    this.classList.add('selected');
                    this.style.transform = 'scale(1.20)'
                    this.style.border = '1px solid #f00';
                    ai_selected_cards.push(this.alt);
                    ai_selected_place[this.id] = 1;
                }
            }
        })
        Hand_div.appendChild(img);
    })
}

function view_pl_hand() {
    const Hand_div = document.getElementById('pl_hand');
    Hand_div.innerHTML = '';
    pl_hand.forEach((elem,index) => {
        const img = document.createElement('img');
        img.id = index;
        img.alt = elem;
        img.src = `../image/${elementToNumber[img.alt]}.png`;
        img.style.width = '60px';
        img.style.height = 'auto';
        img.style.border = '1px solid #000';
        img.style.margin = '10px';
        img.className = 'pl_card';
        img.addEventListener('click', function() {
            if (turn == 'pl') {
                if (this.classList.contains('selected')) {
                    this.classList.remove('selected');
                    this.style.transform = 'scale(1.00)';
                    this.style.border = '1px solid #000';
                    pl_selected_cards.splice(pl_selected_cards.indexOf(this.alt),1);
                    pl_selected_place[this.id] = 0;
                } else {
                    this.classList.add('selected');
                    this.style.transform = 'scale(1.20)'
                    this.style.border = '1px solid #f00';
                    pl_selected_cards.push(this.alt);
                    pl_selected_place[this.id] = 1;
                }
            }
        })
        Hand_div.appendChild(img);
    })
}

function get_random_card() {
    return elements[Math.floor(Math.random() * elements.length)];
}
function make_initial_hand() {
    for (let i=0;i<card_num;i++) {
        ai_hand.push(get_random_card());
        pl_hand.push(get_random_card());
    }
}

async function loadMaterials() {
    const response = await fetch('../compound/standard.json');
    const data = await response.json();
    if (!data.material || !Array.isArray(data.material)) {
        console.error('Loaded data does not contain a valid "material" array:', data);
        return [];
    }
    return data.material;
}

async function search_material(components) {
    const materials = await loadMaterials();
    return materials.filter(material => {
        for (const element in components) {
            if (!material.components[element] || material.components[element] !== components[element]) {
                return false;
            }
        }
        for (const element in material.components) {
            if (!components[element]) {
                return false;
            }
        }
        return true;
    })
}

function search_materials(components, materials) {
    return materials.filter(material => {
        for (const element in material.components) {
            if (!components[element] || material.components[element] > components[element]) {
                return false;
            }
        }
        return true
    });
}

async function ai_make_materials() {
    const components = ai_hand.reduce((acc, element) => {
        acc[element] = (acc[element] || 0) + 1;
        return acc;
    }, {});
    const allMaterials = await loadMaterials();
    const matchingMaterials = search_materials(components, allMaterials);
    if (matchingMaterials == null) {return false}
    const indexes = matchingMaterials.map(material => allMaterials.indexOf(material));
    var max_point = 0;
    var max_point_index = 0;
    indexes.forEach((index) => {
        if (allMaterials[index].point > max_point) {
            max_point_index = index;
            max_point = allMaterials[index].point;
        }
    })
    return allMaterials[max_point_index];
}

function obj_to_array(obj) {
    let result = [];
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            for (let i = 0; i < obj[key]; i++) {
                result.push(key);
            }
        }
    }
    return result;
}

function array_to_obj(array) {
    let result = {};
    array.forEach(item => {
        if (result[item]) {
            result[item]++;
        } else {
            result[item] = 1;
        }
    });
    return result;
}

function delay() {
    return new Promise(resolve => setTimeout(resolve, 500));
}

function search_need_select(need_cards) {
    let select_place = [];
    const img = document.getElementsByClassName('ai_card');
    for (var index=0;index < 8;index++) {
        if (need_cards.includes(img[index].alt)) {
            select_place.push(index);
            need_cards.splice(need_cards.indexOf(img[index].alt),1);
        };
    };
    return select_place;
}

async function select_ai_cards(need_cards) {
    need_cards = obj_to_array(need_cards);
    const img = document.getElementsByClassName('ai_card');
    let select_places = await search_need_select(need_cards);
    for (var index=0;index < 8;index++) {
        if (select_places.includes(index)) {
            img[index].click();
            await delay();
        };
    };
}

async function ai_exchange_materials() {
    const elementCounts = {};
    ai_hand.forEach(elem => elementCounts[elem] = (elementCounts[elem] || 0) + 1);
    let minCount = Infinity;
    let elementToExchange = null;
    for (let elem in elementCounts) {
        if (elementCounts[elem] < minCount) {
            minCount = elementCounts[elem];
            elementToExchange = el;
        }
    }
    return elementToExchange;
}

function win_check() {
    if (pl_point >= 250 || ai_point >= 250) {
        turn = 'end';
        alert(pl_point >= 250 ? 'プレイヤーの勝利':'AIの勝利');
    } else {
        return false
    };
}
