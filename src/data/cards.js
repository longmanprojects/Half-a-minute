export const cards = [
  { id: 1,
    front: ["Nelson Mandela", "Table Mountain", "Braai", "Michael Jordan", "Eiffel Tower"],
    back:  ["Desmond Tutu", "Robben Island", "Biltong", "Muhammad Ali", "Great Wall of China"] },

  { id: 2,
    front: ["Elon Musk", "Kruger National Park", "Springboks", "Barack Obama", "Titanic"],
    back:  ["Charlize Theron", "Soweto", "Bafana Bafana", "Oprah Winfrey", "The Lion King"] },

  { id: 3,
    front: ["Trevor Noah", "Drakensberg", "Boerewors", "Usain Bolt", "Star Wars"],
    back:  ["Miriam Makeba", "Cape of Good Hope", "Rooibos", "Roger Federer", "Harry Potter"] },

  { id: 4,
    front: ["AB de Villiers", "Stellenbosch", "Bunny Chow", "Lionel Messi", "iPhone"],
    back:  ["Caster Semenya", "Garden Route", "Bobotie", "Cristiano Ronaldo", "Google"] },

  { id: 5,
    front: ["Brenda Fassie", "Boulders Beach", "Nando's", "Tiger Woods", "Game of Thrones"],
    back:  ["Johnny Clegg", "Hermanus", "Castle Lager", "Serena Williams", "Breaking Bad"] },

  { id: 6,
    front: ["Gary Player", "Sun City", "Apartheid", "LeBron James", "Olympics"],
    back:  ["Graeme Smith", "Johannesburg", "1994 Elections", "Beyoncé", "FIFA World Cup"] },

  { id: 7,
    front: ["Naas Botha", "Victoria Falls", "Amarula", "Taylor Swift", "Pizza"],
    back:  ["FW de Klerk", "Kilimanjaro", "Savanna Cider", "Adele", "Sushi"] },

  { id: 8,
    front: ["Christiaan Barnard", "Bloemfontein", "Pick n Pay", "Rihanna", "Coca-Cola"],
    back:  ["Mark Shuttleworth", "Ladysmith Black Mambazo", "Woolworths SA", "Ed Sheeran", "McDonald's"] },

  { id: 9,
    front: ["Die Antwoord", "Protea", "Sasol", "Albert Einstein", "Machu Picchu"],
    back:  ["Naas Botha", "Big Five", "Discovery Health", "Winston Churchill", "Colosseum"] },

  { id: 10,
    front: ["2010 FIFA World Cup", "Sharpeville Massacre", "Eskom", "Black Hole", "Avatar"],
    back:  ["Rugby World Cup 2019", "Loadshedding", "Standard Bank", "DNA", "Friends"] },

  { id: 11,
    front: ["Niagara Falls", "Amazon Rainforest", "Sahara Desert", "Times Square", "Big Ben"],
    back:  ["Taj Mahal", "Statue of Liberty", "Hollywood", "Silicon Valley", "Vatican City"] },

  { id: 12,
    front: ["Queen Elizabeth II", "Princess Diana", "Marilyn Monroe", "Walt Disney", "Steve Jobs"],
    back:  ["Adolf Hitler", "Bill Gates", "Elvis Presley", "The Beatles", "Leonardo DiCaprio"] },

  { id: 13,
    front: ["The Godfather", "Jurassic Park", "The Simpsons", "Black Panther", "Squid Game"],
    back:  ["District 9", "Generations", "Breaking Bad", "Harry Potter", "Sydney Opera House"] },

  { id: 14,
    front: ["Great Barrier Reef", "Climate Change", "Photosynthesis", "Gravity", "Evolution"],
    back:  ["Big Bang", "Periodic Table", "Solar System", "Artificial Intelligence", "Bitcoin"] },

  { id: 15,
    front: ["Nutella", "Champagne", "Espresso", "Croissant", "Chocolate"],
    back:  ["Tequila", "Wimbledon", "Tour de France", "Formula One", "Super Bowl"] },

  { id: 16,
    front: ["Champions League", "Boston Marathon", "NBA Finals", "The Ashes", "Netflix"],
    back:  ["Instagram", "WhatsApp", "YouTube", "Twitter / X", "Zoom"] },

  { id: 17,
    front: ["World War II", "Moon Landing", "French Revolution", "Cold War", "9/11"],
    back:  ["COVID-19", "Berlin Wall", "Hiroshima", "Renaissance", "Industrial Revolution"] },

  { id: 18,
    front: ["Great White Shark", "African Elephant", "Cheetah", "Gorilla", "Blue Whale"],
    back:  ["Komodo Dragon", "Platypus", "Meerkat", "Wildebeest", "Penguin"] },

  { id: 19,
    front: ["Woodstock", "Grammy Awards", "Rolling Stones", "Bob Marley", "ABBA"],
    back:  ["Glastonbury", "David Bowie", "Freddie Mercury", "Jay-Z", "Drake"] },

  { id: 20,
    front: ["Oscars", "Miss Universe", "TED Talk", "Monopoly", "Rubik's Cube"],
    back:  ["Comic-Con", "Airbnb", "Nike", "LEGO", "Spotify"] },

  { id: 21,
    front: ["Madonna", "TikTok", "Mandela Effect", "Bloemfontein", "Pap"],
    back:  ["Glastonbury", "Silicon Valley", "Protea", "Cape Town", "Braai"] },
]

export function shuffleDeck(deck) {
  const arr = [...deck]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
