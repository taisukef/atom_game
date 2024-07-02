let ai_hand = [];
let player_hand = [];

const elementToNumber = {"H": 1, "He": 2, "Li": 3, "Be": 4, "B": 5, "C": 6, "N": 7, "O": 8, "F": 9, "Ne": 10,"Na": 11, "Mg": 12, "Al": 13, "Si": 14, "P": 10, "S": 16, "Cl": 17, "Ar": 18, "K": 19, "Ca": 20,"Fe": 26, "Cu": 29, "Zn": 30, "I": 53};
const elements = [...Array(30).fill('H'), ...Array(25).fill('O'), ...Array(20).fill('C'),'He', 'Li', 'Be', 'B', 'N', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca','Fe', 'Cu', 'Zn', 'I'];
const element = ['H','O','C','He', 'Li', 'Be', 'B', 'N', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca','Fe', 'Cu', 'Zn', 'I']

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
        img.addEventListener('click' , function() {
            console.log('test');
        })
        Hand_div.appendChild(img);
    })
}