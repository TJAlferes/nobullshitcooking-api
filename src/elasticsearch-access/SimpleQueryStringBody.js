const SimpleQueryStringBody = function(q) {
  return {
    query: {
      bool: {
        must: [
          {
            simple_query_string: {
              query: q
            }
          }
        ]
      }
    }
  };
};

module.exports = SimpleQueryStringBody;