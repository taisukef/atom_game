let ai_hand = [];
let player_hand = [];


let can_make_material = [];
let make_material;

const elementToNumber = {"H": 1, "He": 2, "Li": 3, "Be": 4, "B": 5, "C": 6, "N": 7, "O": 8, "F": 9, "Ne": 10,"Na": 11, "Mg": 12, "Al": 13, "Si": 14, "P": 10, "S": 16, "Cl": 17, "Ar": 18, "K": 19, "Ca": 20,"Fe": 26, "Cu": 29, "Zn": 30, "I": 53};
const elements = [...Array(30).fill('H'), ...Array(25).fill('O'), ...Array(20).fill('C'),'He', 'Li', 'Be', 'B', 'N', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca','Fe', 'Cu', 'Zn', 'I'];
const element = ['H','O','C','He', 'Li', 'Be', 'B', 'N', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca','Fe', 'Cu', 'Zn', 'I']

function ai_turn() {
    view_ai_hand()
    search_make_materials().then(result => {console.log(result);make_material = result})
    console.log(make_material)
    //document.getElementsByClassName('ai_card')[2].style.transform = 'scale(1.10)';
}

document.getElementById('get').addEventListener('click' ,function() {
    console.log(make_material);
})

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
