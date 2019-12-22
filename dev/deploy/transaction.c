#include "vntlib.h"

/*****************************************************************************
Copyright: vnt
No: 321
Name: transaction
Type: 1
Description: 做个交易
Version: 1
*****************************************************************************/


// ************* 监管数据定义 begin ************* //

EVENT REPORT_product(string name,string pid,string desc);

EVENT REPORT_order(string name,string From,string To,string pid,uint32 value);

// ************* 监管数据定义 end ************* //

// 初始化
constructor transaction()
{
	// Reg to supervisor!
	RegBizContract(321);
}

// ************* 业务方法 begin ************* //

// ************* 业务: 发布, 描述: 发布商品

MUTABLE
void publish(){

	// implement me!
	REPORT_product("product", );

}


// ************* 业务: 交易, 描述: 交易商品

MUTABLE
void trans(){

	// implement me!
	REPORT_order("order", );

}


// ************* 业务方法 end ************* //

