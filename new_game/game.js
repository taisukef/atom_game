let ai_hand = [];
let player_hand = [];

let ai_selected_cards =[];
let ai_selected_place = [];
let player_selected_cards =[];
let player_selected_place = [];

let can_make_material = [];
let make_material;

let ai_point = 0;
let player_point = 0

const elementToNumber = {"H": 1, "He": 2, "Li": 3, "Be": 4, "B": 5, "C": 6, "N": 7, "O": 8, "F": 9, "Ne": 10,"Na": 11, "Mg": 12, "Al": 13, "Si": 14, "P": 10, "S": 16, "Cl": 17, "Ar": 18, "K": 19, "Ca": 20,"Fe": 26, "Cu": 29, "Zn": 30, "I": 53};
const elements = [...Array(30).fill('H'), ...Array(25).fill('O'), ...Array(20).fill('C'),'He', 'Li', 'Be', 'B', 'N', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca','Fe', 'Cu', 'Zn', 'I'];
const element = ['H','O','C','He', 'Li', 'Be', 'B', 'N', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca','Fe', 'Cu', 'Zn', 'I']


let player_generate_button = document.getElementById('player_generate');
let player_exchange_button = document.getElementById('player_exchange');
player_generate_button.ariaDisabled = 'disabled';
player_exchange_button.ariaDisabled = 'disabled';

function array_to_dict(array) {
    const result = {};
    array.forEach(item => {
      if (result[item]) {
        result[item] += 1;
      } else {
        result[item] = 1;
      }
    });
    console.log(result);
    return result;
}

function reset_size(player_or_ai) {
    let div = document.getElementById(player_or_ai);
    let div_img = div.getElementsByTagName('img');
    for (i=0;i<div_img.length;i++){
        div_img[i].style.transform = 'scale(1.00)';
    }
}

function player_turn() {
    view_player_hand();
    let player_generate_button = document.getElementById('player_generate');
    let player_exchange_button = document.getElementById('player_exchange');
    player_generate_button.ariaDisabled = null;
    player_exchange_button.ariaDisabled = null;
}

document.getElementById('player_generate').addEventListener('click', function() {
    player_generate();
})

document.getElementById('player_exchange').addEventListener('click', function() {
    player_exchange();
})

async function ai_generate() {
    if (ai_selected_cards.length != 0) {
        let material
        await search_material(array_to_dict(ai_selected_cards)).then(data => material = data[0]);
        if (material !== undefined) {
                document.getElementById('ai_text').innerHTML = `<p>生成した物質：　　${material.name} (${material.formula}) - ${material.point} ポイント</p>`;
                ai_point += material.point;
                document.getElementById('ai_point').innerHTML = `<p>AIのポイント：${ai_point}</p>`
        } else {
            document.getElementById('ai_text').innerHTML = '該当の物質がありません';
            console.log(ai_selected_cards);
            ai_turn();
        }
        ai_exchange();
        ai_selected_cards = [];
        ai_selected_place = [0,0,0,0,0,0,0,0];
        turn = 'player';
    } else {
        document.getElementById('ai_text').innerHTML = 'カードが選択されていません';
        console.log(ai_selected_cards);
        ai_turn();
    }
}

function ai_exchange() {
    if (ai_selected_cards.length >= 1) {
        ai_selected_place.forEach((item,index) => {
            if (item == 1) {
                ai_hand[index] = get_card();
            };
        });
        ai_selected_cards = [];
        ai_selected_place = [0,0,0,0,0,0,0,0];
        view_ai_hand();
        turn = 'player';
    } else {
        document.getElementById('ai_text').innerHTML = 'カードが選択されていません';
        console.log(ai_selected_cards);
        ai_turn();
    }
}



async function player_generate() {
    if (player_selected_cards.length != 0) {
        let material
        await search_material(array_to_dict(player_selected_cards)).then(data => material = data[0]);
        if (material !== undefined) {
                document.getElementById('player_text').innerHTML = `<p>生成した物質：　　${material.name} (${material.formula}) - ${material.point} ポイント</p>`;
                player_point += material.point;
                document.getElementById('player_point').innerHTML = `<p>プレイヤーのポイント：${player_point}</p>`
        } else {
            document.getElementById('player_text').innerHTML = '該当の物質がありません';
        }
        player_exchange();
        player_selected_cards = [];
        player_selected_place = [0,0,0,0,0,0,0,0];
        turn = 'ai';
    } else {
        document.getElementById('player_text').innerHTML = 'カードが選択されていません';
    }
}

function player_exchange() {
    if (player_selected_cards.length >= 1) {
        player_selected_place.forEach((item,index) => {
            if (item == 1) {
                player_hand[index] = get_card();
            };
        });
        player_selected_cards = [];
        player_selected_place = [0,0,0,0,0,0,0,0];
        view_player_hand();
        turn = 'ai';
        if (win_check()) {turn="end";alert(player_point >= 250 ? 'playerの勝ち！':'AIの勝ち！')};
        if (turn == 'ai') {ai_turn()};
    } else {
        document.getElementById('player_text').innerHTML = 'カードが選択されていません';
    }
}

async function ai_turn() {
    view_ai_hand();
    let player_generate_button = document.getElementById('player_generate');
    let player_exchange_button = document.getElementById('player_exchange');
    player_generate_button.ariaDisabled = 'disabled';
    player_exchange_button.ariaDisabled = 'disabled';
    await search_make_materials().then(result => {make_material = result})
    await select_cards();
    ai_generate()
    if (turn = 'player'){player_turn()}
}

function select_cards() {
    return new Promise(resolve => {
        var need_cards = Object.entries(make_material.components).flatMap(([key, value]) => Array(value).fill(key));
        const cards = document.getElementsByClassName('ai_card');
        let j = 0;  // カウンター変数を初期化

        function selectNextCard() {
            if (j >= cards.length || j > 7) {
                resolve();  // 全てのカード選択が終了したらPromiseをresolveする
                return;
            }

            let elem = cards[j];
            if (need_cards.includes(elem.alt)) {
                need_cards.splice(need_cards.indexOf(elem.alt), 1);  // 正しく要素を削除
                elem.style.transform = 'scale(1.10)';
                ai_selected_cards.push(elem.alt);
                ai_selected_place[elem.id] = 1;
            }

            j++;  // カウンターを増やす
            setTimeout(selectNextCard, 300);  // 300ミリ秒後に次のカードを選択する
        }

        selectNextCard();  // 最初のカード選択を開始する
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

async function search_make_materials() {
    const components = ai_hand.reduce((acc, element) => {
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

function get_card() {
    return elements[Math.floor(Math.random() * elements.length)]
}

function initial_hand() {
    for (i=0;i<=7;i++) {
        player_hand.push(elements[Math.floor(Math.random() * elements.length)]);
        ai_hand.push(elements[Math.floor(Math.random() * elements.length)]);
    }
}

function view_ai_hand() {
    const Hand_div = document.getElementById('ai_hand');
    Hand_div.innerHTML = ``;
    ai_hand.forEach((elem,index) => {
        const img = document.createElement('img');
        img.src = `../image/${elementToNumber[elem]}.png`;
        img.alt = elem;
        img.id = index;
        img.className = 'ai_card';
        img.style.width = '60px';
        img.style.height = 'auto';
        img.style.border = '1px solid #000';
        img.style.margin = '5px';
        Hand_div.appendChild(img);
    })
}

function view_player_hand() {
    const Hand_div = document.getElementById('player_hand');
    Hand_div.innerHTML = ``;
    player_hand.forEach((elem,index) => {
        const img = document.createElement('img');
        img.src = `../image/${elementToNumber[elem]}.png`;
        img.alt = elem;
        img.id = index;
        img.className = 'ai_card';
        img.style.width = '60px';
        img.style.height = 'auto';
        img.style.border = '1px solid #000';
        img.style.margin = '5px';
        img.addEventListener('click', function() {
            if (turn == (player') {
                if (this.classList.contains('selected')) {
                    this.classList.remove('selected');
                    player_selected_cards.splice(player_selected_cards.indexOf(this.alt), 1);;
                    player_selected_place[this.id] = 0;
                    this.style.transform = 'scale(1.00)';
                } else {
                    this.classList.add('selected');
                    player_selected_cards.push(this.alt);
                    player_selected_place[this.id] = 1;
                    this.style.transform = 'scale(1.10)';
                }
            }
        });
        Hand_div.appendChild(img);
    })
}

function win_check() {
    if (player_point >= 250 || ai_point >= 250) {
        return true;
    }
}
let ai_hand = [];
let player_hand = [];

let ai_selected_cards =[];
let ai_selected_place = [];
let player_selected_cards =[];
let player_selected_place = [];

let can_make_material = [];
let make_material;

let ai_point = 0;
let player_point = 0

const elementToNumber = {"H": 1, "He": 2, "Li": 3, "Be": 4, "B": 5, "C": 6, "N": 7, "O": 8, "F": 9, "Ne": 10,"Na": 11, "Mg": 12, "Al": 13, "Si": 14, "P": 10, "S": 16, "Cl": 17, "Ar": 18, "K": 19, "Ca": 20,"Fe": 26, "Cu": 29, "Zn": 30, "I": 53};
const elements = [...Array(30).fill('H'), ...Array(25).fill('O'), ...Array(20).fill('C'),'He', 'Li', 'Be', 'B', 'N', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca','Fe', 'Cu', 'Zn', 'I'];
const element = ['H','O','C','He', 'Li', 'Be', 'B', 'N', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca','Fe', 'Cu', 'Zn', 'I']


let player_generate_button = document.getElementById('player_generate');
let player_exchange_button = document.getElementById('player_exchange');
player_generate_button.ariaDisabled = 'disabled';
player_exchange_button.ariaDisabled = 'disabled';

function array_to_dict(array) {
    const result = {};
    array.forEach(item => {
      if (result[item]) {
        result[item] += 1;
      } else {
        result[item] = 1;
      }
    });
    console.log(result);
    return result;
}

function reset_size(player_or_ai) {
    let div = document.getElementById(player_or_ai);
    let div_img = div.getElementsByTagName('img');
    for (i=0;i<div_img.length;i++){
        div_img[i].style.transform = 'scale(1.00)';
    }
}

function player_turn() {
    view_player_hand();
    let player_generate_button = document.getElementById('player_generate');
    let player_exchange_button = document.getElementById('player_exchange');
    player_generate_button.ariaDisabled = null;
    player_exchange_button.ariaDisabled = null;
}

document.getElementById('player_generate').addEventListener('click', function() {
    player_generate();
})

document.getElementById('player_exchange').addEventListener('click', function() {
    player_exchange();
})

async function ai_generate() {
    if (ai_selected_cards.length != 0) {
        let material
        await search_material(array_to_dict(ai_selected_cards)).then(data => material = data[0]);
        if (material !== undefined) {
                document.getElementById('ai_text').innerHTML = `<p>生成した物質：　　${material.name} (${material.formula}) - ${material.point} ポイント</p>`;
                ai_point += material.point;
                document.getElementById('ai_point').innerHTML = `<p>AIのポイント：${ai_point}</p>`
        } else {
            document.getElementById('ai_text').innerHTML = '該当の物質がありません';
            console.log(ai_selected_cards);
            ai_turn();
        }
        ai_exchange();
        ai_selected_cards = [];
        ai_selected_place = [0,0,0,0,0,0,0,0];
        turn = 'player';
    } else {
        document.getElementById('ai_text').innerHTML = 'カードが選択されていません';
        console.log(ai_selected_cards);
        ai_turn();
    }
}

function ai_exchange() {
    if (ai_selected_cards.length >= 1) {
        ai_selected_place.forEach((item,index) => {
            if (item == 1) {
                ai_hand[index] = get_card();
            };
        });
        ai_selected_cards = [];
        ai_selected_place = [0,0,0,0,0,0,0,0];
        view_ai_hand();
        turn = 'player';
    } else {
        document.getElementById('ai_text').innerHTML = 'カードが選択されていません';
        console.log(ai_selected_cards);
        ai_turn();
    }
}



async function player_generate() {
    if (player_selected_cards.length != 0) {
        let material
        await search_material(array_to_dict(player_selected_cards)).then(data => material = data[0]);
        if (material !== undefined) {
                document.getElementById('player_text').innerHTML = `<p>生成した物質：　　${material.name} (${material.formula}) - ${material.point} ポイント</p>`;
                player_point += material.point;
                document.getElementById('player_point').innerHTML = `<p>プレイヤーのポイント：${player_point}</p>`
        } else {
            document.getElementById('player_text').innerHTML = '該当の物質がありません';
        }
        player_exchange();
        player_selected_cards = [];
        player_selected_place = [0,0,0,0,0,0,0,0];
        turn = 'ai';
    } else {
        document.getElementById('player_text').innerHTML = 'カードが選択されていません';
    }
}

function player_exchange() {
    if (player_selected_cards.length >= 1) {
        player_selected_place.forEach((item,index) => {
            if (item == 1) {
                player_hand[index] = get_card();
            };
        });
        player_selected_cards = [];
        player_selected_place = [0,0,0,0,0,0,0,0];
        view_player_hand();
        turn = 'ai';
        if (win_check()) {turn="end";alert(player_point >= 250 ? 'playerの勝ち！':'AIの勝ち！')};
        if (turn == 'ai') {ai_turn()};
    } else {
        document.getElementById('player_text').innerHTML = 'カードが選択されていません';
    }
}

async function ai_turn() {
    view_ai_hand();
    let player_generate_button = document.getElementById('player_generate');
    let player_exchange_button = document.getElementById('player_exchange');
    player_generate_button.ariaDisabled = 'disabled';
    player_exchange_button.ariaDisabled = 'disabled';
    await search_make_materials().then(result => {make_material = result})
    await select_cards();
    ai_generate()
    if (turn = 'player'){player_turn()}
}

function select_cards() {
    return new Promise(resolve => {
        var need_cards = Object.entries(make_material.components).flatMap(([key, value]) => Array(value).fill(key));
        const cards = document.getElementsByClassName('ai_card');
        let j = 0;  // カウンター変数を初期化

        function selectNextCard() {
            if (j >= cards.length || j > 7) {
                resolve();  // 全てのカード選択が終了したらPromiseをresolveする
                return;
            }

            let elem = cards[j];
            if (need_cards.includes(elem.alt)) {
              const select_need_card = document.getElementsByClassName('ai_cards')[j];
              select_need_card.click();
            }

            j++;  // カウンターを増やす
            setTimeout(selectNextCard, 300);  // 300ミリ秒後に次のカードを選択する
        }

        selectNextCard();  // 最初のカード選択を開始する
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

async function search_make_materials() {
    const components = ai_hand.reduce((acc, element) => {
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

function get_card() {
    return elements[Math.floor(Math.random() * elements.length)]
}

function initial_hand() {
    for (i=0;i<=7;i++) {
        player_hand.push(elements[Math.floor(Math.random() * elements.length)]);
        ai_hand.push(elements[Math.floor(Math.random() * elements.length)]);
    }
}

function view_ai_hand() {
    const Hand_div = document.getElementById('ai_hand');
    Hand_div.innerHTML = ``;
    ai_hand.forEach((elem,index) => {
        const img = document.createElement('img');
        img.src = `../image/${elementToNumber[elem]}.png`;
        img.alt = elem;
        img.id = index;
        img.className = 'ai_card';
        img.style.width = '60px';
        img.style.height = 'auto';
        img.style.border = '1px solid #000';
        img.style.margin = '5px';
        img.addEventListener('click' {
          if (turn == 'ai') {
            if (this.ClassList.contains('selected')) {
              this.ClassList.remove('selected');
              this.style.transform = 'scale(1.00)';
              this.style.border = '1px solid #000';
              ai_selected_cards.splice(ai_selected_cards.IndexOf(this.alt),1);
              ai_selected_place[this.id] = 0;
            } else {
              this.ClassList.add('selected');
              this.style.transform = 'scale(1.10)';
              this.style.border = '1px solid #f00';
              ai_selected_cards.push(this.alt);
              ai_selected_place[this.id] = 1;
            }
          }
        })
        Hand_div.appendChild(img);
    })
}

function view_player_hand() {
    const Hand_div = document.getElementById('player_hand');
    Hand_div.innerHTML = ``;
    player_hand.forEach((elem,index) => {
        const img = document.createElement('img');
        img.src = `../image/${elementToNumber[elem]}.png`;
        img.alt = elem;
        img.id = index;
        img.className = 'ai_card';
        img.style.width = '60px';
        img.style.height = 'auto';
        img.style.border = '1px solid #000';
        img.style.margin = '5px';
        img.addEventListener('click', function() {
            if (turn == (player') {
                if (this.classList.contains('selected')) {
                    this.classList.remove('selected');
                    player_selected_cards.splice(player_selected_cards.indexOf(this.alt), 1);;
                    player_selected_place[this.id] = 0;
                    this.style.transform = 'scale(1.00)';
                } else {
                    this.classList.add('selected');
                    player_selected_cards.push(this.alt);
                    player_selected_place[this.id] = 1;
                    this.style.transform = 'scale(1.10)';
                }
            }
        });
        Hand_div.appendChild(img);
    })
}

function win_check() {
    if (player_point >= 250 || ai_point >= 250) {
        return true;
    }
}
