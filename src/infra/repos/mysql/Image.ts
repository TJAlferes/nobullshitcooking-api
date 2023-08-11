import { MySQLRepo } from './MySQL';

export class ImageRepo extends MySQLRepo implements IImageRepo {
  insert(params: InsertParams) {

  }

  update(params: InsertParams) {

  }

  delete(image_id: string) {

  }
}

interface IImageRepo {

}

type InsertParams = {

};
