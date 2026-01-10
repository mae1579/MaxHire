const { v4: uuid } = require("uuid");
const { pool } = require("../utils/db");
const { ValidationError } = require("../utils/handleErrors");
const { UserRecord } = require("./UserRecord");

class OfferRecord {
  constructor(obj) {
    this.id = obj.id ?? uuid();
    this.title = obj.title;
    this.company = obj.company;
    this.description = obj.description;
    this.tech = obj.tech ? obj.tech : null;
    this.links = obj.links ? obj.links : null;
    this.updated = obj.updated ? obj.updated : null;
    this.user_id = obj.user_id ? obj.user_id : null;
  }

  async insert() {
    if (!this.user_id) {
      throw new ValidationError("User ID is required");
    }

    await pool.execute(
      "INSERT INTO `offers` (`id`, `title`,`company`, `description`, `tech`, `links`,`updated` , `user_id`) VALUES (:id,:title,:company, :description, :tech, :links, :updated,  :user_id) ",
      {
        id: this.id,
        title: this.title,
        company: this.company,
        description: this.description,
        tech: this.tech,
        links: this.links,
        updated: this.updated,
        user_id: this.user_id,
      },
    );
    return this.id;
  }

  static async findAll() {
    const [data] = await pool.execute("SELECT * FROM `offers` ");
    return data.map((elem) => new OfferRecord(elem));
  }

  static async findOneByUserId(user_id) {
    const [data] = await pool.execute(
      "SELECT * FROM `offers` WHERE `user_id` = :id",
      {
        id: user_id,
      },
    );
    return data.length > 0 ? data.map((elem) => new OfferRecord(elem)) : null;
  }
}

module.exports = {
  OfferRecord,
};
