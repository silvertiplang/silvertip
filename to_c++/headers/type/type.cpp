#include "type.hpp"
#include "../exeption/exeption.hpp"

namespace slvrtp {
  const uint8_t
    Var::UNSET  = 0,
    Var::STRING = 1,
    Var::DOUBLE = 3,
    Var::BOOL   = 4,
    Var::CHAR   = 5,
    Var::LIST   = 6,
    Var::OBJECT = 7
  ;

  const uint8_t
      Var::POWER       =  0,
      Var::POWER_EQ    =  1,
      Var::PLUS        =  2,
      Var::MINUS       =  3,
      Var::TIMES       =  4,
      Var::DEVIDE      =  5,
      Var::PLUS_EQ     =  6,
      Var::MINUS_EQ    =  7,
      Var::TIMES_EQ    =  8,
      Var::DEVIDE_EQ   =  9,
      Var::MOD         = 10,
      Var::MOD_EQ      = 11,
      Var::EQEQ        = 12,
      Var::NOT_EQ      = 13,
      Var::GREATER     = 14,
      Var::LESS        = 15,
      Var::GREATER_EQ  = 16,
      Var::LESS_EQ     = 17,
      Var::AND         = 18,
      Var::OR          = 19,
      Var::NOT         = 20,
      Var::INC_PRE     = 21,
      Var::INC_POST    = 22,
      Var::DEC_PRE     = 23,
      Var::DEC_POST    = 24
    ;

  const Var* Var::nullVal_k = new Var();

  //power

