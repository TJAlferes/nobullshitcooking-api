import { RecipeImageRepoInterface } from "./repo";

export class RecipeImageService {
  repo: RecipeImageRepoInterface;

  constructor(repo: RecipeImageRepoInterface) {
    this.repo = repo;
  }

  async create() {}

  async update() {}

  async delete() {}
}

// TO DO: only allow the following images per recipe:
// 1 image      of completed and plated recipe (primary image)
// 1 image      of required equipment image
// 1 image      of required ingredients image
// 1-3 image(s) of prepping/cooking detail/process/action

// if type === 1|2|3 then order = 1
// if type === 4     then order = given user input (but still 1|2|3)
