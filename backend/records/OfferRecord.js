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

    // Obecna data przy każdym nowym elemencie
    this.updated = Math.floor(Date.now() / 1000);

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

  async update() {
    await pool.execute(
      "UPDATE `offers` SET `title` = :title, `company` = :company, `description` = :description, `tech` = :tech, `links` = :links, `updated` = :updated WHERE `id` = :id",
      {
        id: this.id,
        title: this.title,
        company: this.company,
        description: this.description,
        tech: this.tech,
        links: this.links,
        updated: this.updated,
      },
    );
  }

  static async findAllGeminiData() {
    const [data] = await pool.execute(
      "SELECT `users`.`photo`, `offers`.`id`, `offers`.`title`, `offers`.`company`, `offers`.`description`, `offers`.`tech`, `offers`.`links`, `offers`.`updated`, `offers`.`user_id` FROM `users` INNER JOIN `offers` ON `users`.`id` = `offers`.`user_id`",
    );
    return data.length > 0 ? data.map((elem) => elem) : null;
  }

  static async findAllFiltr(limit, offset, search) {
    let sql =
      "SELECT `users`.`photo`, `offers`.`id`, `offers`.`title`, `offers`.`company`, `offers`.`description`, `offers`.`tech`, `offers`.`links`, `offers`.`updated`, `offers`.`user_id` FROM `users` INNER JOIN `offers` ON `users`.`id` = `offers`.`user_id`";

    const params = {
      limit: limit.toString(),
      offset: offset.toString(),
    };

    const countParams = {};

    const cleanSearch = (search || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

    const escapeLike = (str) => str.replace(/[%_\\]/g, "\\$&");

    const words = cleanSearch ? cleanSearch.split(" ").slice(0, 10) : [];

    let searchCondition = "";

    if (words.length > 0) {
      const whereClauses = [];
      const scoreParts = [];

      const escapedFull = escapeLike(cleanSearch);
      params.fullSearch = `%${escapedFull}%`;
      params.startsWith = `${escapedFull}%`;

      // Kolejność trafności: tytuł -> technologie -> nazwa firmy
      scoreParts.push(
        "(CASE WHEN LOWER(`offers`.`title`) LIKE :startsWith THEN 100 ELSE 0 END)",
        "(CASE WHEN LOWER(`offers`.`title`) LIKE :fullSearch THEN 60 ELSE 0 END)",
        "(CASE WHEN LOWER(`offers`.`tech`) LIKE :fullSearch THEN 40 ELSE 0 END)",
        "(CASE WHEN LOWER(`offers`.`company`) LIKE :fullSearch THEN 30 ELSE 0 END)",
      );

      words.forEach((word, index) => {
        const key = `word${index}`;
        const value = `%${escapeLike(word)}%`;

        params[key] = value;
        countParams[key] = value;

        whereClauses.push(
          `(LOWER(\`offers\`.\`title\`) LIKE :${key} OR LOWER(\`offers\`.\`tech\`) LIKE :${key} OR LOWER(\`offers\`.\`company\`) LIKE :${key})`,
        );

        scoreParts.push(
          `(CASE WHEN LOWER(\`offers\`.\`title\`) LIKE :${key} THEN 20 ELSE 0 END)`,
          `(CASE WHEN LOWER(\`offers\`.\`tech\`) LIKE :${key} THEN 15 ELSE 0 END)`,
          `(CASE WHEN LOWER(\`offers\`.\`company\`) LIKE :${key} THEN 10 ELSE 0 END)`,
        );
      });

      searchCondition = ` WHERE ${whereClauses.join(" AND ")}`;
      sql += searchCondition;
      sql += ` ORDER BY (${scoreParts.join(" + ")}) DESC, \`offers\`.\`updated\` DESC LIMIT :limit OFFSET :offset`;
    } else {
      sql += " ORDER BY `offers`.`updated` DESC LIMIT :limit OFFSET :offset";
    }

    const [data] = await pool.execute(sql, params);

    let countsql =
      "SELECT COUNT(*) as total FROM `users` INNER JOIN `offers` ON `users`.`id` = `offers`.`user_id`";

    if (searchCondition) {
      countsql += searchCondition;
    }

    const [countRows] = await pool.execute(countsql, countParams);

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
    const [data] = await pool.execute(
      "SELECT * FROM `offers` ORDER BY `updated` DESC",
    );
    return data.length > 0 ? data.map((elem) => new OfferRecord(elem)) : null;
  }

  static async findOneByUserId(user_id) {
    const [data] = await pool.execute(
      "SELECT `users`.`photo`, `offers`.`id`, `offers`.`title`, `offers`.`company`, `offers`.`description`, `offers`.`tech`, `offers`.`links`, `offers`.`updated`, `offers`.`user_id` FROM `users` INNER JOIN `offers` ON `users`.`id` = `offers`.`user_id` WHERE `user_id` = :id ORDER BY `offers`.`updated` DESC",
      {
        id: user_id,
      },
    );
    return data.length > 0 ? data.map((elem) => elem) : null;
    //return data.length > 0 ? data.map((elem) => new OfferRecord(elem)) : null;
  }

  static async getOneOffer(user_id) {
    const [data] = await pool.execute(
      "SELECT `users`.`id` AS `user_id`, `users`.`email`, `users`.`name`, `users`.`surname`, `users`.`phone`, `users`.`photo`, `offers`.`id`, `offers`.`title`, `offers`.`company`, `offers`.`description`, `offers`.`tech`, `offers`.`links`, `offers`.`updated` FROM `users` INNER JOIN `offers` ON `users`.`id` = `offers`.`user_id` WHERE `offers`.`id` = :id",

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
