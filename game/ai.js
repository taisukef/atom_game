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

function reset_size(player_or_ai) {
    let div = document.getElementById(player_or_ai);
    let div_img = div.getElementsByTagName('img');
    for (i=0;i<div_img.length;i++){
        div_img[i].style.transform = 'scale(1.00)';
    }
}

async function ai_generate() {
    if (ai_selected_cards.length != 0) {
        let material
        await search_material(array_to_dict(ai_selected_cards)).then(data => material = data[0]);;
        if (material !== undefined) {
                document.getElementById('ai_text').innerHTML = `<p>生成した物質：　　${material.name} (${material.formula}) - ${material.point} ポイント</p>`;
                ai_point += material.point;
                document.getElementById('ai_point').innerHTML = `<p>AIのポイント：${ai_point}</p>`
        } else {
            document.getElementById('ai_text').innerHTML = '該当の物質がありません';
        }
        ai_exchange();
        ai_selected_cards = [];
        ai_selected_place = [0,0,0,0,0,0,0,0];
        turn = 'player';
    } else {
        console.log(ai_selected_cards)
        document.getElementById('ai_text').innerHTML = 'カードが選択されていません';
    }
}

async function ai_turn() {
    view_ai_hand()
    await search_make_materials().then(result => {make_material = result})
    console.log(make_material)
    await select_cards()
    await ai_generate()
    turn = 'player';
}

function select_cards() {
    const need_cards = Object.entries(make_material.components).flatMap(([key, value]) => Array(value).fill(key));
    console.log(need_cards)
    const cards = document.getElementsByClassName('ai_card');
    for (i=0;i<=7;i++) {
        elem = cards[i]
        console.log(elem.alt)
        console.log(need_cards.includes(elem.alt))
        if (need_cards.includes(elem.alt)) {
            need_cards.splice(need_cards.indexOf(elem.alt),0);
            elem.style.transform = 'scale(1.10)';
            ai_selected_cards.push(elem.alt);
            ai_selected_place[elem.id] = 1;
        }
    }
    console.log(ai_selected_cards)
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
        player_hand.push(get_card());
        ai_hand.push(get_card());
    }
}

function view_ai_hand() {
    const Hand_div = document.getElementById('ai_hand');
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
