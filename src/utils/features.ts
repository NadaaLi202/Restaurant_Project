import mongoose from "mongoose";

class Features {
  public paginationResult: any;
  public mongooseQuery: mongoose.Query<any[], any>; // Declare as a public property

  constructor(
    mongooseQuery: mongoose.Query<any[], any>,
    private queryString: any
  ) {
    this.mongooseQuery = mongooseQuery; // Assign in the constructor
  }

  filter() {
    const queryStringObj: any = { ...this.queryString };
    const executedFields: string[] = [
      "page",
      "limit",
      "sort",
      "fields",
      "search",
      "lang",
    ];
    executedFields.forEach((field: string): void => {
      delete queryStringObj[field];
    });

    let queryStr: string = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr)); // Properly reassign
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy: string = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields: string[] = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName: string) {
    if (this.queryString.search) {
      if (modelName === "Product") {
        this.mongooseQuery = this.mongooseQuery.find({
          $or: [
            { name: new RegExp(this.queryString.search, "i") },
            { description: this.queryString.search },
          ],
        });
      } else {
        this.mongooseQuery = this.mongooseQuery.find({
          name: new RegExp(this.queryString.search, "i"),
        });
      }
    }
    return this;
  }

  pagination(documentsCount: number) {
    const page: number = this.queryString.page * 1 || 1;
    const limit: number = this.queryString.limit * 1 || 20;
    const skip: number = (page - 1) * limit;
    const endIndex: number = page * limit;

    this.paginationResult = {
      currentPage: page,
      limit: limit,
      totalPages: Math.ceil(documentsCount / limit),
    };

    if (endIndex < documentsCount) {
      this.paginationResult.nextPage = page + 1;
    }
    if (skip > 0) {
      this.paginationResult.prevPage = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit); // Properly reassign
    return this;
  }
}

export default Features;
