#include "vntlib.h"

constructor RemoteCall()
{
}

//声明CALL
CALL void SetNickName(CallParams params, string name);
CALL string SayHello(CallParams params);

MUTABLE
uint32 testcall(address addr)
{
    CallParams params = {addr, U256(0), 1000};
    string name = FromU64(GetTimestamp());
    SetNickName(params, name);
    SayHello(params);
}