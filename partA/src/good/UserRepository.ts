/**
 * Хэрэглэгчийн мэдээллийг хадгалах, олж авах, хайх интерфейс.
 */
export interface UserRepository {
  /**
   * Хэрэглэгчийг id-гаар олж авна.
   * @param id - Хэрэглэгчийн давтагдашгүй id
   * @returns Олдсон хэрэглэгч
   * @throws {UserNotFoundError} id-тэй хэрэглэгч байхгүй бол
   */
  findById(id: string): Promise<User>;

  /**
   * Хэрэглэгчийг имэйлээр олж авна.
   * @param email - Хэрэглэгчийн имэйл хаяг
   * @returns Олдсон хэрэглэгч
   * @throws {UserNotFoundError} имэйлтэй хэрэглэгч байхгүй бол
   */
  findByEmail(email: string): Promise<User>;

  /**
   * Хэрэглэгчдийг нэр эсвэл имэйлээр хайна.
   * @param query - Хайлтын мөр (хоосон байж болохгүй)
   * @returns Тохирсон хэрэглэгчдийн жагсаалт
   * @throws {InvalidQueryError} query хоосон бол
   */
  search(query: string): Promise<User[]>;
}

/**
 * Хэрэглэгчийн мэдээллийг өөрчлөх интерфейс.
 */
export interface UserService {
  /**
   * Шинэ хэрэглэгч үүсгэнэ.
   * @param data - Хэрэглэгчийн мэдээлэл (нэр, имэйл заавал байна)
   * @returns Үүсгэсэн хэрэглэгч
   * @throws {DuplicateEmailError} имэйл аль хэдийн бүртгэлтэй бол
   */
  createUser(data: CreateUserInput): Promise<User>;

  /**
   * Хэрэглэгчийн мэдээллийг шинэчилнэ.
   * @param id - Шинэчлэх хэрэглэгчийн id
   * @param data - Шинэчлэх талбарууд
   * @returns Шинэчилсэн хэрэглэгч
   * @throws {UserNotFoundError} хэрэглэгч байхгүй бол
   */
  updateUser(id: string, data: UpdateUserInput): Promise<User>;

  /**
   * Хэрэглэгчийг устгана (soft delete).
   * @param id - Устгах хэрэглэгчийн id
   * @throws {UserNotFoundError} хэрэглэгч байхгүй бол
   */
  deleteUser(id: string): Promise<void>;

  /**
   * Устгасан хэрэглэгчийг сэргээнэ.
   * @param id - Сэргээх хэрэглэгчийн id
   * @throws {UserNotFoundError} хэрэглэгч байхгүй бол
   * @throws {UserAlreadyActiveError} хэрэглэгч аль хэдийн идэвхтэй бол
   */
  restoreUser(id: string): Promise<User>;
}

/** Хэрэглэгчийн мэдээллийн бүтэц */
export interface User {
  readonly id: string;
  readonly email: string;
  name: string;
  readonly createdAt: Date;
  deletedAt: Date | null;
}

export interface CreateUserInput {
  name: string;
  email: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}
