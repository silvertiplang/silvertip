#include "../stdc++.h"

namespace slvrtp {
  typedef struct Error {
    Error (int type, std::string msg) : type(type), msg(msg) {}

    std::string msg;
    unsigned int type;

    const static unsigned int 
      NO_ERR,
      UNSPEC_ERR,
      NULL_ERR,
      UNKNOWN_TYPE_ERR
      //...
    ;
  } Error;

  inline void throwError(unsigned int type, std::string msg = "") ;
  inline void throwCompError(unsigned int type, std::string msg = "") ;

  std::vector<Error> errs;
}