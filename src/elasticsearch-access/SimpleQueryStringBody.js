const SimpleQueryStringBody = function(query) {
  return {
    query: {
      bool: {
        must: [
          {
            simple_query_string: {
              query
            }
          }
        ]
      }
    }
  };
};

module.exports = SimpleQueryStringBody;