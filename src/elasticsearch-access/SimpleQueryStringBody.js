const SimpleQueryStringBody = function(userId, query) {
  return {
    query: {
      bool: {
        must: [
          {
            simple_query_string: {
              query
            }
          }
        ],
        filter: [
          {
            term: {
              userId
            }
          }
        ]
      }
    }
  };
};

module.exports = SimpleQueryStringBody;