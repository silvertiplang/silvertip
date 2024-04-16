#include "../stdc++.h"
#include "exeption.hpp"

namespace slvrtp {
    const unsigned int 
      Error::NO_ERR = 0,
      Error::UNSPEC_ERR = 1,
      Error::NULL_ERR = 2,
      Error::UNKNOWN_TYPE_ERR = 3
    ;


  static inline void throwError(unsigned int type, std::string msg = "") {
    slvrtp::errs.push_back(Error(type, msg));
  }

  std::vector<Error> errs;
}