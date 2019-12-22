#include "vntlib.h"

// ************* 监管数据定义 begin ************* //

EVENT REPORT_transaction(string name, string from, string to, string value);

// ************* 监管数据定义 end ************* //

// 初始化
constructor BizContract()
{
    // implement me!
    RegBizContract(123);
}

// ************* 业务方法 begin ************* //

// ************* 业务: 交易, 描述: It is for fun

MUTABLE
void Pub()
{
}

MUTABLE
void trans()
{
    // implement me!
    REPORT_transaction("transaction", "a", "b", "100");
}

// ************* 业务方法 end ************* //
