const { pool } = require("../utils/db.js");
const { v4: uuid } = require("uuid");
const { ValidationError } = require("../utils/handleErrors");

class UserRecord {
  constructor(obj) {
    const {
      id,
      email,
      password,
      role = "user",
      name,
      surname,
      phone = null,
    } = obj;

    this.id = id ?? uuid();
    this.email = email;
    this.password = password;
    this.role = role ?? "user";
    this.name = name;
    this.surname = surname;
    this.phone = phone;

    // Wykonac walidację pól !

    if (!this.email.includes("@")) {
      throw new ValidationError("Email musi zawierać znak @");
    }
  }

  async insert() {
    const result = await pool.execute(
      "INSERT INTO `users` (`id`, `email`, `password`, `role`, `name`, `surname`, `phone`) VALUES (:id,:email, :password, :role, :name, :surname, :phone)",
      {
        id: this.id,
        email: this.email,
        password: this.password,
        role: this.role,
        name: this.name,
        surname: this.surname,
        phone: this.phone,
      },
    );
    return this.id;
  }

  async delete(id) {
    if (!this.id) {
      throw new ValidationError("Aby usunąc użytkownika wymagane jest jego id");
    }
    await pool.execute("DELETE FROM `users` WHERE `id` = :id", {
      id: this.id,
    });
  }

  static async findOneByEmail(email) {
    const [result] = await pool.execute(
      "SELECT * FROM `users` WHERE `email` = :email",
      {
        email: email,
      },
    );
    return result.length === 0 ? null : new UserRecord(result[0]);
  }
  static async findById(id) {
    const [result] = await pool.execute(
      "SELECT * FROM `users` WHERE `id` = :id",
      {
        id: id,
      },
    );
    return result.length === 0 ? null : new UserRecord(result[0]);
  }
  static async findAll() {
    const [result] = await pool.execute("SELECT * FROM `users`");
    return result.map((elem) => new UserRecord(elem));
  }
}

module.exports = {
  UserRecord,
};
