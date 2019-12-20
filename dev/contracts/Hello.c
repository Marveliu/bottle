#include "vntlib.h"

typedef struct
{
  string nickName;     //昵称
} User;

KEY mapping(address, User) accounts;
KEY address owner;
KEY User user;


EVENT EVENT_NICKNAME(indexed address from, string nickName);

constructor Hello()
{
  owner = GetSender();
}

MUTABLE
void SetNickName(string name){
  address from = GetSender();
  accounts.key = from;
  accounts.value.nickName = name;
  EVENT_NICKNAME(from, name);
}

string getNickNameFromAddress(address addr)
{
  accounts.key = addr;
  return accounts.value.nickName;
}

string getNickName() { return getNickNameFromAddress(GetSender()); }

UNMUTABLE
string SayHello(){
    address from = GetSender();
    Require(!Equal(from, ""),"Account is Not Existed");
    string name = getNickName();
    PrintStr("Hello", name);
    return name;
}
