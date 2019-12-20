#include "vntlib.h"

constructor Supervisor()
{
}

MUTABLE
bool RegisterBizContract(address addr, address owner, string name, uint32 bizType, string info)
{
    return false;
}

UNMUTABLE
void Report(string msg)
{
}

MUTABLE
uint32 RegBizMeta(string cfg)
{
    return 0;
}

UNMUTABLE
string GetBizMetaTemplate(uint32 bizType)
{
    return "";
}
