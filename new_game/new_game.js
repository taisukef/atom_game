let ai_hand = [];
let pl_hand = [];

let ai_selected_cards = [];
let ai_selected_place = [];
let pl_selected_cards = [];
let pl_selected_place = [];

let turn = 'pl';

function ai_turn() {}
function pl_turn() {}
function ai_exchange() {}
function pl_exchange() {}
function ai_generate() {}
function pl_generate() {}

function view_ai_hand() {
  const Hand_div = document.getElementById('ai_hand');
  Hand_div.innerHTML == '';
  ai_hand.forEach((elem,index) => {
    const img = document.createElement('img');
    img.id = index;
    img.alt = elem;
    img.style.border = '1px solid #000';
    img.style.margin = '5px';
    img.ClassName = 'ai_crad';
    img.addEventListener('click', function() {
      if (turn == 'ai') {
        if (this.ClassList.contains('selected')) {
          this.ClassList.add('selected');
        }
      }
    })
  })
}

function view_pl_hand() {
  const Hand_div = document.getElementById('pl_hand');
  Hand_div.innerHTML == '';
  pl_hand.forEach((elem,index) => {
    const img = document.createElement('img');
    img.id = index;
    img.alt = elem;
    img.style.border = '1px solid #000';
    img.style.margin = '5px';
    img.ClassName = 'ai_crad';
    img.addEventListener('click', function() {
      if (turn == 'pl') {
        if (this.ClassList.contains('selected')) {
          this.ClassList.add('selected');
        }
      }
    })
  })
}}

function get_random_card() {}
function make_initial_hand() {}

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
