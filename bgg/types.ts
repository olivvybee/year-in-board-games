export interface BGGPlaySubtype {
  value: string;
}

export interface BGGPlayItem {
  subtypes: {
    subtype: BGGPlaySubtype[];
  };
  name: string;
  objecttype: string;
  objectid: string;
}

export interface BGGPlayPlayer {
  username: string;
  userid: string;
  name: string;
  startposition: string;
  color: string;
  score: string;
  new: string;
  rating: string;
  win: string;
}

export interface BGGPlay {
  item: BGGPlayItem;
  players?: {
    player: BGGPlayPlayer[];
  };
  id: string;
  date: string;
  quantity: string;
  length: string;
  incomplete: string;
  nowinstats: string;
  location: string;
}

export interface BGGGameName {
  type: string;
  sortindex: string;
  value: string;
}

export interface BGGGame {
  id: string;
  image: string;
  thumbnail: string;
  name: BGGGameName[];
}

export interface Game {
  id: string;
  name: string;
  image: string;
  thumbnail: string;
}
