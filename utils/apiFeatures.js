class APIFeatures {
  // create 2 properties for using in whole class
  constructor(query, queryString) { 
    this.query = query; // mongoose query object
    this.queryString = queryString; // from the route (url - req.query)
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    if ('name' in queryObj) {
      queryObj['name'] = new RegExp(queryObj['name'], "i");
    }

    if ('price' in queryObj) {
      queryObj['price'] = { $lte: queryObj['price'] };
    }

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdDate');
    }

    return this;
  }

  paginate(limit) {
    const page = this.queryString.page * 1 || 1;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
