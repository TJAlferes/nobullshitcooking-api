class CuisineEquipment {
  constructor(pool) {
    this.pool = pool;
    this.viewCuisineEquipmentByCuisineId = this.viewCuisineEquipmentByCuisineId.bind(this);
    this.createCuisineEquipment = this.createCuisineEquipment.bind(this);
    this.updateCuisineEquipment = this.updateCuisineEquipment.bind(this);
    this.deleteCuisineEquipment = this.deleteCuisineEquipment.bind(this);
  }

  async viewCuisineEquipmentByCuisineId(cuisineId) {
    const sql = `
      SELECT e.equipment_id, e.equipment_name
      FROM nobsc_cuisine_equipment ce
      INNER JOIN nobsc_equipment e ON e.equipment_id = ce.equipment_id
      WHERE ce.cuisine_id = ?
      GROUP BY e.equipment_type_id
      ORDER BY e.equipment_name ASC
    `;

    const [ cuisineEquipment ] = await this.pool.execute(sql, [cuisineId]);

    return cuisineEquipment;
  }

  async createCuisineEquipment() {
    const sql = `
    
    `;
    
  }

  async updateCuisineEquipment() {
    const sql = `
    
    `;
    
  }

  async deleteCuisineEquipment() {
    const sql = `
    
    `;
    
  }
}

module.exports = CuisineEquipment;