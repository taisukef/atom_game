let p1_hand = [];
let ai_hand = [];

let p1_selected_cards = [];
let ai_selected_cards = [];

let p1_selected_place = [0,0,0,0,0,0,0,0];
let ai_selected_place = [0,0,0,0,0,0,0,0];

let p1_point = 0;
let ai_point = 0;

let turn = 'p1';

let ai_choose_material = '';

let hand_num = 10;

const elementToNumber = {"H": 1, "He": 2, "Li": 3, "Be": 4, "B": 5, "C": 6, "N": 7, "O": 8, "F": 9, "Ne": 10,"Na": 11, "Mg": 12, "Al": 13, "Si": 14, "P": 10, "S": 16, "Cl": 17, "Ar": 18, "K": 19, "Ca": 20,"Fe": 26, "Cu": 29, "Zn": 30, "I": 53};
const elements = [...Array(30).fill('H'), ...Array(25).fill('O'), ...Array(20).fill('C'),'He', 'Li', 'Be', 'B', 'N', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca','Fe', 'Cu', 'Zn', 'I'];
const element = ['H','O','C','He', 'Li', 'Be', 'B', 'N', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca','Fe', 'Cu', 'Zn', 'I']

async function p1_generate() {
    if (p1_selected_cards.length != 0) {
        let material
        await search_material(array_to_dict(p1_selected_cards)).then(data => material = data[0]);;
        if (material !== undefined) {
                document.getElementById('p1_text').innerHTML = `<p>生成した物質：　　${material.name} (${material.formula}) - ${material.point} ポイント</p>`;
                p1_point += material.point;
                document.getElementById('p1_point').innerHTML = `<p>プレイヤー１のポイント：${p1_point}</p>`
        } else {
            document.getElementById('p1_text').innerHTML = '該当の物質がありません';
        }
        p1_exchange();
        p1_selected_cards = [];
        p1_selected_place = [0,0,0,0,0,0,0,0];
        console.log('p1 generate  end');
        turn = 'ai';
        console.log('going to start ai turn');
    } else {
        document.getElementById('p1_text').innerHTML = 'カードが選択されていません';
    }
}

async function ai_generate() {
    if (ai_selected_cards.length != 0) {
        let material
        await search_material(array_to_dict(ai_selected_cards)).then(data => material = data[0]);;
        if (material !== undefined) {
                document.getElementById('ai_text').innerHTML = `<p>生成した物質：　　${material.name} (${material.formula}) - ${material.point} ポイント</p>`;
                ai_point += material.point;
                document.getElementById('ai_point').innerHTML = `<p>プレイヤー２のポイント：${ai_point}</p>`
        } else {
            document.getElementById('ai_text').innerHTML = '該当の物質がありません';
        }
        ai_exchange();
        ai_selected_cards = [];
        ai_selected_place = [0,0,0,0,0,0,0,0];
        turn = 'p1';
    } else {
        document.getElementById('ai_text').innerHTML = 'カードが選択されていません';
    }
}

function p1_exchange() {
    if (p1_selected_cards.length >= 1) {
        p1_selected_place.forEach((item,index) => {
            if (item == 1) {
                p1_hand[index] = get_random_card();
            };
        });
        p1_selected_cards = [];
        p1_selected_place = [0,0,0,0,0,0,0,0];
        p1_view_hand();
        turn = 'ai';
    } else {
        document.getElementById('p1_text').innerHTML = 'カードが選択されていません';
    }
}

function ai_exchange() {
    if (ai_selected_cards.length >= 1) {
        ai_selected_place.forEach((item,index) => {
            if (item == 1) {
                ai_hand[index] = get_random_card();
            };
        });
        ai_selected_cards = [];
        ai_selected_place = [0,0,0,0,0,0,0,0];
        ai_view_hand();
        turn = 'p1';
    } else {
        document.getElementById('ai_text').innerHTML = 'カードが選択されていません';
    }
}

function p1_view_hand() {
    const Hand_Div = document.getElementById('p1_hand');
    Hand_Div.innerHTML = ``
    p1_hand.forEach((element, index) => {
        const img = document.createElement('img');
        img.src = `../image/${elementToNumber[element]}.png`;
        img.alt = element;
        img.style.width = '60px';
        img.style.margin = '5px';
        img.style.border = '1px solid #000';
        img.className = 'p1';
        img.place = index;
        img.addEventListener('click', function() {
            if (turn == 'p1') {
                if (!this.classList.contains('selected')) {
                    this.classList.add('selected');
                    p1_selected_cards.push(this.alt);
                    p1_selected_place[index] = 1;
                    this.style.transform = 'scale(1.10)';
                } else {
                    this.classList.remove('selected');
                    const cardIndex = p1_selected_cards.indexOf(this.alt);
                    if (cardIndex !== -1) {
                        p1_selected_cards.splice(cardIndex, 1);
                        p1_selected_place[index] = 0;
                    }
                    this.style.transform = 'scale(1.00)';
                }
            }
        });
        Hand_Div.appendChild(img);
    });
}

function ai_view_hand() {
    const Hand_Div = document.getElementById('ai_hand');
    Hand_Div.innerHTML = ``
    ai_hand.forEach((element, index) => {
        const img = document.createElement('img');
        img.src = `../image/${elementToNumber[element]}.png`;
        img.alt = element;
        img.style.width = '60px';
        img.style.margin = '5px';
        img.style.border = '1px solid #000';
        img.className = 'ai';
        img.place = index;
        img.addEventListener('click', function() {
            if (turn == 'ai') {
                if (!this.classList.contains('selected')) {
                    this.classList.add('selected');
                    ai_selected_cards.push(this.alt);
                    ai_selected_place[index] = 1;
                    this.style.transform = 'scale(1.10)';
                } else {
                    this.classList.remove('selected');
                    const cardIndex = ai_selected_cards.indexOf(this.alt);
                    if (cardIndex !== -1) {
                        ai_selected_cards.splice(cardIndex, 1);
                        ai_selected_place[index] = 0;
                    }
                    this.style.transform = 'scale(1.00)';
                }
            }
        });
        Hand_Div.appendChild(img);
    });
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

function initial_hand() {
    for (i=0;i<=(hand_num - 1);i++) {
        p1_hand.push(elements[Math.floor(Math.random() * elements.length)]);
        ai_hand.push(elements[Math.floor(Math.random() * elements.length)]);
    }
}

function get_random_card() {
    return elements[Math.floor(Math.random() * elements.length)];
}

function array_to_dict(array) {
    const result = {};
    array.forEach(item => {
      if (result[item]) {
        result[item] += 1;
      } else {
        result[item] = 1;
      }
    });
    return result;
}

function reset_size(p1_or_ai) {
    let div = document.getElementById(p1_or_ai);
    let div_img = div.getElementsByTagName('img');
    for (i=0;i<div_img.length;i++){
        div_img[i].style.transform = 'scale(1.00)';
    }
}

function win_check() {
    if (p1_point >= 250 || ai_point >= 250) {
        return p1_point >= 250 ? 'p1':'ai';
    } else {
        return false;
    }
}

function ai_click_img_alt(alt_key) {
    const cards = document.querySelectorAll('#ai_hand img');
    cards.forEach((elem,index) => {
        if (elem.alt == alt_key) {
            return index;
        } 
    })
}

function ai_click_img(i) {
    const cards = document.querySelectorAll('#ai_hand img');
    console.log(cards[i])
    if (cards[i]) {
        cards[i].click();
    } else {
        console.log('指定されたインデックスのカードは存在しません。');
    }
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

async function can_make_materials(currentHand) {
    const components = currentHand.reduce((acc, element) => {
        acc[element] = (acc[element] || 0) + 1;
        return acc;
    }, {});
    const allMaterials = await loadMaterials();
    const matchingMaterials = search_materials(components, allMaterials);
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

async function choose_material_generate(ai_hand) {
    await can_make_materials(ai_hand).then(result => {ai_choose_material = result;console.log(result)});
}

function components_to_array(components) {
    const array = [];
    for (const element in components) {
        for (let i = 0; i < components[element]; i++) {
            array.push(element);
        }
    }
    return array;
}

function choose_material_exchange(Hand) {
    const elementCounts = {};
    Hand.forEach(el => elementCounts[el] = (elementCounts[el] || 0) + 1);

    let minCount = Infinity;
    let elementToExchange = null;
    for (let el in elementCounts) {
        if (elementCounts[el] < minCount) {
            minCount = elementCounts[el];
            elementToExchange = el;
        }
    }
    return elementToExchange;
}

async function choose_material_generate_await(hand) {
    await choose_material_generate(hand)
}

function ai_turn() {
    ai_view_hand();
    let p1_generate_button = document.getElementById('p1_generate');
    let p1_exchange = document.getElementById('p1_exchange');
    p1_generate_button.ariaDisabled = 'disabled';
    p1_exchange.ariaDisabled = 'disabled';
    let ai_generate = document.getElementById('ai_generate');
    let ai_exchange_button = document.getElementById('ai_exchange');
    ai_generate.ariaDisabled = null;
    ai_exchange_button.ariaDisabled = null;
    console.log('run');
    choose_material_generate_await(ai_hand);
    console.log(ai_choose_material);
    if (ai_choose_material) {
        let select_card = components_to_array(ai_choose_material.components);
        select_card.forEach((elem) => {
            ai_click_img_alt(elem);
        })
        ai_generate();
    } else {
        choose_material_exchange(ai_hand);
        ai_exchange();
    }
    p1_turn();
}

function p1_turn() {
    console.log('p1 turn');
    p1_view_hand();
    let ai_generate = document.getElementById('p1_generate');
    let ai_exchange_button = document.getElementById('p1_exchange');
    ai_generate.ariaDisabled = 'disabled';
    ai_exchange_button.ariaDisabled = 'disabled';
    let p1_generate_button = document.getElementById('p1_generate');
    let p1_exchange = document.getElementById('p1_exchange');
    p1_generate_button.ariaDisabled = null;
    p1_exchange.ariaDisabled = null;
    if (turn == 'ai') {ai_turn()};
}
