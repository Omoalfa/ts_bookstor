import { Service } from "typedi";
import Validator from "..";
import { ETitle } from "@/types/db.types";
import { BookValidatorAdapter } from "@/Database/adapters/BookAdapter";
import { AuthorValidatorAdapter } from "@/Database/adapters/AuthorAdapter";

@Service()
class BookValidator extends Validator {
  constructor (
    private readonly bookAdapter: BookValidatorAdapter,
    private readonly authorAdapter: AuthorValidatorAdapter,
  ) {
    super()
  }

  public createBookValidator = this.validate({
    title: {
      in: ["body"],
      isString: true,
      notEmpty: true,
    },
    description: {
      in: ["body"],
      isString: true,
      optional: { options: { nullable: true }}
    },
    publish_date: {
      in: ["body"],
      isISO8601: true,
      notEmpty: true,
    },
    author_id: {
      in: ["body"],
      isInt: true,
      custom: {
        options: async (id: number, { req }) => {
          if (id) {
            // check if author exist
          const exist = await this.authorAdapter.DAuthorIdExist(id);

          if (!exist) throw new Error("This author already exist!")
          }
        }
      },
    },
    author_email: {
      in: ["body"],
      custom: {
        options: async (email: string, { req }) => {
          if (req.body.author_id == 0 && !email) {
            throw new Error("Title is required when author id is not defined")
          }
          
          /// check email exist in database
          if (email) {
            const exist = await this.authorAdapter.DAuthorEmailExist(email);

            if (exist) throw new Error("This author already exist!")
          }
        }
      },
      optional: true
    },
    author_name: {
      in: ["body"],
      isString: true,
      optional: true,
    },
    author_title: {
      in: ["body"],
      isIn: { options: [Object.values(ETitle)] },
      optional: true
    }
  })

  public updateBookValidator = this.validate({
    title: {
      in: ["body"],
      isString: true,
      notEmpty: true,
      optional: { options: { checkFalsy: true }}
    },
    description: {
      in: ["body"],
      isString: true,
      notEmpty: true,
      optional: { options: { checkFalsy: true }}
    },
    publish_date: {
      in: ["body"],
      isISO8601: true,
      optional: { options: { checkFalsy: true }}
    },
    author_id: {
      in: ["body"],
      isInt: true,
      custom: {
        options: async (id: number) => {
          const exist = await this.authorAdapter.DAuthorIdExist(id);

          if (!exist) throw new Error("Author doesn't exist")
        }
      },
      optional: { options: { checkFalsy: true }}
    }
  })

  public bookIdValidator = this.validate({
    id: {
      in: ["params"],
      isInt: true,
      notEmpty: true,
      custom: {
        options: async (id: number) => {
          const exist = await this.bookAdapter.DBBookExist(id);

          if (!exist) throw new Error("Book does not exist!")
        }
      }
    }
  })

  public getBooksValidator = this.validate({
    page: {
      in: ["query"],
      isIn: { options: [["next", "prev"]] },
      optional: true,
    },
    limit: {
      in: ["query"],
      isInt: true,
      optional: true,
    },
    pt: {
      in: ["query"],
      isString: true,
      matches: {
        options: /^p\d+:\d+-\d+(?:\|p\d+:\d+-\d+)*$/, errorMessage: "Invalid page tag"
      },
      optional: true
    },
    search: {
      in: ["query"],
      isString: true,
      optional: true,
    }
  })
}

export default BookValidator;
