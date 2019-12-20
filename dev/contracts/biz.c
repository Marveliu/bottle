#include "vntlib.h"


// ************* 监管数据定义 begin ************* //

EVENT REPORT_Obj1(string name,string From,string To);

EVENT REPORT_Obj2(string name,string To);

// ************* 监管数据定义 end ************* //

// 初始化
constructor 交易()
{
	// implement me!
}

// ************* 业务方法 begin ************* //

// ************* 业务: 发布, 描述: 发布商品

UNMUTABLE
void publish(){

	// implement me!
	REPORT_Obj1("Obj1", );

}


// ************* 业务: 交易, 描述: 交易商品

UNMUTABLE
void transaction(){

	// implement me!
	REPORT_Obj3("Obj3", );

}


// ************* 业务方法 end ************* //

