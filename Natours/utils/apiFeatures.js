
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) Filtering
    const queryObj = { ...this.queryString }; //req.query will not be present inside this class thats why we passed queryStr
    const excludedFields = ['page', 'sort', 'limit', 'fields']; //will ignore these queries
    excludedFields.forEach((el) => delete queryObj[el]);

    //1B) Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    this.query = this.query.find(JSON.parse(queryStr));

    return this;

    // let query = Tour.find(JSON.parse(queryStr));
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFileds() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // - is used for excluding
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; // way of wriiting default value in Js and 1 after || is used to set the default page to 1
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.sort({ _id: 1 }).skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;