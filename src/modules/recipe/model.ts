import { assert, string } from 'superstruct';

import { GenerateUUIDv7StringId, UUIDv7StringId, NumberId } from '../shared/model';

export class Recipe {
  private recipe_id;
  private recipe_type_id;
  private cuisine_id;
  private author_id;
  private owner_id;
  private title;
  private description;
  private active_time;
  private total_time;
  private directions;

  private constructor(params: ConstructorParams) {
    this.recipe_id      = UUIDv7StringId(params.recipe_id);
    this.recipe_type_id = NumberId(params.recipe_type_id);
    this.cuisine_id     = NumberId(params.cuisine_id);
    this.author_id      = UUIDv7StringId(params.author_id);
    this.owner_id       = UUIDv7StringId(params.owner_id);
    this.title          = Title(params.title);
    this.description    = Description(params.description);
    this.active_time    = Time(params.active_time);
    this.total_time     = Time(params.active_time);
    this.directions     = Directions(params.directions);
  }

  static create(params: CreateParams) {
    const recipe_id = GenerateUUIDv7StringId();
    return new Recipe({...params, recipe_id});
  }

  static update(params: UpdateParams) {
    return new Recipe(params);
  }

  getDTO() {
    return {
      recipe_id:      this.recipe_id,
      recipe_type_id: this.recipe_type_id,
      cuisine_id:     this.cuisine_id,
      author_id:      this.author_id,
      owner_id:       this.owner_id,
      title:          this.title,    
      description:    this.description,
      active_time:    this.active_time,
      total_time:     this.total_time,
      directions:     this.directions,
    };
  }
}

export function Title(title: string) {
  assert(title, string());
  if (title.length > 100) {
    throw new Error ("Recipe title must be no more than 100 characters.")
  }
  return title;
}

export function Description(description: string) {
  assert(description, string());
  if (description.length > 150) {
    throw new Error("Recipe description must be no more than 150 characters.");
  }
  return description;
}

function Time(time: string) {
  assert(time, string());

  const [ hours, minutes ] = time.split(':');
  if (hours.length !== 2) {
    throw new Error("Invalid time.");
  }
  if (minutes.length !== 2) {
    throw new Error("Invalid time.");
  }
  
  const hrs = parseInt(hours);
  const mins = parseInt(minutes);
  if (isNaN(hrs) || isNaN(mins) || hrs < 0 || hrs > 23 || mins < 0 || mins > 59) {
    throw new Error("Invalid time.");
  }
  
  return time;
}

export function Directions(directions: string) {
  assert(directions, string());
  if (directions.length > 1000) {
    throw new Error("Recipe directions must be no more than 2,000 characters.");
  }
  return directions;
}

type CreateParams = {
  recipe_type_id: number;
  cuisine_id:     number;
  author_id:      string;
  owner_id:       string;
  title:          string;
  description:    string;
  active_time:    string;
  total_time:     string;
  directions:     string;
};

type UpdateParams = CreateParams & {
  recipe_id: string;
}

type ConstructorParams = UpdateParams;