  template <typename T> Var* Var::power (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        slvrtp::throwCompError(slvrtp::Error::UNSPEC_ERR "[INSERT ERR MSG HERE]");
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T> Var* Var::power_eq (Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        slvrtp::throwCompError(slvrtp::Error::UNSPEC_ERR "[INSERT ERR MSG HERE]");
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T = Var> Var* Var::power (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::POWER>()(v, const (Var&)T);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T = Var> Var* Var::power_eq (Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::POWER_EQ>()(v, const (Var&)T);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }

  // operators
  
  template <typename T> Var* Var::plus (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        slvrtp::throwCompError(slvrtp::Error::UNSPEC_ERR "[INSERT ERR MSG HERE]");
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T> Var* Var::minus (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        slvrtp::throwCompError(slvrtp::Error::UNSPEC_ERR "[INSERT ERR MSG HERE]");
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T> Var* Var::times (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        slvrtp::throwCompError(slvrtp::Error::UNSPEC_ERR "[INSERT ERR MSG HERE]");
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T> Var* Var::devide (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        slvrtp::throwCompError(slvrtp::Error::UNSPEC_ERR "[INSERT ERR MSG HERE]");
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T> Var* Var::plus_eq (Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        slvrtp::throwCompError(slvrtp::Error::UNSPEC_ERR "[INSERT ERR MSG HERE]");;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T> Var* Var::minus_eq (Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        slvrtp::throwCompError(slvrtp::Error::UNSPEC_ERR "[INSERT ERR MSG HERE]");;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T> Var* Var::times_eq (Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        slvrtp::throwCompError(slvrtp::Error::UNSPEC_ERR "[INSERT ERR MSG HERE]");;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T> Var* Var::devide_eq (Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        slvrtp::throwCompError(slvrtp::Error::UNSPEC_ERR "[INSERT ERR MSG HERE]");;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T> Var* Var::mod (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        slvrtp::throwCompError(slvrtp::Error::UNSPEC_ERR "[INSERT ERR MSG HERE]");;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T> Var* Var::mod_eq (Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        slvrtp::throwCompError(slvrtp::Error::UNSPEC_ERR "[INSERT ERR MSG HERE]");;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T> Var* Var::eqeq (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        slvrtp::throwCompError(slvrtp::Error::UNSPEC_ERR "[INSERT ERR MSG HERE]");;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T> Var* Var::not_eq_ (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        slvrtp::throwCompError(slvrtp::Error::UNSPEC_ERR "[INSERT ERR MSG HERE]");;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T> Var* Var::greater (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        slvrtp::throwCompError(slvrtp::Error::UNSPEC_ERR "[INSERT ERR MSG HERE]");;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T> Var* Var::less (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        slvrtp::throwCompError(slvrtp::Error::UNSPEC_ERR "[INSERT ERR MSG HERE]");;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T> Var* Var::greater_eq (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        slvrtp::throwCompError(slvrtp::Error::UNSPEC_ERR "[INSERT ERR MSG HERE]");;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T> Var* Var::less_eq (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        slvrtp::throwCompError(slvrtp::Error::UNSPEC_ERR "[INSERT ERR MSG HERE]");;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T> Var* Var::and_ (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        slvrtp::throwCompError(slvrtp::Error::UNSPEC_ERR "[INSERT ERR MSG HERE]");;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T> Var* Var::or_ (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        slvrtp::throwCompError(slvrtp::Error::UNSPEC_ERR "[INSERT ERR MSG HERE]");;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }

  
  template <typename T = Var> Var* Var::plus (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::PLUS>()(v, const (Var&)T);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }
    };
  }
  
  template <typename T = Var> Var* Var::minus (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::MINUS>()(v, const (Var&)T);
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }
  
  template <typename T = Var> Var* Var::times (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::TIMES>()(v, const (Var&)T);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }
  
  template <typename T = Var> Var* Var::devide (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::DEVIDE>()(v, const (Var&)T);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }
  
  template <typename T = Var> Var* Var::plus_eq (Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::PLUS_EQ>()(v, const (Var&)T);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }
  
  template <typename T = Var> Var* Var::minus_eq (Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::MINUS_EQ>()(v, const (Var&)T);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }
  
  template <typename T = Var> Var* Var::times_eq (Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::TIMES_EQ>()(v, const (Var&)T);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }
  
  template <typename T = Var> Var* Var::devide_eq (Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::DEVIDE_EQ>()(v, const (Var&)T);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }
  
  template <typename T = Var> Var* Var::mod (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::MOD>()(v, const (Var&)T);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }
  
  template <typename T = Var> Var* Var::mod_eq (Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::MOD_EQ>()(v, const (Var&)T);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }
  
  template <typename T = Var> Var* Var::eqeq (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::EQEQ>()(v, const (Var&)T);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }
  
  template <typename T = Var> Var* Var::not_eq_ (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::NOT_EQ>()(v, const (Var&)T);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }
  
  template <typename T = Var> Var* Var::greater (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::GREATER>()(v, const (Var&)T);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }
  
  template <typename T = Var> Var* Var::less (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::LESS>()(v, const (Var&)T);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }
  
  template <typename T = Var> Var* Var::greater_eq (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::GREATER_EQ>()(v, const (Var&)T);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }
  
  template <typename T = Var> Var* Var::less_eq (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::LESS_EQ>()(v, const (Var&)T);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }
  
  template <typename T = Var> Var* Var::and_ (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::AND>()(v, const (Var&)T);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }
  
  template <typename T = Var> Var* Var::or_ (const Var& v, const T& t) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::OR>()(v, const (Var&)T);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }
  
  Var* Var::not_ (const Var& v) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::NOT>()(v, const (Var&)T);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }

  Var* Var::inc_pre (Var& v) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::INC_PRE>()(v);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }

  Var* Var::inc_post (Var& v, int) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::INC_POST>()(v);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }

  Var* Var::dec_pre (Var& v) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::DEC_PRE>()(v);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }

  Var* Var::dec_post (Var& v, int) {
    switch (v.type) {
      case Var::UNSET :{
        slvrtp::throwCompError(slvrtp::Error::NULL_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

      case Var::STRING :{
        return;
      }

      case Var::DOUBLE :{
        return;
      }

      case Var::BOOL :{
        return;
      }

      case Var::CHAR :{
        return;
      }

      case Var::LIST :{
        return;
      }

      case Var::OBJECT:{
        return Var::Object::ObjTypeToData[v.o.type].get<1>().get<Var::DEC_POST>()(v);;
      }

      default :{
        slvrtp::throwCompError(slvrtp::Error::UNKNOWN_TYPE_ERR, "[INSERT ERR MSG HERE]");
        return Var::nullVal();
      }

    };
  }
};