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

  static async findAllFiltr(limit, offset, search) {
    let sql =
      "SELECT `users`.`photo`, `offers`.`id`, `offers`.`title`, `offers`.`company`, `offers`.`description`, `offers`.`tech`, `offers`.`links`, `offers`.`updated`, `offers`.`user_id` FROM `users` INNER JOIN `offers` ON `users`.`id` = `offers`.`user_id`";

    const params = {
      limit: limit.toString(),
      offset: offset.toString(),
    };

    const searchCondition =
      " WHERE (`title` LIKE :search OR `company` LIKE :search OR `description` LIKE :search OR `tech` LIKE :search)";

    if (search) {
      sql += searchCondition;
      params.search = `%${search}%`;
    }

    sql += " LIMIT :limit OFFSET :offset";

    const [data] = await pool.execute(sql, params);

    let countsql = "SELECT COUNT(*) as total from `offers`";

    if (search) {
      countsql += searchCondition;
    }

    const [countRows] = await pool.execute(countsql, params);

    return {
      offers: data.map((el) => el),
      totalPages: Math.ceil(countRows[0].total / limit),
    };
  }

  static async findOneByIdOffer(offer_id) {
    const [data] = await pool.execute(
      "SELECT * FROM `offers` WHERE `id` = :id",
      {
        id: offer_id,
      },
    );
    return data.length === 0 ? null : new OfferRecord(data[0]);
  }

  static async findAll() {
    const [data] = await pool.execute("SELECT * FROM `offers` ");
    return data.length > 0 ? data.map((elem) => new OfferRecord(elem)) : null;
  }

  static async findOneByUserId(user_id) {
    const [data] = await pool.execute(
      "SELECT `users`.`photo`, `offers`.`id`, `offers`.`title`, `offers`.`company`, `offers`.`description`, `offers`.`tech`, `offers`.`links`, `offers`.`updated`, `offers`.`user_id` FROM `users` INNER JOIN `offers` ON `users`.`id` = `offers`.`user_id` WHERE `user_id` = :id",
      {
        id: user_id,
      },
    );
    return data.length > 0 ? data.map((elem) => elem) : null;
    //return data.length > 0 ? data.map((elem) => new OfferRecord(elem)) : null;
  }

  static async getOneOffer(user_id) {
    const [data] = await pool.execute(
      "SELECT `users`.`email`, `users`.`email`, `users`.`name`, `users`.`surname`, `users`.`phone`, `users`.`photo`, `offers`.`title`, `offers`.`company`, `offers`.`description`, `offers`.`tech`, `offers`.`links`, `offers`.`updated` FROM `users` INNER JOIN `offers` ON `users`.`id` = `offers`.`user_id` WHERE `offers`.`id` = :id",

      {
        id: user_id,
      },
    );
    return data.length === 0 ? null : data;
  }
  async delete() {
    await pool.execute("DELETE FROM `offers` WHERE `id` = :id", {
      id: this.id,
    });
  }
}

module.exports = {
  OfferRecord,
};
