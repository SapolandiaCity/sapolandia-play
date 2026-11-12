export const GAMES = [
  { id:'tiger-gold',      name:'TIGER GOLD',      tag:'Tigre Original',   cat:'animais',   c1:'#ffc247', c2:'#a34a0d', mult:2, hot:1, art:{ear:'cat',     f1:'#ffc247', f2:'#5c2400'}, relics:['claw','coin','stripe'] },
  { id:'rabbit-luck',     name:'RABBIT LUCK',     tag:'Sorte da Toca',    cat:'animais',   c1:'#bdeaff', c2:'#3d7ba8', mult:2, art:{ear:'long',    f1:'#eef8ff', f2:'#8fb6d6'}, relics:['clover','carrot','coin'] },
  { id:'bull-fortune',    name:'BULL FORTUNE',    tag:'Força do Touro',   cat:'animais',   c1:'#ff9a6b', c2:'#8c3308', mult:3, art:{ear:'round',   f1:'#ffa77c', f2:'#521800', horn:'bull'}, relics:['horseshoe','bell','coin'] },
  { id:'dragon-fire',     name:'DRAGON FIRE',     tag:'Fogo Ancestral',   cat:'magico',    c1:'#ff7389', c2:'#8a1030', mult:3, hot:1, art:{ear:'fin', f1:'#ff8095', f2:'#5c0a20', horn:'dragon'}, relics:['flame','scale','coin'] },
  { id:'golden-fish',     name:'GOLDEN FISH',     tag:'Mar de Ouro',      cat:'animais',   c1:'#5ee0f7', c2:'#116079', mult:2, art:{ear:'fin',     f1:'#78e8fb', f2:'#0a4459'}, relics:['shell','bubble','coin'] },
  { id:'fruit-party',     name:'FRUIT PARTY',     tag:'Festa Tropical',   cat:'frutas',    c1:'#ff87ac', c2:'#8f1440', mult:2, art:{ear:'leaf',    f1:'#ff9ab8', f2:'#6b0f30'}, relics:['cherry','grape','star'] },
  { id:'rocket',          name:'ROCKET',          tag:'Rumo ao Cosmo',    cat:'aventura',  c1:'#9aa6ff', c2:'#333c8f', mult:3, art:{ear:'none',    f1:'#a9b4ff', f2:'#232a66'}, relics:['rocket','planet','star'] },
  { id:'lucky-wheel',     name:'LUCKY WHEEL',     tag:'Roleta da Sorte',  cat:'classicos', c1:'#ffdd70', c2:'#8f6a10', mult:2, art:{ear:'round',   f1:'#ffe487', f2:'#6b4f0a'}, relics:['wheel','clover','coin'] },
  { id:'magic-fortune',   name:'MAGIC FORTUNE',   tag:'Feitiço Dourado',  cat:'magico',    c1:'#c99bff', c2:'#5a2a94', mult:4, art:{ear:'spike',   f1:'#d6b0ff', f2:'#431f70', horn:'wizard'}, relics:['potion','rune','star'] },
  { id:'golden-horse',    name:'GOLDEN HORSE',    tag:'Galope de Ouro',   cat:'animais',   c1:'#ffd06b', c2:'#8a5c0a', mult:3, art:{ear:'horse',   f1:'#ffdb8a', f2:'#6b4408'}, relics:['horseshoe','bell','coin'] },
  { id:'panda-treasure',  name:'PANDA TREASURE',  tag:'Tesouro do Bambu', cat:'animais',   c1:'#eaf2ff', c2:'#48536b', mult:2, art:{ear:'panda',   f1:'#f6faff', f2:'#333c50'}, relics:['bamboo','lantern','coin'] },
  { id:'monkey-king',     name:'MONKEY KING',     tag:'Rei da Montanha',  cat:'animais',   c1:'#ffbb70', c2:'#8c4408', mult:3, art:{ear:'monkey',  f1:'#ffc98a', f2:'#6b3206'}, relics:['banana','staff','coin'] },
  { id:'lion-jackpot',    name:'LION JACKPOT',    tag:'Coroa do Rei',     cat:'animais',   c1:'#ffe066', c2:'#8f6a08', mult:4, hot:1, art:{ear:'cat', f1:'#ffe985', f2:'#6b4f06', horn:'crown'}, relics:['crown','claw','coin'] },
  { id:'phoenix-rise',    name:'PHOENIX RISE',    tag:'Renascimento',     cat:'magico',    c1:'#ff9166', c2:'#8c2c08', mult:4, art:{ear:'feather', f1:'#ffa07a', f2:'#6b2006', horn:'crest'}, relics:['feather','flame','star'] },
  { id:'diamond-mines',   name:'DIAMOND MINES',   tag:'Minas de Cristal', cat:'aventura',  c1:'#9ceeff', c2:'#146a7d', mult:3, art:{ear:'none',    f1:'#b0f2ff', f2:'#0f4f5e', horn:'helmet'}, relics:['diamond','pick','gem'] },
  { id:'space-spin',      name:'SPACE SPIN',      tag:'Órbita Neon',      cat:'aventura',  c1:'#c0a8ff', c2:'#452a94', mult:3, art:{ear:'antenna', f1:'#cdb8ff', f2:'#331f70'}, relics:['planet','ufo','star'] },
  { id:'candy-world',     name:'CANDY WORLD',     tag:'Doce Aventura',    cat:'frutas',    c1:'#ffa8d8', c2:'#8f1f66', mult:2, art:{ear:'candy',   f1:'#ffbde2', f2:'#6b1750'}, relics:['candy','lollipop','cherry'] },
  { id:'wild-jungle',     name:'WILD JUNGLE',     tag:'Coração Verde',    cat:'aventura',  c1:'#7ceea8', c2:'#12693a', mult:3, art:{ear:'leaf',    f1:'#8ff2b6', f2:'#0d4f2b'}, relics:['leaf','vine','star'] },
  { id:'treasure-island', name:'TREASURE ISLAND', tag:'Mapa Perdido',     cat:'aventura',  c1:'#ffd47a', c2:'#8a6410', mult:4, art:{ear:'bandana', f1:'#ffdd93', f2:'#6b4c0a'}, relics:['chest','compass','coin'] },
  { id:'mega-fortune',    name:'MEGA FORTUNE',    tag:'Jackpot Máximo',   cat:'classicos', c1:'#ffe45c', c2:'#9c0f14', mult:5, hot:1, art:{ear:'crown2', f1:'#ffe97a', f2:'#6b0a0e', horn:'crown'}, relics:['seven','bell','diamond'] }
];

export const CATS = [
  ['todos', 'Todos'], ['animais', 'Animais'], ['magico', 'Mágico'],
  ['aventura', 'Aventura'], ['frutas', 'Frutas'], ['classicos', 'Clássicos']
];

export const getGame = (id) => GAMES.find((g) => g.id === id);
