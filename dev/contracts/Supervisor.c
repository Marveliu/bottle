#include "vntlib.h"

constructor Supervisor()
{
}

// 更新配置
MUTABLE
void UpdateConfig(string cfg)
{
}

// 业务合约汇报消息
MUTABLE
void Report(address addr, string dataName, string msg)
{
}

// 获取配置
UNMUTABLE
string GetConfig()
{
    return "";
}

MUTABLE
bool RegisterBizContract(address addr, address owner, uint32 bizType)
{
    return false;
}

// 返回业务合约内容
UNMUTABLE
string GetBizContract(address addr)
{
    return "";
}

// 校验业务合约
UNMUTABLE
bool ValidateBizContract(address addr)
{
    return false;
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
