#include "../stdc++.h"
#include <type_traits>
#pragma once

namespace slvrtp {
  
  typedef struct Var {
    typedef struct Object {
      unsigned int type;
      Var*         feilds;

      //object data by type
      //     obj type               name         operator overloads
      static std::vector<std::tuple<std::string, std::tuple<
        Var*(*)(const Var& v, const Var& t) , //power
        Var*(*)(      Var& v, const Var& t) , //power_eq
        Var*(*)(const Var& v, const Var& t) , //plus      
        Var*(*)(const Var& v, const Var& t) , //minus     
        Var*(*)(const Var& v, const Var& t) , //times     
        Var*(*)(const Var& v, const Var& t) , //devide    
        Var*(*)(      Var& v, const Var& t) , //plus_eq   
        Var*(*)(      Var& v, const Var& t) , //minus_eq  
        Var*(*)(      Var& v, const Var& t) , //times_eq  
        Var*(*)(      Var& v, const Var& t) , //devide_eq 
        Var*(*)(const Var& v, const Var& t) , //mod       
        Var*(*)(      Var& v, const Var& t) , //mod_eq    
        Var*(*)(const Var& v, const Var& t) , //eqeq      
        Var*(*)(const Var& v, const Var& t) , //not_eq_   
        Var*(*)(const Var& v, const Var& t) , //greater   
        Var*(*)(const Var& v, const Var& t) , //less      
        Var*(*)(const Var& v, const Var& t) , //greater_eq
        Var*(*)(const Var& v, const Var& t) , //less_eq   
        Var*(*)(const Var& v, const Var& t) , //and_      
        Var*(*)(const Var& v, const Var& t) , //or_       
        Var*(*)(const Var& v              ) , //not_    
        Var*(*)(      Var& v              ) , //inc_pre 
        Var*(*)(      Var& v,          int) , //inc_post
        Var*(*)(      Var& v              ) , //dec_pre 
        Var*(*)(      Var& v,          int)   //dec_post
      >>> ObjTypeToData;
    } Object;

    Var () {
      memset(this, 0, sizeof(struct Var));
    }

    Var (double d) {
      //
    }


    //copy constructor
    Var (const Var& v) {
      memcpy(this, &v, sizeof(Var));
    }

    //null "constructor"
    static Var* nullVal() { return new Var(); } 
    static const Var* nullVal_k;

    union {
      std::string s;
      double      d;
      bool        b;
      char        c;
      std::vector<Var> l;
      Object      o;
    };
    uint8_t type;


    static const uint8_t
      UNSET , //or null
      STRING,
      DOUBLE,
      BOOL  ,
      CHAR  ,
      LIST  ,
      OBJECT
    ;

    static const uint8_t NUM_OPERATORS = 25;
    static const uint8_t
      POWER      ,
      POWER_EQ   ,
      PLUS       ,
      MINUS      ,
      TIMES      ,
      DEVIDE     ,
      PLUS_EQ    ,
      MINUS_EQ   ,
      TIMES_EQ   ,
      DEVIDE_EQ  ,
      MOD        ,
      MOD_EQ     ,
      EQEQ       ,
      NOT_EQ     ,
      GREATER    ,
      LESS       ,
      GREATER_EQ ,
      LESS_EQ    ,
      AND        ,
      OR         ,
      NOT        ,
      INC_PRE    ,
      INC_POST   ,
      DEC_PRE    ,
      DEC_POST
    ;

    bool isNull   () { return type == UNSET ; }
    bool isStr    () { return type == STRING; }
    bool isDouble () { return type == DOUBLE; }
    bool isBool   () { return type == BOOL  ; }
    bool isChar   () { return type == CHAR  ; }
    bool isList   () { return type == LIST  ; }
    bool isObj    () { return type == OBJECT; }

    //power
    template <typename T      > static Var* power      (const Var& v, const T& t) ;
    template <typename T      > static Var* power_eq   (      Var& v, const T& t) ;
    template <typename T = Var> static Var* power      (const Var& v, const T& t) ;
    template <typename T = Var> static Var* power_eq   (      Var& v, const T& t) ;

    //operators
    template <typename T> static Var* plus       (const Var& v, const T& t) ;
    template <typename T> static Var* minus      (const Var& v, const T& t) ;
    template <typename T> static Var* times      (const Var& v, const T& t) ;
    template <typename T> static Var* devide     (const Var& v, const T& t) ;
    template <typename T> static Var* plus_eq    (      Var& v, const T& t) ;
    template <typename T> static Var* minus_eq   (      Var& v, const T& t) ;
    template <typename T> static Var* times_eq   (      Var& v, const T& t) ;
    template <typename T> static Var* devide_eq  (      Var& v, const T& t) ;
    template <typename T> static Var* mod        (const Var& v, const T& t) ;
    template <typename T> static Var* mod_eq     (      Var& v, const T& t) ;
    template <typename T> static Var* eqeq       (const Var& v, const T& t) ;
    template <typename T> static Var* not_eq_    (const Var& v, const T& t) ;
    template <typename T> static Var* greater    (const Var& v, const T& t) ;
    template <typename T> static Var* less       (const Var& v, const T& t) ;
    template <typename T> static Var* greater_eq (const Var& v, const T& t) ;
    template <typename T> static Var* less_eq    (const Var& v, const T& t) ;
    template <typename T> static Var* and_       (const Var& v, const T& t) ;
    template <typename T> static Var* or_        (const Var& v, const T& t) ;

    template <typename T = Var> static Var* plus       (const Var& v, const T& t) ;
    template <typename T = Var> static Var* minus      (const Var& v, const T& t) ;
    template <typename T = Var> static Var* times      (const Var& v, const T& t) ;
    template <typename T = Var> static Var* devide     (const Var& v, const T& t) ;
    template <typename T = Var> static Var* plus_eq    (      Var& v, const T& t) ;
    template <typename T = Var> static Var* minus_eq   (      Var& v, const T& t) ;
    template <typename T = Var> static Var* times_eq   (      Var& v, const T& t) ;
    template <typename T = Var> static Var* devide_eq  (      Var& v, const T& t) ;
    template <typename T = Var> static Var* mod        (const Var& v, const T& t) ;
    template <typename T = Var> static Var* mod_eq     (      Var& v, const T& t) ;
    template <typename T = Var> static Var* eqeq       (const Var& v, const T& t) ;
    template <typename T = Var> static Var* not_eq_    (const Var& v, const T& t) ;
    template <typename T = Var> static Var* greater    (const Var& v, const T& t) ;
    template <typename T = Var> static Var* less       (const Var& v, const T& t) ;
    template <typename T = Var> static Var* greater_eq (const Var& v, const T& t) ;
    template <typename T = Var> static Var* less_eq    (const Var& v, const T& t) ;
    template <typename T = Var> static Var* and_       (const Var& v, const T& t) ;
    template <typename T = Var> static Var* or_        (const Var& v, const T& t) ;
    
    static Var* not_       (const Var& v            ) ;
    static Var* inc_pre    (      Var& v            ) ;
    static Var* inc_post   (      Var& v,        int) ;
    static Var* dec_pre    (      Var& v            ) ;
    static Var* dec_post   (      Var& v,        int) ;



    //unary +
    friend Var* operator+ (Var& v) {
        assert(v.isDouble());
        return new Var(v);
    }

    //unary -
    friend Var* operator- (Var& v) {
        assert(v.isDouble());
        return new Var(-(v.d));
    }

    //plus
    template <typename T> friend Var* operator+ (const T& t, const Var& v) {
      Var::plus<T>(v, t);
    }
    template <typename T> friend Var* operator+ (const Var& v, const T& t) {
      Var::plus<T>(v, t);
    }

    //minus
    template <typename T> friend Var* operator- (const T& t, const Var& v) {
      Var::minus<T>(v, t);
    }
    template <typename T> friend Var* operator- (const Var& v, const T& t) {
      Var::minus<T>(v, t);
    }

    //times
    template <typename T> friend Var* operator* (const T& t, const Var& v) {
      Var::times<T>(v, t);
    }
    template <typename T> friend Var* operator* (const Var& v, const T& t) {
      Var::times<T>(v, t);
    }

    //devide
    template <typename T> friend Var* operator/ (const T& t, const Var& v) {
      Var::devide<T>(v, t);
    }
    template <typename T> friend Var* operator/ (const Var& v, const T& t) {
      Var::devide<T>(v, t);
    }
  
    //plus equals
    template <typename T> friend Var* operator+= (Var& v, const T& t) {
      Var::plus_eq<T>(v, t);
    }

    //minus equals
    template <typename T> friend Var* operator-= (Var& v, const T& t) {
      Var::minus_eq<T>(v, t);
    }

    //times equals
    template <typename T> friend Var* operator*= (Var& v, const T& t) {
      Var::times_eq<T>(v, t);
    }

    //devide equals
    template <typename T> friend Var* operator/= (Var& v, const T& t) {
      Var::devide_eq<T>(v, t);
    }

    //mod
    template <typename T> friend Var* operator% (const T& t, const Var& v) {
      Var::mod<T>(v, t);
    }
    template <typename T> friend Var* operator% (const Var& v, const T& t) {
      Var::mod<T>(v, t);
    }

    //mod equals
    template <typename T> friend Var* operator%= (Var& v, const T& t) {
      Var::mod_eq<T>(v, t);
    }

    //==
    template <typename T> friend Var* operator== (const T& t, const Var& v) {
      Var::eqeq<T>(v, t);
    }
    template <typename T> friend Var* operator== (const Var& v, const T& t) {
      Var::eqeq<T>(v, t);
    }

    //!=
    template <typename T> friend Var* operator!= (const T& t, const Var& v) {
      Var::not_eq_<T>(v, t);
    }
    template <typename T> friend Var* operator!= (const Var& v, const T& t) {
      Var::not_eq_<T>(v, t);
    }

    //>
    template <typename T> friend Var* operator> (const T& t, const Var& v) {
      Var::greater<T>(v, t);
    }
    template <typename T> friend Var* operator> (const Var& v, const T& t) {
      Var::greater<T>(v, t);
    }

    //<
    template <typename T> friend Var* operator< (const T& t, const Var& v) {
      Var::less<T>(v, t);
    }
    template <typename T> friend Var* operator< (const Var& v, const T& t) {
      Var::less<T>(v, t);
    }

    //>=
    template <typename T> friend Var* operator>= (const T& t, const Var& v) {
      Var::greater_eq<T>(v, t);
    }
    template <typename T> friend Var* operator>= (const Var& v, const T& t) {
      Var::greater_eq<T>(v, t);
    }

    //<=
    template <typename T> friend Var* operator<= (const T& t, const Var& v) {
      Var::less_eq<T>(v, t);
    }
    template <typename T> friend Var* operator<= (const Var& v, const T& t) {
      Var::less_eq<T>(v, t);
    }

    // &&
    template <typename T> friend Var* operator&& (const T& t, const Var& v) {
      Var::and_<T>(v, t);
    }
    template <typename T> friend Var* operator&& (const Var& v, const T& t) {
      Var::and_<T>(v, t);
    }

    // ||
    template <typename T> friend Var* operator|| (const T& t, const Var& v) {
      Var::or_<T>(v, t);
    }
    template <typename T> friend Var* operator|| (const Var& v, const T& t) {
      Var::or_<T>(v, t);
    }

    // !
    template <typename T> friend Var* operator !(const Var& v) {
      Var::not_<T>(v, t);
    }
    template <typename T> friend Var* operator !(const T& t) {
      Var::not_<T>(v, t);
    }
  } Var;
};
