const mongoose = require('mongoose');

module.exports = class Controller {
  constructor(collectionName, model) {
    this.collectionName = collectionName;
    this.Model = mongoose.model(this.collectionName, model);
  }

  async create(event, context, callback) {
    const requestBody = JSON.parse(event.body);
    const instance = new this.Model(requestBody);

    await this.validate(instance, callback);

    let document;
    try {
      document = await instance.save();
    } catch (error) {
      console.error(error);
      callback(null, {
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        statusCode: 500,
        body: JSON.stringify({
          message: `Error while submitting in collection ${this.Model.name} ${JSON.stringify(instance)}`,
        }),
      });
    }
    callback(null, {
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      statusCode: 200,

      body: JSON.stringify({
        message: `Successfully submitted in collection ${this.Model.name}`,
        document: document.toObject(),
      }),
    });
  }

  async validate(instance, callback) {
    try {
      await instance.validate();
    } catch (error) {
      callback(null, {
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        statusCode: 400,
        body: JSON.stringify({
          message: `Incorrect request, ${instance.toJSON()} didn't pass ${this.Model.name} validation`,
        }),
      });
    }
  }

  async list(event, context, callback) {
    try {
      const documents = await this.Model.find().sort({ submittedAt: 'desc' });
      return callback(null, {
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        statusCode: 200,
        body: JSON.stringify({
          documents,
        }),
      });
    } catch (err) {
      console.error('Error while getting mongodb data:', JSON.stringify(err, null, 2));
      return callback(null, {
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        statusCode: 500,
      });
    }
  }

  async delete(event, context, callback) {
    try {
      await this.Model.deleteOne({ _id: event.pathParameters.id });
    } catch (error) {
      console.error('Error while deleting document', JSON.stringify(error));
      return callback(null, {
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        statusCode: 500,
      });
    }
    return callback(null, {
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      statusCode: 204,
    });
  }
};