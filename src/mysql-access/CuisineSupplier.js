class CuisineSupplier {
  constructor(pool) {
    this.pool = pool;
    this.viewCuisineSuppliersByCuisineId = this.viewCuisineSuppliersByCuisineId.bind(this);
    this.createCuisineSupplier = this.createCuisineSupplier.bind(this);
    this.updateCuisineSupplier = this.updateCuisineSupplier.bind(this);
    this.deleteCuisineSupplier = this.deleteCuisineSupplier.bind(this);
  }

  async viewCuisineSuppliersByCuisineId() {
    const sql = `
    
    `;

  }

  async createCuisineSupplier() {
    const sql = `
    
    `;
    
  }

  async updateCuisineSupplier() {
    const sql = `
    
    `;
    
  }

  async deleteCuisineSupplier() {
    const sql = `
    
    `;
    
  }
}

module.exports = CuisineSupplier;